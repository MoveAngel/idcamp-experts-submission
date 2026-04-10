import jwt from 'jsonwebtoken';
import AuthenticationError from '../../Commons/exceptions/AuthenticationError.js';

const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing authentication');
    }

    const jwtToken = authorizationHeader.split(' ')[1];
    const decodedPayload = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_KEY);
    req.user = decodedPayload;
    return next();
  } catch (err) {
    if (err instanceof AuthenticationError) {
      return next(err);
    }
    return next(new AuthenticationError('Token tidak valid'));
  }
};

export default authMiddleware;
