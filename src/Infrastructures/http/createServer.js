import express from 'express';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import threads from '../../Interfaces/http/api/threads/index.js';
import comments from '../../Interfaces/http/api/comments/index.js';
import replies from '../../Interfaces/http/api/replies/index.js';
import authMiddleware from './authMiddleware.js';

const createServer = async (container) => {
  const app = express();

  app.use(express.json());

  app.use('/users', users(container));
  app.use('/authentications', authentications(container));

  const threadsRouter = threads(container, authMiddleware);
  const commentsRouter = comments(container);
  const repliesRouter = replies(container);

  app.use('/threads', threadsRouter);
  app.use('/threads/:threadId/comments', authMiddleware, commentsRouter);
  app.use('/threads/:threadId/comments/:commentId/replies', authMiddleware, repliesRouter);

  app.use((err, req, res, next) => {
    const customException = DomainErrorTranslator.translate(err);

    if (customException instanceof ClientError) {
      return res.status(customException.statusCode).json({
        status: 'fail',
        message: customException.message,
      });
    }

    console.error(err);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kegagalan pada server',
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      status: 'fail',
      message: 'Route not found',
    });
  });

  return app;
};

export default createServer;
