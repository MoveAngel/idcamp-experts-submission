import UserLogin from '../UserLogin.js';

describe('UserLogin entities', () => {
  it('must result in error if payload does not contain needed property', () => {
    const payload = {
      username: 'dicoding',
    };

    expect(() => new UserLogin(payload)).toThrowError('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('must result in error if payload not meet data type specification', () => {
    const payload = {
      username: 'dicoding',
      password: 12345,
    };

    expect(() => new UserLogin(payload)).toThrowError('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('must instantiate UserLogin entities properly', () => {
    const payload = {
      username: 'dicoding',
      password: '12345',
    };

    const userLogin = new UserLogin(payload);

    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
