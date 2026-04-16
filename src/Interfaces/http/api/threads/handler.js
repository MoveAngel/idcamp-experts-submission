import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import GetThreadDetailUseCase from '../../../../Applications/use_case/GetThreadDetailUseCase.js';

const buildThreadsHandler = (container) => {
  const createThreadHandler = async (req, res, next) => {
    try {
      const { title, body } = req.body;
      const { id: owner } = req.user;

      const useCase = container.getInstance(AddThreadUseCase.name);
      const newThread = await useCase.execute({ title, body, owner });

      return res.status(201).json({ status: 'success', data: { addedThread: newThread } });
    } catch (err) {
      return next(err);
    }
  };

  const fetchThreadDetailHandler = async (req, res, next) => {
    try {
      const { threadId } = req.params;
      const useCase = container.getInstance(GetThreadDetailUseCase.name);
      const threadDetail = await useCase.execute(threadId);

      return res.status(200).json({ status: 'success', data: { thread: threadDetail } });
    } catch (err) {
      return next(err);
    }
  };

  return {
    postThread: createThreadHandler,
    getThreadDetail: fetchThreadDetailHandler,
  };
};

export default buildThreadsHandler;
