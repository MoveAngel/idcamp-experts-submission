import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import GetThreadDetailUseCase from '../../../../Applications/use_case/GetThreadDetailUseCase.js';

const threadsHandler = (container) => {
  const postThreadHandler = async (req, res, next) => {
    try {
      const { title, body } = req.body;
      const { id: owner } = req.user;

      const act = container.getInstance(AddThreadUseCase.name);
      const addedThread = await act.execute({ title, body, owner });

      return res.status(201).json({ status: 'success', data: { addedThread } });
    } catch (error) {
      return next(error);
    }
  };

  const getThreadDetailHandler = async (req, res, next) => {
    try {
      const { threadId } = req.params;
      const act = container.getInstance(GetThreadDetailUseCase.name);
      const thread = await act.execute(threadId);

      return res.status(200).json({ status: 'success', data: { thread } });
    } catch (error) {
      return next(error);
    }
  };

  return {
    postThread: postThreadHandler,
    getThreadDetail: getThreadDetailHandler,
  };
};

export default threadsHandler;
