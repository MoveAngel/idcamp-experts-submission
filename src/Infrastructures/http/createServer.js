import express from 'express';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import threadsHandler from '../../Interfaces/http/api/threads/handler.js';
import authMiddleware from './authMiddleware.js';

const createServer = async (container) => {
  const app = express();

  app.use(express.json());

  app.use('/users', users(container));
  app.use('/authentications', authentications(container));

  const threadAct = threadsHandler(container);

  app.get('/threads/:threadId', threadAct.getThreadDetail);

  app.post('/threads', authMiddleware, threadAct.postThread);
  app.post('/threads/:threadId/comments', authMiddleware, threadAct.postComment);
  app.delete('/threads/:threadId/comments/:commentId', authMiddleware, threadAct.deleteComment);
  app.post('/threads/:threadId/comments/:commentId/replies', authMiddleware, threadAct.postReply);
  app.delete('/threads/:threadId/comments/:commentId/replies/:replyId', authMiddleware, threadAct.deleteReply);

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
