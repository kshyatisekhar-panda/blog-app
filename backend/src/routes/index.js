import express from 'express';
import authRoutes from './auth.js';
import blogRoutes from './blogs.js';
import commentRoutes from './comments.js';

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
