# Blog App

A full-stack blog application built with React and Node.js/Express, featuring user authentication, blog management, and commenting system with likes/dislikes.

## Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **Redux Toolkit** for state management
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **Axios** for API calls

### Backend
- **Node.js 18+** with ES modules
- **Express.js** for REST API
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **express-validator** for input validation
- **express-rate-limit** for rate limiting

## Features

- User registration and authentication
- Create, read, update, delete blogs
- Comment system with likes/dislikes
- Protected routes
- Form validation
- Error handling
- Responsive design

## Project Structure

```
blog-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── features/       # Feature-based modules
│   │   │   ├── auth/       # Authentication
│   │   │   └── blogs/      # Blog management
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   └── main.jsx        # Entry point
│   ├── .env.example
│   └── package.json
├── package.json            # Root package.json with workspaces
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kshyatisekhar-panda/blog-app.git
cd blog-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

For backend, create `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

Edit the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=7000
MONGODB_URI=mongodb://localhost:27017/BlogApp
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

4. Start MongoDB (if running locally)

5. Run the development servers:
```bash
npm run dev
```

This will start both frontend (http://localhost:3000) and backend (http://localhost:7000) concurrently.

### Running Individually

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Building for Production

```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Blogs
- `GET /api/blogs` - Get all blogs (paginated)
- `GET /api/blogs/:id` - Get blog by ID
- `POST /api/blogs` - Create a new blog (protected)
- `PUT /api/blogs/:id` - Update blog (protected, owner only)
- `DELETE /api/blogs/:id` - Delete blog (protected, owner only)

### Comments
- `GET /api/comments/blog/:blogId` - Get comments for a blog
- `POST /api/comments` - Add comment (protected)
- `PUT /api/comments/:id` - Update comment (protected, owner only)
- `DELETE /api/comments/:id` - Delete comment (protected, owner only)
- `POST /api/comments/:id/like` - Toggle like (protected)
- `POST /api/comments/:id/dislike` - Toggle dislike (protected)

## Security Features

- Password hashing with bcrypt
- JWT-based authentication with Bearer tokens
- Input validation and sanitization
- Rate limiting
- Helmet security headers
- CORS configuration
- Environment variable management

## License

MIT
