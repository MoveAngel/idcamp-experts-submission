import AuthenticationError from '../AuthenticationError.js';
import ClientError from '../ClientError.js';

describe('AuthenticationError', () => {
  it('must instantiate AuthenticationError properly', () => {
    const authenticationError = new AuthenticationError('authentication error!');

    expect(authenticationError).toBeInstanceOf(AuthenticationError);
    expect(authenticationError).toBeInstanceOf(ClientError);
    expect(authenticationError).toBeInstanceOf(Error);

    expect(authenticationError.statusCode).toEqual(401);
    expect(authenticationError.message).toEqual('authentication error!');
    expect(authenticationError.name).toEqual('AuthenticationError');
  });
});
