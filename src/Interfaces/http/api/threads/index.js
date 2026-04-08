import express from 'express';
import threadsHandler from './handler.js';
import createThreadsRouter from './routes.js';

const threads = (container) => {
  const handler = threadsHandler(container);
  return createThreadsRouter(handler);
};

export default threads;
