import { vi } from 'vitest';
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js';
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js';
import UserRepository from '../../../Domains/users/UserRepository.js';
import PasswordHash from '../../security/PasswordHash.js';
import AddUserUseCase from '../AddUserUseCase.js';

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action properly', async () => {
    const reqPayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: reqPayload.username,
      fullname: reqPayload.fullname,
    });

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.checkUsernameIsAvailable = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = vi.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = vi.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));

    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    const registeredUser = await getUserUseCase.execute(reqPayload);

    expect(registeredUser).toStrictEqual(new RegisteredUser({
      id: 'user-123',
      username: reqPayload.username,
      fullname: reqPayload.fullname,
    }));

    expect(mockUserRepository.checkUsernameIsAvailable).toBeCalledWith(reqPayload.username);
    expect(mockPasswordHash.hash).toBeCalledWith(reqPayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: reqPayload.username,
      password: 'encrypted_password',
      fullname: reqPayload.fullname,
    }));
  });
});
