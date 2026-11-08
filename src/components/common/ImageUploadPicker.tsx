import React, { useRef, useState } from 'react';
import {
  Camera,
  Image as ImageIcon,
  Upload,
  X,
  Star,
  ArrowLeft,
  ArrowRight,
  Check,
  WifiOff,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import { compressAndUploadBatch } from '../../lib/imageUpload';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';

interface ImageUploadPickerProps {
  images: string[];
  onChange: (newImages: string[]) => void;
  maxImages?: number;
  category?: GalleryItem['category'];
  tourId?: string;
  tourName?: string;
  label?: string;
  singleMode?: boolean;
}

export const ImageUploadPicker: React.FC<ImageUploadPickerProps> = ({
  images,
  onChange,
  maxImages = 10,
  category = 'tour',
  tourId = '',
  tourName = '',
  label = '📸 Add Photos From Gallery / Camera',
  singleMode = false,
}) => {
  const { gallery, addGalleryItems, showToast } = useApp();
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progressState, setProgressState] = useState<{
    current: number;
    total: number;
    percent: number;
  }>({ current: 0, total: 0, percent: 0 });
  const [showExistingModal, setShowExistingModal] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const remainingSlots = singleMode ? 1 : Math.max(0, maxImages - images.length);
    if (remainingSlots <= 0) {
      showToast(`Maximum ${maxImages} photos allowed per tour.`, 'error');
      return;
    }

    const filesArray = Array.from(fileList).slice(0, remainingSlots);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setUploading(true);
    setProgressState({ current: 1, total: filesArray.length, percent: 10 });

    try {
      const { items, savedOffline } = await compressAndUploadBatch({
        files: filesArray,
        category,
        tourId,
        tourName,
        signal: controller.signal,
        onProgress: (current, total, percent) => {
          setProgressState({ current, total, percent });
        },
      });

      addGalleryItems(items);
      const uploadedUrls = items.map((i) => i.url);

      if (singleMode) {
        onChange([uploadedUrls[0]]);
      } else {
        onChange([...images, ...uploadedUrls]);
      }

      if (savedOffline) {
        showToast(
          'No Internet - Images saved in draft, will upload when online',
          'info'
        );
      } else {
        showToast(
          `${items.length} photo(s) compressed (<500KB WebP) & uploaded!`,
          'success'
        );
      }
    } catch (err: any) {
      showToast(err?.message || 'Image upload cancelled or failed', 'error');
    } finally {
      setUploading(false);
      abortControllerRef.current = null;
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, idx) => idx !== index));
  };

  const handleSetAsCover = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    onChange([target, ...rest]);
    showToast('Updated Cover Photo (First image is always Cover)!', 'success');
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[newIndex];
    copy[newIndex] = temp;
    onChange(copy);
  };

  const handleSelectExisting = (url: string) => {
    if (singleMode) {
      onChange([url]);
      setShowExistingModal(false);
      showToast('Photo selected from existing Gallery!', 'success');
      return;
    }
    if (images.includes(url)) {
      onChange(images.filter((i) => i !== url));
    } else if (images.length < maxImages) {
      onChange([...images, url]);
    } else {
      showToast(`Maximum ${maxImages} photos reached.`, 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden Native Device File Pickers (Android / iOS / Desktop) */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
        multiple={!singleMode}
        onChange={(e) => handleFilesSelected(e.target.files)}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFilesSelected(e.target.files)}
        className="hidden"
      />

      {/* Offline Draft Warning Banner */}
      {typeof navigator !== 'undefined' && !navigator.onLine && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-semibold">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>
            No Internet - Images saved in draft, will upload automatically when online.
          </span>
        </div>
      )}

      {/* Primary Big Touch Buttons + Desktop Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-3xl border-2 border-dashed p-5 transition-all ${
          isDragging
            ? 'border-[#FF6B35] bg-[#FF6B35]/10 scale-[1.01]'
            : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-800/40 hover:border-[#0B3D2E] dark:hover:border-emerald-500/60'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Big Button 1: Open Phone Gallery / File Explorer */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 min-h-[56px] px-5 py-3.5 rounded-2xl bg-[#0B3D2E] hover:bg-[#093125] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg transition cursor-pointer disabled:opacity-50"
          >
            <ImageIcon className="w-5 h-5 text-[#FF6B35] shrink-0" />
            <span>{label}</span>
          </button>

          {/* Big Button 2: Take Photo with Camera (Android / iPhone) */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={uploading}
            className="min-h-[56px] px-4 py-3.5 rounded-2xl bg-[#FF6B35] hover:bg-[#e85a25] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
          >
            <Camera className="w-5 h-5 shrink-0" />
            <span>Take Photo</span>
          </button>

          {/* Big Button 3: Select from Existing Gallery */}
          <button
            type="button"
            onClick={() => setShowExistingModal(true)}
            disabled={uploading}
            className="min-h-[56px] px-4 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-[#FF6B35] text-zinc-800 dark:text-zinc-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <FolderOpen className="w-4 h-4 text-[#FF6B35] shrink-0" />
            <span>From Saved Gallery ({gallery.length})</span>
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span>
            ✨ Auto-compresses to &lt;500KB (1200×800 WebP) • JPG, PNG, WEBP, iPhone HEIC supported
          </span>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {images.length} / {singleMode ? 1 : maxImages} selected (Drag or use arrows to reorder; 1st = Cover)
          </span>
        </div>

        {/* Upload Progress Bar with % and Cancel Button */}
        {uploading && (
          <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-500/30 shadow-md space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading {progressState.current}/{progressState.total}...{' '}
                {progressState.percent}%
              </span>
              <button
                type="button"
                onClick={handleCancelUpload}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition"
              >
                Cancel
              </button>
            </div>
            <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0B3D2E] to-[#FF6B35] transition-all duration-300 rounded-full"
                style={{ width: `${progressState.percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Instant Thumbnail Previews with Cover Badge, Reorder & Remove */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((imgUrl, idx) => (
            <div
              key={`${imgUrl.slice(0, 36)}-${idx}`}
              draggable={!singleMode}
              onDragStart={() => setDraggedIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedIdx === null || draggedIdx === idx) return;
                const copy = [...images];
                const [moved] = copy.splice(draggedIdx, 1);
                copy.splice(idx, 0, moved);
                onChange(copy);
                setDraggedIdx(null);
              }}
              className={`group relative rounded-2xl overflow-hidden border-2 bg-zinc-100 dark:bg-zinc-800 aspect-[3/2] shadow-sm transition ${
                idx === 0
                  ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/30'
                  : 'border-zinc-200 dark:border-zinc-700'
              }`}
            >
              <img
                src={imgUrl}
                alt={`Tour preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Cover Photo Badge or Make Cover Button */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                {idx === 0 ? (
                  <span className="px-2.5 py-1 rounded-full bg-[#FF6B35] text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-white" /> Cover Photo
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetAsCover(idx)}
                    className="px-2 py-1 rounded-full bg-black/70 hover:bg-[#FF6B35] text-white text-[10px] font-bold backdrop-blur-xs transition"
                  >
                    Set as Cover
                  </button>
                )}
              </div>

              {/* Remove X Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/75 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Reorder Arrows at Bottom */}
              {!singleMode && images.length > 1 && (
                <div className="absolute bottom-2 inset-x-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    className="w-7 h-7 rounded-lg bg-black/70 text-white flex items-center justify-center disabled:opacity-30 hover:bg-black"
                    title="Move left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-md">
                    #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === images.length - 1}
                    className="w-7 h-7 rounded-lg bg-black/70 text-white flex items-center justify-center disabled:opacity-30 hover:bg-black"
                    title="Move right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Select from Existing Gallery without Re-Uploading */}
      {showExistingModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="font-poppins font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
                  Select From Saved Gallery ({gallery.length} Photos)
                </h4>
                <p className="text-xs text-zinc-500">
                  Tap any previously uploaded image to reuse it instantly without re-uploading
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowExistingModal(false)}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.map((item) => {
                const isSelected = images.includes(item.url);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectExisting(item.url)}
                    className={`relative group rounded-2xl overflow-hidden border-2 aspect-[3/2] text-left transition ${
                      isSelected
                        ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/40'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-500'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
                      <p className="text-[10px] font-bold text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-[9px] text-zinc-300">{item.sizeKb} KB</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowExistingModal(false)}
                className="px-6 py-2.5 rounded-xl bg-[#0B3D2E] text-white font-bold text-xs sm:text-sm"
              >
                Done ({images.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
