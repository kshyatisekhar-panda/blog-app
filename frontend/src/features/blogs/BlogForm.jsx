import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  createBlog,
  updateBlog,
  fetchBlogById,
  selectCurrentBlog,
  selectBlogsLoading,
  clearCurrentBlog,
} from './blogsSlice';
import { selectUser } from '../auth/authSlice';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';

function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentBlog = useSelector(selectCurrentBlog);
  const isLoading = useSelector(selectBlogsLoading);
  const user = useSelector(selectUser);
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchBlogById(id));
    }

    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentBlog) {
      // Check ownership
      if (currentBlog.author?._id !== user?._id) {
        navigate('/');
        return;
      }
      setFormData({
        title: currentBlog.title,
        description: currentBlog.description,
      });
    }
  }, [currentBlog, isEdit, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isEdit) {
        await dispatch(updateBlog({ id, data: formData })).unwrap();
      } else {
        await dispatch(createBlog(formData)).unwrap();
      }
      navigate('/');
    } catch (err) {
      setError(err || 'Failed to save blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && isLoading && !currentBlog) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isEdit ? 'Edit Blog' : 'Create New Blog'}
        </h2>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              minLength={3}
              maxLength={200}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input min-h-[200px] resize-y"
              minLength={10}
              maxLength={5000}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length}/5000 characters
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex-1 flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <Spinner size="sm" />
              ) : isEdit ? (
                'Update Blog'
              ) : (
                'Create Blog'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BlogForm;
