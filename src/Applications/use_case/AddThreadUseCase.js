import NewThread from '../../Domains/threads/entities/NewThread.js';

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(reqPayload) {
    const newThread = new NewThread(reqPayload);
    return this._threadRepository.addThread(newThread);
  }
}

export default AddThreadUseCase;
