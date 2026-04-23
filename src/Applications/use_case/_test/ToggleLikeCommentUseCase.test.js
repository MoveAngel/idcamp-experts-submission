import ToggleLikeCommentUseCase from '../ToggleLikeCommentUseCase.js';

describe('ToggleLikeCommentUseCase', () => {
  it('should orchestrate toggle like correctly', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockCommentRepository = {
      verifyCommentExists: vi.fn().mockResolvedValue(undefined),
      toggleCommentLike: vi.fn().mockResolvedValue(undefined),
    };

    const mockThreadRepository = {
      verifyThreadExists: vi.fn().mockResolvedValue(undefined),
    };

    const useCase = new ToggleLikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await useCase.execute(payload);

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(payload.commentId);
    expect(mockCommentRepository.toggleCommentLike).toHaveBeenCalledWith(
      payload.commentId,
      payload.userId,
    );
  });
});
