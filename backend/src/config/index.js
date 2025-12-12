import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 7000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/BlogApp',
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  bcryptRounds: 12,
};

// Validation
if (config.env === 'production' && config.jwtSecret === 'change-this-secret-in-production') {
  console.error('ERROR: JWT_SECRET must be set in production!');
  process.exit(1);
}

export default config;
