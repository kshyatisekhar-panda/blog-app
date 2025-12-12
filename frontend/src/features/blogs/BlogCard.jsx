import { Link } from 'react-router-dom';

function BlogCard({ blog }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
        {blog.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{blog.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>By {blog.author?.name || 'Unknown'}</span>
        <span>{formatDate(blog.createdAt)}</span>
      </div>
      <Link
        to={`/blogs/${blog._id}`}
        className="btn btn-primary mt-4 inline-block text-center"
      >
        Read More
      </Link>
    </div>
  );
}

export default BlogCard;
