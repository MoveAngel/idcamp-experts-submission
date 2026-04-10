import LoginUserUseCase from '../../../../Applications/use_case/LoginUserUseCase.js';
import RefreshAuthenticationUseCase from '../../../../Applications/use_case/RefreshAuthenticationUseCase.js';
import LogoutUserUseCase from '../../../../Applications/use_case/LogoutUserUseCase.js';

class AuthenticationsHandler {
  constructor(container) {
    this._serviceContainer = container;

    this.loginHandler = this.loginHandler.bind(this);
    this.refreshAuthHandler = this.refreshAuthHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  async loginHandler(req, res, next) {
    try {
      const act = this._serviceContainer.getInstance(LoginUserUseCase.name);
      const { accessToken, refreshToken } = await act.execute(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshAuthHandler(req, res, next) {
    try {
      const act = this._serviceContainer
        .getInstance(RefreshAuthenticationUseCase.name);
      const accessToken = await act.execute(req.body);

      res.json({
        status: 'success',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logoutHandler(req, res, next) {
    try {
      const act = this._serviceContainer.getInstance(LogoutUserUseCase.name);
      await act.execute(req.body);

      res.json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthenticationsHandler;
