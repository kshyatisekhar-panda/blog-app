import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/blogs/Dashboard';
import BlogDetail from './features/blogs/BlogDetail';
import BlogForm from './features/blogs/BlogForm';
import { selectIsAuthenticated } from './features/auth/authSlice';

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          index
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="blogs/new"
          element={
            <PrivateRoute>
              <BlogForm />
            </PrivateRoute>
          }
        />
        <Route
          path="blogs/:id"
          element={
            <PrivateRoute>
              <BlogDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="blogs/:id/edit"
          element={
            <PrivateRoute>
              <BlogForm />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
