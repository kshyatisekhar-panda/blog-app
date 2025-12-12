import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import * as blogController from '../controllers/blogController.js';

const router = express.Router();

// Validation rules
const createBlogValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be 10-5000 characters'),
];

const updateBlogValidation = [
  param('id').isMongoId().withMessage('Invalid blog ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be 10-5000 characters'),
];

const idValidation = [
  param('id').isMongoId().withMessage('Invalid blog ID'),
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
];

// Routes
router.get('/', paginationValidation, validate, blogController.getAllBlogs);
router.get('/:id', idValidation, validate, blogController.getBlogById);
router.post('/', authenticate, createBlogValidation, validate, blogController.createBlog);
router.put('/:id', authenticate, updateBlogValidation, validate, blogController.updateBlog);
router.delete('/:id', authenticate, idValidation, validate, blogController.deleteBlog);

export default router;
