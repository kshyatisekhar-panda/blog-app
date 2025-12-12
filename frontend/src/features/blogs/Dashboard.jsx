import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBlogs,
  selectBlogs,
  selectBlogsLoading,
  selectBlogsError,
} from './blogsSlice';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import BlogCard from './BlogCard';

function Dashboard() {
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogs);
  const isLoading = useSelector(selectBlogsLoading);
  const error = useSelector(selectBlogsError);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (isLoading && blogs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Our Amazing Blogs</h1>
          <p className="text-gray-600 mt-2">
            Explore, create, and share your thoughts with the community.
          </p>
        </div>
        <Link to="/blogs/new" className="btn btn-primary">
          Create New Blog
        </Link>
      </div>

      {error && <Alert type="error" message={error} />}

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No blogs yet
          </h2>
          <p className="text-gray-500 mb-4">
            Be the first to share your thoughts!
          </p>
          <Link to="/blogs/new" className="btn btn-primary">
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
