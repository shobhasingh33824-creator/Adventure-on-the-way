import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import * as dotenv from 'dotenv';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  getAllAppState,
  getOrCreateUser,
  createDestinationInDb,
  updateDestinationInDb,
  deleteDestinationFromDb,
  createBookingInDb,
  updateBookingInDb,
  upsertCouponInDb,
  deleteCouponFromDb,
  updateSiteSettingsInDb,
  updateUserInDb,
} from './src/db/repository.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '5mb' }));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).send('OK');
  });

  // Public state bootstrap endpoint (fetches destinations, coupons, settings, bookings from PostgreSQL)
  app.get('/api/state', async (_req, res) => {
    try {
      const state = await getAllAppState();
      res.json(state);
    } catch (error: any) {
      console.error('Failed to load application state from PostgreSQL:', error);
      res.status(500).json({
        error: error.message || 'Failed to load application state',
      });
    }
  });

  // Authenticated Firebase user sync with PostgreSQL users table
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@adventureontheway.com`;
      const name = req.body?.name || req.user!.name;
      const picture = req.body?.avatar || req.user!.picture;
      const synced = await getOrCreateUser(uid, email, name, picture);
      res.json(synced);
    } catch (error: any) {
      console.error('Failed to sync user profile:', error);
      res.status(500).json({
        error: error.message || 'Failed to sync user profile',
      });
    }
  });

  // Protected User Profile & Wishlist update
  app.patch('/api/users/:uid', requireAuth, async (req: AuthRequest, res) => {
    try {
      const targetUid = String(req.params.uid);
      await updateUserInDb(targetUid, req.body);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Failed to update user in PostgreSQL:', error);
      res.status(500).json({
        error: error.message || 'Failed to update user',
      });
    }
  });

  // Create or update bookings in PostgreSQL
  app.post('/api/bookings', async (req, res) => {
    try {
      const created = await createBookingInDb(req.body);
      res.status(201).json(created);
    } catch (error: any) {
      console.error('Failed to create booking in PostgreSQL:', error);
      res.status(500).json({
        error: error.message || 'Failed to create booking',
      });
    }
  });

  app.patch('/api/bookings/:id', async (req, res) => {
    try {
      await updateBookingInDb(req.params.id, req.body);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Failed to update booking in PostgreSQL:', error);
      res.status(500).json({
        error: error.message || 'Failed to update booking',
      });
    }
  });

  // Destinations CRUD in PostgreSQL
  app.post('/api/destinations', async (req, res) => {
    try {
      const created = await createDestinationInDb(req.body);
      res.status(201).json(created);
    } catch (error: any) {
      console.error('Failed to create destination in PostgreSQL:', error);
      res.status(500).json({
        error: error.message || 'Failed to create destination',
      });
    }
  });

  app.put('/api/destinations/:id', async (req, res) => {
    try {
      const updated = await updateDestinationInDb(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      console.error('Failed to update destination in PostgreSQL:', error);
      res.status(500).json({
        error: error.message || 'Failed to update destination',
      });
    }
  });

  app.delete('/api/destinations/:id', async (req, res) => {
    try {
      await deleteDestinationFromDb(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Failed to delete destination in PostgreSQL:', error);
      res.status(500).json({
        error: error.message || 'Failed to delete destination',
      });
    }
  });

  // Coupons CRUD in PostgreSQL
  app.post('/api/coupons', async (req, res) => {
    try {
      await upsertCouponInDb(req.body);
      res.status(201).json({ success: true });
    } catch (error: any) {
      console.error('Failed to upsert coupon in PostgreSQL:', error);
      res.status(500).json({
        error: error.message || 'Failed to save coupon',
      });
    }
  });

  app.delete('/api/coupons/:code', async (req, res) => {
    try {
      await deleteCouponFromDb(req.params.code);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Failed to delete coupon in PostgreSQL:', error);
      res.status(500).json({
        error: error.message || 'Failed to delete coupon',
      });
    }
  });

  // Site Settings update in PostgreSQL
  app.put('/api/settings', async (req, res) => {
    try {
      await updateSiteSettingsInDb(req.body);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Failed to update site settings in PostgreSQL:', error);
      res.status(500).json({
        error: error.message || 'Failed to update site settings',
      });
    }
  });

  const distPath = path.join(__dirname, 'dist');
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }
    app.get('*', (_req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('Adventure on the Way is starting...');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on 0.0.0.0:${PORT}`);
  });
}

startServer();
