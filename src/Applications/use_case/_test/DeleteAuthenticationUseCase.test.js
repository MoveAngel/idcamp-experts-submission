import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import DeleteAuthenticationUseCase from '../DeleteAuthenticationUseCase.js';
import { vi } from 'vitest';

describe('DeleteAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    const reqPayload = {};
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

    await expect(deleteAuthenticationUseCase.execute(reqPayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if refresh token not string', async () => {
    const reqPayload = {
      refreshToken: 123,
    };
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

    await expect(deleteAuthenticationUseCase.execute(reqPayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete authentication action properly', async () => {
    const reqPayload = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationRepository.checkAvailabilityToken = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    await deleteAuthenticationUseCase.execute(reqPayload);

    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toHaveBeenCalledWith(reqPayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(reqPayload.refreshToken);
  });
});
