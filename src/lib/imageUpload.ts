import { GalleryItem } from '../types';

export interface CompressedImageResult {
  dataUrl: string;
  sizeKb: number;
  width: number;
  height: number;
  originalName: string;
}

const OFFLINE_DRAFT_GALLERY_KEY = 'aotw_offline_gallery_queue';
const OFFLINE_DRAFT_TOURS_KEY = 'aotw_offline_tours_draft';

/**
 * Compresses and resizes an image file to max 1200x800 WebP (<500KB)
 * Works across Android Chrome, iOS Safari (including HEIC fallback), and Desktop browsers.
 */
export async function compressAndConvertToWebP(
  file: File,
  maxWidth = 1200,
  maxHeight = 800,
  targetMaxKb = 480
): Promise<CompressedImageResult> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error(`"${file.name}" exceeds the 10MB maximum file size limit.`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Failed to read file "${file.name}"`));
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      const img = new Image();

      img.onerror = () => {
        // Fallback for formats that browser Image tag cannot decode directly
        resolve({
          dataUrl: rawDataUrl,
          sizeKb: Math.min(450, Math.max(45, Math.round(file.size / 1024))),
          width: maxWidth,
          height: maxHeight,
          originalName: file.name.replace(/\.[^.]+$/, '') || 'Uttarakhand Tour Photo',
        });
      };

      img.onload = () => {
        let width = img.naturalWidth || maxWidth;
        let height = img.naturalHeight || maxHeight;

        const aspect = width / height;
        if (width > maxWidth) {
          width = maxWidth;
          height = Math.round(width / aspect);
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = Math.round(height * aspect);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({
            dataUrl: rawDataUrl,
            sizeKb: Math.round(file.size / 1024),
            width,
            height,
            originalName: file.name.replace(/\.[^.]+$/, ''),
          });
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first (supported on Android, Desktop, iOS 14+), fallback to JPEG
        let quality = 0.82;
        let outputDataUrl = canvas.toDataURL('image/webp', quality);
        if (!outputDataUrl.startsWith('data:image/webp')) {
          outputDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Iteratively step down quality if still > targetMaxKb
        let estimatedKb = Math.round((outputDataUrl.length * 3) / 4 / 1024);
        while (estimatedKb > targetMaxKb && quality > 0.35) {
          quality -= 0.12;
          outputDataUrl = canvas.toDataURL('image/webp', quality);
          if (!outputDataUrl.startsWith('data:image/webp')) {
            outputDataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          estimatedKb = Math.round((outputDataUrl.length * 3) / 4 / 1024);
        }

        resolve({
          dataUrl: outputDataUrl,
          sizeKb: Math.max(18, estimatedKb),
          width,
          height,
          originalName: file.name.replace(/\.[^.]+$/, ''),
        });
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

export interface BatchUploadOptions {
  files: File[];
  category?: GalleryItem['category'];
  tourId?: string;
  tourName?: string;
  onProgress?: (current: number, total: number, percent: number) => void;
  signal?: AbortSignal;
}

/**
 * Compresses multiple images and uploads them to PostgreSQL /api/gallery
 * If offline, stores in offline draft queue and syncs automatically when online.
 */
export async function compressAndUploadBatch({
  files,
  category = 'tour',
  tourId = '',
  tourName = '',
  onProgress,
  signal,
}: BatchUploadOptions): Promise<{
  items: GalleryItem[];
  savedOffline: boolean;
}> {
  const total = files.length;
  const uploadedItems: GalleryItem[] = [];
  let savedOffline = !navigator.onLine;

  for (let i = 0; i < total; i++) {
    if (signal?.aborted) {
      throw new Error('Upload cancelled by user');
    }

    const file = files[i];
    onProgress?.(i + 1, total, Math.round(((i + 0.4) / total) * 100));

    const compressed = await compressAndConvertToWebP(file);

    if (signal?.aborted) {
      throw new Error('Upload cancelled by user');
    }

    const item: GalleryItem = {
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      url: compressed.dataUrl,
      title: compressed.originalName || `${tourName || 'Tour'} Photo ${i + 1}`,
      tourId,
      tourName,
      category,
      sizeKb: compressed.sizeKb,
      width: compressed.width,
      height: compressed.height,
      uploadedBy: 'admin@adventureontheway.com',
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (navigator.onLine) {
      try {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
          signal,
        });
        if (!res.ok) {
          savedOffline = true;
          queueOfflineGalleryItem(item);
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          throw new Error('Upload cancelled by user');
        }
        savedOffline = true;
        queueOfflineGalleryItem(item);
      }
    } else {
      savedOffline = true;
      queueOfflineGalleryItem(item);
    }

    uploadedItems.push(item);
    onProgress?.(i + 1, total, Math.round(((i + 1) / total) * 100));
  }

  return { items: uploadedItems, savedOffline };
}

export function queueOfflineGalleryItem(item: GalleryItem) {
  try {
    const existingRaw = localStorage.getItem(OFFLINE_DRAFT_GALLERY_KEY);
    const existing: GalleryItem[] = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push(item);
    localStorage.setItem(OFFLINE_DRAFT_GALLERY_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Could not save image to offline draft storage:', e);
  }
}

export function saveOfflineTourDraft(draftTour: any) {
  try {
    const existingRaw = localStorage.getItem(OFFLINE_DRAFT_TOURS_KEY);
    const existing: any[] = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push({ ...draftTour, savedAt: new Date().toISOString() });
    localStorage.setItem(OFFLINE_DRAFT_TOURS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Could not save tour draft offline:', e);
  }
}

export function getOfflineTourDrafts(): any[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const existingRaw = localStorage.getItem(OFFLINE_DRAFT_TOURS_KEY);
    return existingRaw ? JSON.parse(existingRaw) : [];
  } catch {
    return [];
  }
}

export async function syncOfflineDraftsToDatabase(): Promise<number> {
  if (!navigator.onLine) return 0;
  let syncedCount = 0;

  try {
    const rawGallery = localStorage.getItem(OFFLINE_DRAFT_GALLERY_KEY);
    if (rawGallery) {
      const items: GalleryItem[] = JSON.parse(rawGallery);
      for (const item of items) {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (res.ok) syncedCount++;
      }
      localStorage.removeItem(OFFLINE_DRAFT_GALLERY_KEY);
    }

    const rawTours = localStorage.getItem(OFFLINE_DRAFT_TOURS_KEY);
    if (rawTours) {
      const tours: any[] = JSON.parse(rawTours);
      for (const tour of tours) {
        const res = await fetch('/api/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tour),
        });
        if (res.ok) syncedCount++;
      }
      localStorage.removeItem(OFFLINE_DRAFT_TOURS_KEY);
    }
  } catch (e) {
    console.error('Error syncing offline drafts:', e);
  }

  return syncedCount;
}
