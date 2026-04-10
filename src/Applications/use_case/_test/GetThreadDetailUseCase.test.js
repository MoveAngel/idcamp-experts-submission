import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action properly', async () => {
    const threadId = 'thread-123';

    const mockThread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-_pby2_tmXV6bcvcdev9xk',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'komentar yang dihapus',
        is_delete: true,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-BErOXUSefjwWGW1z101hk',
        content: 'sebuah balasan',
        date: '2021-08-08T07:59:48.766Z',
        username: 'johndoe',
        is_delete: false,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn().mockResolvedValue(mockThread);
    mockCommentRepository.getCommentsByThreadId = vi.fn().mockResolvedValue(mockComments);
    mockReplyRepository.getRepliesByCommentId = vi.fn().mockResolvedValue(mockReplies);

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const result = await getThreadDetailUseCase.execute(threadId);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(result.comments[0].content).toBe('sebuah comment');
    expect(result.comments[1].content).toBe('**komentar telah dihapus**');
    expect(result.comments[0].replies[0].content).toBe('sebuah balasan');
  });

  it('should mark deleted replies properly', async () => {
    const threadId = 'thread-123';

    const mockThread = { id: threadId, title: 'thread', body: 'body', date: '2021-08-08', username: 'user' };
    const mockComments = [{ id: 'comment-123', username: 'user', date: '2021-08-08', content: 'komentar', is_delete: false }];
    const mockReplies = [{ id: 'reply-123', content: 'balasan dihapus', date: '2021-08-08', username: 'user', is_delete: true }];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn().mockResolvedValue(mockThread);
    mockCommentRepository.getCommentsByThreadId = vi.fn().mockResolvedValue(mockComments);
    mockReplyRepository.getRepliesByCommentId = vi.fn().mockResolvedValue(mockReplies);

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const result = await getThreadDetailUseCase.execute(threadId);
    expect(result.comments[0].replies[0].content).toBe('**balasan telah dihapus**');
  });
});
