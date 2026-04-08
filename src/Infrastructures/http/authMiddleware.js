import jwt from 'jsonwebtoken';
import AuthenticationError from '../../Commons/exceptions/AuthenticationError.js';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing authentication');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return next(error);
    }
    return next(new AuthenticationError('Token tidak valid'));
  }
};

export default authMiddleware;
