import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  it('should response 404 when request unregistered route', async () => {
    const app = await createServer({});
    const response = await request(app).get('/unregisteredRoute');
    expect(response.status).toEqual(404);
  });

  it('should handle server error properly', async () => {
    const app = await createServer({});
    const response = await request(app).post('/users').send({ username: 'dicoding', fullname: 'Dicoding Indonesia', password: 'super_secret' });
    expect(response.status).toEqual(500);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('Terjadi kegagalan pada server');
  });

  const registerAndLogin = async (app, username = 'dicoding') => {
    await request(app).post('/users').send({ username, password: 'secret', fullname: 'Dicoding Indonesia' });
    const loginRes = await request(app).post('/authentications').send({ username, password: 'secret' });
    return loginRes.body.data.accessToken;
  };

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/users').send({ fullname: 'Dicoding Indonesia', password: 'secret' });
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: ['Dicoding Indonesia'] });
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should response 400 when username more than 50 character', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/users').send({ username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      expect(response.status).toEqual(400);
    });

    it('should response 400 when username contain restricted character', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/users').send({ username: 'dicoding indonesia', password: 'secret', fullname: 'Dicoding Indonesia' });
      expect(response.status).toEqual(400);
    });

    it('should response 400 when username unavailable', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const app = await createServer(container);
      const response = await request(app).post('/users').send({ username: 'dicoding', fullname: 'Dicoding Indonesia', password: 'super_secret' });
      expect(response.status).toEqual(400);
    });
  });

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      const app = await createServer(container);
      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const response = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should response 400 if username not found', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('username tidak ditemukan');
    });

    it('should response 401 if password wrong', async () => {
      const app = await createServer(container);
      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const response = await request(app).post('/authentications').send({ username: 'dicoding', password: 'wrong_password' });
      expect(response.status).toEqual(401);
    });

    it('should response 400 if login payload not contain needed property', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/authentications').send({ username: 'dicoding' });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('harus mengirimkan username dan password');
    });

    it('should response 400 if login payload wrong data type', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/authentications').send({ username: 123, password: 'secret' });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('username dan password harus string');
    });
  });

  describe('when PUT /authentications', () => {
    it('must yield 200 and new access token', async () => {
      const app = await createServer(container);
      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const loginResponse = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });
      const { refreshToken } = loginResponse.body.data;
      const response = await request(app).put('/authentications').send({ refreshToken });
      expect(response.status).toEqual(200);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('must yield 400 payload not contain refresh token', async () => {
      const app = await createServer(container);
      const response = await request(app).put('/authentications').send({});
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('harus mengirimkan token refresh');
    });

    it('must yield 400 if refresh token not string', async () => {
      const app = await createServer(container);
      const response = await request(app).put('/authentications').send({ refreshToken: 123 });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('refresh token harus string');
    });

    it('must yield 400 if refresh token not valid', async () => {
      const app = await createServer(container);
      const response = await request(app).put('/authentications').send({ refreshToken: 'invalid_refresh_token' });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('refresh token tidak valid');
    });

    it('must yield 400 if refresh token not registered in database', async () => {
      const app = await createServer(container);
      const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ username: 'dicoding' });
      const response = await request(app).put('/authentications').send({ refreshToken });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('refresh token tidak ditemukan di database');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      const app = await createServer(container);
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);
      const response = await request(app).delete('/authentications').send({ refreshToken });
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      const app = await createServer(container);
      const response = await request(app).delete('/authentications').send({ refreshToken: 'refresh_token' });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('refresh token tidak ditemukan di database');
    });

    it('should response 400 if payload not contain refresh token', async () => {
      const app = await createServer(container);
      const response = await request(app).delete('/authentications').send({});
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('harus mengirimkan token refresh');
    });
  });

  describe('when POST /threads', () => {
    it('should response 201 and added thread', async () => {
      const app = await createServer(container);
      const accessToken = await registerAndLogin(app);
      const response = await request(app).post('/threads').set('Authorization', `Bearer ${accessToken}`).send({ title: 'sebuah thread', body: 'sebuah body thread' });
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
      expect(response.body.data.addedThread.title).toEqual('sebuah thread');
    });

    it('should response 401 when no token provided', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/threads').send({ title: 'sebuah thread', body: 'sebuah body thread' });
      expect(response.status).toEqual(401);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const app = await createServer(container);
      const accessToken = await registerAndLogin(app);
      const response = await request(app).post('/threads').set('Authorization', `Bearer ${accessToken}`).send({ title: 'sebuah thread' });
      expect(response.status).toEqual(400);
    });

    it('should response 401 when token is invalid (malformed jwt)', async () => {
      const app = await createServer(container);
      const response = await request(app)
        .post('/threads')
        .set('Authorization', 'Bearer token.tidak.valid')
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });
      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual('Token tidak valid');
    });
  });

  describe('when GET /threads/:threadId', () => {
    it('should response 200 and thread detail', async () => {
      const app = await createServer(container);
      const accessToken = await registerAndLogin(app);
      const threadResponse = await request(app).post('/threads').set('Authorization', `Bearer ${accessToken}`).send({ title: 'sebuah thread', body: 'sebuah body thread' });
      const { id: threadId } = threadResponse.body.data.addedThread;
      const response = await request(app).get(`/threads/${threadId}`);
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.thread).toBeDefined();
      expect(response.body.data.thread.comments).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      const app = await createServer(container);
      const response = await request(app).get('/threads/thread-notfound');
      expect(response.status).toEqual(404);
    });
  });

  describe('when POST /threads/:threadId/comments', () => {
    it('should response 201 and added comment', async () => {
      const app = await createServer(container);
      const accessToken = await registerAndLogin(app);
      const threadRes = await request(app).post('/threads').set('Authorization', `Bearer ${accessToken}`).send({ title: 'sebuah thread', body: 'sebuah body thread' });
      const { id: threadId } = threadRes.body.data.addedThread;
      const response = await request(app).post(`/threads/${threadId}/comments`).set('Authorization', `Bearer ${accessToken}`).send({ content: 'sebuah komentar' });
      expect(response.status).toEqual(201);
      expect(response.body.data.addedComment).toBeDefined();
    });

    it('should response 401 when no token', async () => {
      const app = await createServer(container);
      const response = await request(app).post('/threads/thread-123/comments').send({ content: 'komentar' });
      expect(response.status).toEqual(401);
    });

    it('should response 404 when thread not found', async () => {
      const app = await createServer(container);
      const accessToken = await registerAndLogin(app);
      const response = await request(app).post('/threads/thread-notfound/comments').set('Authorization', `Bearer ${accessToken}`).send({ content: 'komentar' });
      expect(response.status).toEqual(404);
    });
  });

  describe('when DELETE /threads/:threadId/comments/:commentId', () => {
    it('should response 200 when owner deletes comment', async () => {
      const app = await createServer(container);
      const accessToken = await registerAndLogin(app);
      const threadRes = await request(app).post('/threads').set('Authorization', `Bearer ${accessToken}`).send({ title: 't', body: 'b' });
      const { id: threadId } = threadRes.body.data.addedThread;
      const commentRes = await request(app).post(`/threads/${threadId}/comments`).set('Authorization', `Bearer ${accessToken}`).send({ content: 'komentar' });
      const { id: commentId } = commentRes.body.data.addedComment;
      const response = await request(app).delete(`/threads/${threadId}/comments/${commentId}`).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 403 when non-owner tries to delete', async () => {
      const app = await createServer(container);
      const accessToken = await registerAndLogin(app, 'dicoding');
      const threadRes = await request(app).post('/threads').set('Authorization', `Bearer ${accessToken}`).send({ title: 't', body: 'b' });
      const { id: threadId } = threadRes.body.data.addedThread;
      const commentRes = await request(app).post(`/threads/${threadId}/comments`).set('Authorization', `Bearer ${accessToken}`).send({ content: 'komentar' });
      const { id: commentId } = commentRes.body.data.addedComment;
      await request(app).post('/users').send({ username: 'johndoe', password: 'secret', fullname: 'John Doe' });
      const loginRes2 = await request(app).post('/authentications').send({ username: 'johndoe', password: 'secret' });
      const accessToken2 = loginRes2.body.data.accessToken;
      const response = await request(app).delete(`/threads/${threadId}/comments/${commentId}`).set('Authorization', `Bearer ${accessToken2}`);
      expect(response.status).toEqual(403);
    });
  });

  describe('when POST /threads/:threadId/comments/:commentId/replies', () => {
    it('should response 201 and added reply', async () => {
      const app = await createServer(container);
      const accessToken = await registerAndLogin(app);
      const threadRes = await request(app).post('/threads').set('Authorization', `Bearer ${accessToken}`).send({ title: 't', body: 'b' });
      const { id: threadId } = threadRes.body.data.addedThread;
      const commentRes = await request(app).post(`/threads/${threadId}/comments`).set('Authorization', `Bearer ${accessToken}`).send({ content: 'komentar' });
      const { id: commentId } = commentRes.body.data.addedComment;
      const response = await request(app).post(`/threads/${threadId}/comments/${commentId}/replies`).set('Authorization', `Bearer ${accessToken}`).send({ content: 'sebuah balasan' });
      expect(response.status).toEqual(201);
      expect(response.body.data.addedReply).toBeDefined();
    });

    it('should response 404 when comment not found', async () => {
      const app = await createServer(container);
      const accessToken = await registerAndLogin(app);
      const threadRes = await request(app).post('/threads').set('Authorization', `Bearer ${accessToken}`).send({ title: 't', body: 'b' });
      const { id: threadId } = threadRes.body.data.addedThread;
      const response = await request(app)
        .post(`/threads/${threadId}/comments/comment-tidakada/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah balasan' });
      expect(response.status).toEqual(404);
    });
  });

  describe('when DELETE /threads/:threadId/comments/:commentId/replies/:replyId', () => {
    it('should response 200 when owner deletes reply', async () => {
      const app = await createServer(container);
      const accessToken = await registerAndLogin(app);
      const threadRes = await request(app).post('/threads').set('Authorization', `Bearer ${accessToken}`).send({ title: 't', body: 'b' });
      const { id: threadId } = threadRes.body.data.addedThread;
      const commentRes = await request(app).post(`/threads/${threadId}/comments`).set('Authorization', `Bearer ${accessToken}`).send({ content: 'komentar' });
      const { id: commentId } = commentRes.body.data.addedComment;
      const replyRes = await request(app).post(`/threads/${threadId}/comments/${commentId}/replies`).set('Authorization', `Bearer ${accessToken}`).send({ content: 'balasan' });
      const { id: replyId } = replyRes.body.data.addedReply;
      const response = await request(app).delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 403 when non-owner tries to delete reply', async () => {
      const app = await createServer(container);
      const accessToken = await registerAndLogin(app, 'dicoding');
      const threadRes = await request(app).post('/threads').set('Authorization', `Bearer ${accessToken}`).send({ title: 't', body: 'b' });
      const { id: threadId } = threadRes.body.data.addedThread;
      const commentRes = await request(app).post(`/threads/${threadId}/comments`).set('Authorization', `Bearer ${accessToken}`).send({ content: 'komentar' });
      const { id: commentId } = commentRes.body.data.addedComment;
      const replyRes = await request(app).post(`/threads/${threadId}/comments/${commentId}/replies`).set('Authorization', `Bearer ${accessToken}`).send({ content: 'balasan' });
      const { id: replyId } = replyRes.body.data.addedReply;
      await request(app).post('/users').send({ username: 'johndoe', password: 'secret', fullname: 'John Doe' });
      const loginRes2 = await request(app).post('/authentications').send({ username: 'johndoe', password: 'secret' });
      const accessToken2 = loginRes2.body.data.accessToken;
      const response = await request(app).delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`).set('Authorization', `Bearer ${accessToken2}`);
      expect(response.status).toEqual(403);
    });
  });
});
