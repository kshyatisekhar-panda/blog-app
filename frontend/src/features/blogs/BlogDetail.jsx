import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBlogById,
  deleteBlog,
  fetchComments,
  addComment,
  deleteComment,
  toggleCommentLike,
  toggleCommentDislike,
  selectCurrentBlog,
  selectComments,
  selectBlogsLoading,
  clearCurrentBlog,
} from './blogsSlice';
import { selectUser } from '../auth/authSlice';
import Spinner from '../../components/Spinner';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const blog = useSelector(selectCurrentBlog);
  const comments = useSelector(selectComments);
  const isLoading = useSelector(selectBlogsLoading);
  const user = useSelector(selectUser);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogById(id));
    dispatch(fetchComments(id));

    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await dispatch(deleteBlog(id));
      navigate('/');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    await dispatch(addComment({ blogId: id, content: commentText }));
    setCommentText('');
    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      await dispatch(deleteComment(commentId));
    }
  };

  const handleLike = (commentId) => {
    dispatch(toggleCommentLike(commentId));
  };

  const handleDislike = (commentId) => {
    dispatch(toggleCommentDislike(commentId));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && !blog) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">Blog not found</h2>
        <Link to="/" className="btn btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isOwner = user?._id === blog.author?._id;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Blog Content */}
      <article className="card mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{blog.title}</h1>
          {isOwner && (
            <div className="flex gap-2">
              <Link
                to={`/blogs/${id}/edit`}
                className="btn btn-secondary text-sm"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-danger text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>By {blog.author?.name || 'Unknown'}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{blog.description}</p>
        </div>
      </article>

      {/* Comments Section */}
      <section className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-8">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="input min-h-[100px] resize-y"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="btn btn-primary mt-2"
          >
            {isSubmitting ? <Spinner size="sm" /> : 'Add Comment'}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-gray-800">
                      {comment.author?.name || 'Unknown'}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  {user?._id === comment.author?._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-gray-700 mt-2">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleLike(comment._id)}
                    className={`flex items-center gap-1 text-sm ${
                      comment.userLiked
                        ? 'text-green-600'
                        : 'text-gray-500 hover:text-green-600'
                    }`}
                  >
                    <span>👍</span>
                    <span>{comment.likeCount || 0}</span>
                  </button>
                  <button
                    onClick={() => handleDislike(comment._id)}
                    className={`flex items-center gap-1 text-sm ${
                      comment.userDisliked
                        ? 'text-red-600'
                        : 'text-gray-500 hover:text-red-600'
                    }`}
                  >
                    <span>👎</span>
                    <span>{comment.dislikeCount || 0}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Link to="/" className="inline-block mt-6 text-blue-600 hover:underline">
        ← Back to Dashboard
      </Link>
    </div>
  );
}

export default BlogDetail;
