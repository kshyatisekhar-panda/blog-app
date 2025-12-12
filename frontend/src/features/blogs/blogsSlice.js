import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  blogs: [],
  currentBlog: null,
  comments: [],
  pagination: null,
  isLoading: false,
  error: null,
};

export const fetchBlogs = createAsyncThunk(
  'blogs/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/blogs', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  'blogs/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blogs/${id}`);
      return response.data.data.blog;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blog');
    }
  }
);

export const createBlog = createAsyncThunk(
  'blogs/create',
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await api.post('/blogs', blogData);
      return response.data.data.blog;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create blog');
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/blogs/${id}`, data);
      return response.data.data.blog;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update blog');
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/blogs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
    }
  }
);

export const fetchComments = createAsyncThunk(
  'blogs/fetchComments',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comments/blog/${blogId}`);
      return response.data.data.comments;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'blogs/addComment',
  async ({ blogId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post('/comments', { blogId, content });
      return response.data.data.comment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'blogs/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/${commentId}`);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  'blogs/toggleLike',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      return { commentId, ...response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

export const toggleCommentDislike = createAsyncThunk(
  'blogs/toggleDislike',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/comments/${commentId}/dislike`);
      return { commentId, ...response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle dislike');
    }
  }
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
      state.comments = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create blog
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload);
      })
      // Update blog
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        if (state.currentBlog?._id === action.payload._id) {
          state.currentBlog = action.payload;
        }
      })
      // Delete blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((b) => b._id !== action.payload);
        if (state.currentBlog?._id === action.payload) {
          state.currentBlog = null;
        }
      })
      // Fetch comments
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })
      // Toggle like
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const comment = state.comments.find((c) => c._id === action.payload.commentId);
        if (comment) {
          comment.likeCount = action.payload.likeCount;
          comment.dislikeCount = action.payload.dislikeCount;
          comment.userLiked = action.payload.userLiked;
          comment.userDisliked = action.payload.userDisliked;
        }
      })
      // Toggle dislike
      .addCase(toggleCommentDislike.fulfilled, (state, action) => {
        const comment = state.comments.find((c) => c._id === action.payload.commentId);
        if (comment) {
          comment.likeCount = action.payload.likeCount;
          comment.dislikeCount = action.payload.dislikeCount;
          comment.userLiked = action.payload.userLiked;
          comment.userDisliked = action.payload.userDisliked;
        }
      });
  },
});

export const { clearCurrentBlog, clearError } = blogsSlice.actions;

export const selectBlogs = (state) => state.blogs.blogs;
export const selectCurrentBlog = (state) => state.blogs.currentBlog;
export const selectComments = (state) => state.blogs.comments;
export const selectBlogsLoading = (state) => state.blogs.isLoading;
export const selectBlogsError = (state) => state.blogs.error;
export const selectPagination = (state) => state.blogs.pagination;

export default blogsSlice.reducer;
