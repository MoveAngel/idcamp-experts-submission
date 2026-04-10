import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase.js';

class UsersHandler {
  constructor(container) {
    this._serviceContainer = container;

    this.handlePostUser = this.handlePostUser.bind(this);
  }

  async handlePostUser(req, res, next) {
    try {
      const useCaseInstance = this._serviceContainer.getInstance(AddUserUseCase.name);
      const addedUser = await useCaseInstance.execute(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          addedUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UsersHandler;
