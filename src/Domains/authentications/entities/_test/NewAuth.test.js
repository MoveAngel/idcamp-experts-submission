import NewAuth from '../NewAuth.js';

describe('NewAuth entities', () => {
  it('must result in error if payload not contain needed property', () => {
    const payload = {
      accessToken: 'accessToken',
    };

    expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('must result in error if payload not meet data type specification', () => {
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 1234,
    };

    expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('must instantiate NewAuth entities properly', () => {
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    const newAuth = new NewAuth(payload);

    expect(newAuth).toBeInstanceOf(NewAuth);
    expect(newAuth.accessToken).toEqual(payload.accessToken);
    expect(newAuth.refreshToken).toEqual(payload.refreshToken);
  });
});
