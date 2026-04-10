import ClientError from '../ClientError.js';

describe('ClientError', () => {
  it('must result in error if directly use it', () => {
    expect(() => new ClientError('')).toThrowError('cannot instantiate abstract class');
  });
});
