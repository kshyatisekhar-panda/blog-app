import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { authenticate, optionalAuth } from '../middlewares/auth.js';
import * as commentController from '../controllers/commentController.js';

const router = express.Router();

// Validation rules
const createCommentValidation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be 1-1000 characters'),
  body('blogId')
    .isMongoId().withMessage('Invalid blog ID'),
];

const updateCommentValidation = [
  param('id').isMongoId().withMessage('Invalid comment ID'),
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be 1-1000 characters'),
];

const idValidation = [
  param('id').isMongoId().withMessage('Invalid comment ID'),
];

const blogIdValidation = [
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
];

// Routes
router.get('/blog/:blogId', optionalAuth, blogIdValidation, paginationValidation, validate, commentController.getCommentsByBlog);
router.post('/', authenticate, createCommentValidation, validate, commentController.createComment);
router.put('/:id', authenticate, updateCommentValidation, validate, commentController.updateComment);
router.delete('/:id', authenticate, idValidation, validate, commentController.deleteComment);
router.post('/:id/like', authenticate, idValidation, validate, commentController.toggleLike);
router.post('/:id/dislike', authenticate, idValidation, validate, commentController.toggleDislike);

export default router;
