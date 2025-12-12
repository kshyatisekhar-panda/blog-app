import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const user = new User({ name, email, password, phone });
    await user.save();

    const token = user.generateAuthToken();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);
    const token = user.generateAuthToken();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    next(error);
  }
};

export const getProfile = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    data: { user: req.user },
  });
};

export const logout = async (req, res) => {
  // For JWT-based auth, logout is handled client-side by removing the token
  // But we can still acknowledge the request
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Logged out successfully',
  });
};
