import express from 'express';

const createAuthenticationsRouter = (handler) => {
  const router = express.Router();

  router.post('/', handler.loginHandler);
  router.put('/', handler.refreshAuthHandler);
  router.delete('/', handler.logoutHandler);

  return router;
};

export default createAuthenticationsRouter;
