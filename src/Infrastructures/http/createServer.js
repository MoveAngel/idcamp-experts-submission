import express from 'express';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import threadsHandler from '../../Interfaces/http/api/threads/handler.js';
import authMiddleware from './authMiddleware.js';

const createServer = async (container) => {
  const app = express();

  // Middleware for parsing JSON
  app.use(express.json());

  // Public routes (no auth required)
  app.use('/users', users(container));
  app.use('/authentications', authentications(container));

  // Thread routes: GET /:threadId is public, everything else requires auth
  const handler = threadsHandler(container);

  app.get('/threads/:threadId', handler.getThreadDetail);

  app.post('/threads', authMiddleware, handler.postThread);
  app.post('/threads/:threadId/comments', authMiddleware, handler.postComment);
  app.delete('/threads/:threadId/comments/:commentId', authMiddleware, handler.deleteComment);
  app.post('/threads/:threadId/comments/:commentId/replies', authMiddleware, handler.postReply);
  app.delete('/threads/:threadId/comments/:commentId/replies/:replyId', authMiddleware, handler.deleteReply);

  // Global error handler
  app.use((error, req, res, next) => {
    const translatedError = DomainErrorTranslator.translate(error);

    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }

    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'fail',
      message: 'Route not found',
    });
  });

  return app;
};

export default createServer;
