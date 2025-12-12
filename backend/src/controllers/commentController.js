import { StatusCodes } from 'http-status-codes';
import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';

export const createComment = async (req, res, next) => {
  try {
    const { content, blogId } = req.body;

    // Verify blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const comment = new Comment({
      content,
      blog: blogId,
      author: req.user._id,
    });

    await comment.save();
    await comment.populate('author', 'name email');

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentsByBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ blog: blogId })
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comment.countDocuments({ blog: blogId }),
    ]);

    // Add user's like/dislike status if authenticated
    const commentsWithStatus = comments.map(comment => {
      const commentObj = comment.toJSON();
      if (req.user) {
        commentObj.userLiked = comment.likes.includes(req.user._id);
        commentObj.userDisliked = comment.dislikes.includes(req.user._id);
      }
      return commentObj;
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        comments: commentsWithStatus,
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

export const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to update this comment',
      });
    }

    comment.content = content;
    await comment.save();
    await comment.populate('author', 'name email');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    await comment.deleteOne();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Comment not found',
      });
    }

    const userId = req.user._id;
    const likeIndex = comment.likes.indexOf(userId);
    const dislikeIndex = comment.dislikes.indexOf(userId);

    // Remove from dislikes if present
    if (dislikeIndex !== -1) {
      comment.dislikes.splice(dislikeIndex, 1);
    }

    // Toggle like
    if (likeIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        likeCount: comment.likes.length,
        dislikeCount: comment.dislikes.length,
        userLiked: comment.likes.includes(userId),
        userDisliked: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleDislike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Comment not found',
      });
    }

    const userId = req.user._id;
    const likeIndex = comment.likes.indexOf(userId);
    const dislikeIndex = comment.dislikes.indexOf(userId);

    // Remove from likes if present
    if (likeIndex !== -1) {
      comment.likes.splice(likeIndex, 1);
    }

    // Toggle dislike
    if (dislikeIndex === -1) {
      comment.dislikes.push(userId);
    } else {
      comment.dislikes.splice(dislikeIndex, 1);
    }

    await comment.save();

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        likeCount: comment.likes.length,
        dislikeCount: comment.dislikes.length,
        userLiked: false,
        userDisliked: comment.dislikes.includes(userId),
      },
    });
  } catch (error) {
    next(error);
  }
};
