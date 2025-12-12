import { StatusCodes } from 'http-status-codes';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

export const createBlog = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const blog = new Blog({
      title,
      description,
      author: req.user._id,
    });

    await blog.save();
    await blog.populate('author', 'name email');

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Blog created successfully',
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find()
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(),
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email');

    if (!blog) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to update this blog',
      });
    }

    if (title) blog.title = title;
    if (description) blog.description = description;

    await blog.save();
    await blog.populate('author', 'name email');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Blog updated successfully',
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to delete this blog',
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ blog: blog._id });
    await blog.deleteOne();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
