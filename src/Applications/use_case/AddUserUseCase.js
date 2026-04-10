import RegisterUser from '../../Domains/users/entities/RegisterUser.js';

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(reqPayload) {
    const registerUser = new RegisterUser(reqPayload);
    await this._userRepository.checkUsernameIsAvailable(registerUser.username);
    registerUser.password = await this._passwordHash.hash(registerUser.password);
    return this._userRepository.addUser(registerUser);
  }
}

export default AddUserUseCase;
