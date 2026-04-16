# Forum API 🧵

Forum API adalah RESTful API yang dibangun dengan **Node.js + Express** menggunakan **Clean Architecture** dan **Automation Testing**. Proyek ini mencakup fitur thread, komentar, dan balasan komentar lengkap dengan autentikasi JWT.

---

## 📁 Struktur Proyek (Clean Architecture)

```
forum-api/
├── src/
│   ├── Domains/               # Layer 1 - Domain (Entity + Repository Interface)
│   │   ├── threads/
│   │   │   ├── ThreadRepository.js
│   │   │   └── entities/
│   │   │       ├── NewThread.js
│   │   │       └── AddedThread.js
│   │   ├── comments/
│   │   │   ├── CommentRepository.js
│   │   │   └── entities/
│   │   │       ├── NewComment.js
│   │   │       └── AddedComment.js
│   │   ├── replies/
│   │   │   ├── ReplyRepository.js
│   │   │   └── entities/
│   │   │       ├── NewReply.js
│   │   │       └── AddedReply.js
│   │   ├── users/
│   │   └── authentications/
│   │
│   ├── Applications/          # Layer 2 - Use Case (Business Logic)
│   │   ├── use_case/
│   │   │   ├── AddThreadUseCase.js
│   │   │   ├── GetThreadDetailUseCase.js
│   │   │   ├── AddCommentUseCase.js
│   │   │   ├── DeleteCommentUseCase.js
│   │   │   ├── AddReplyUseCase.js
│   │   │   └── DeleteReplyUseCase.js
│   │   └── security/
│   │
│   ├── Interfaces/            # Layer 3 - Interface Adapter (Handler, Routes)
│   │   └── http/api/
│   │       ├── threads/
│   │       │   ├── handler.js
│   │       │   ├── routes.js
│   │       │   └── index.js
│   │       ├── comments/
│   │       │   ├── handler.js
│   │       │   ├── routes.js
│   │       │   └── index.js
│   │       ├── replies/
│   │       │   ├── handler.js
│   │       │   ├── routes.js
│   │       │   └── index.js
│   │       ├── users/
│   │       └── authentications/
│   │
│   └── Infrastructures/       # Layer 4 - Frameworks (DB, HTTP Server, Security)
│       ├── database/postgres/
│       ├── http/
│       │   ├── createServer.js
│       │   └── authMiddleware.js
│       ├── repository/
│       │   ├── ThreadRepositoryPostgres.js
│       │   ├── CommentRepositoryPostgres.js
│       │   └── ReplyRepositoryPostgres.js
│       ├── security/
│       └── container.js
│
├── migrations/
│   ├── ..._create-table-users.js
│   ├── ..._create-table-authentications.js
│   ├── ..._create-table-threads.js
│   ├── ..._create-table-comments.js
│   └── ..._create-table-replies.js
│
└── tests/                     # Test Helpers
    ├── UsersTableTestHelper.js
    ├── AuthenticationsTableTestHelper.js
    ├── ThreadsTableTestHelper.js
    ├── CommentsTableTestHelper.js
    └── RepliesTableTestHelper.js
```

---

## 🚀 Cara Menjalankan

### 1. Prerequisite
- Node.js >= 18
- PostgreSQL (running)

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
Salin dan sesuaikan file `.env`:
```env
HOST=localhost
PORT=5000

PGHOST=localhost
PGPORT=5432
PGDATABASE=forumapi
PGUSER=developer
PGPASSWORD=supersecretpassword

ACCESS_TOKEN_KEY=your_access_token_secret_key_min_32_chars
REFRESH_TOKEN_KEY=your_refresh_token_secret_key_min_32_chars
ACCESS_TOKEN_AGE=1800
```

### 4. Buat Database
```sql
CREATE DATABASE forumapi;
CREATE DATABASE forumapi_test;
```

### 5. Jalankan Migrasi
```bash
# Database utama
npm run migrate up

# Database test
npm run migrate:test up
```

### 6. Jalankan Server
```bash
# Development (dengan nodemon)
npm run start:dev

# Production
npm start
```

---

## 🧪 Menjalankan Test

```bash
# Jalankan semua test
npm test

# Jalankan dengan coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 📡 API Endpoints

### Authentication
| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| POST | `/users` | ❌ | Registrasi pengguna baru |
| POST | `/authentications` | ❌ | Login |
| PUT | `/authentications` | ❌ | Refresh access token |
| DELETE | `/authentications` | ❌ | Logout |

### Threads
| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| POST | `/threads` | ✅ | Buat thread baru |
| GET | `/threads/:threadId` | ❌ | Lihat detail thread + komentar + balasan |

### Comments
| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| POST | `/threads/:threadId/comments` | ✅ | Tambah komentar |
| DELETE | `/threads/:threadId/comments/:commentId` | ✅ | Hapus komentar (hanya pemilik) |

### Replies (Opsional)
| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| POST | `/threads/:threadId/comments/:commentId/replies` | ✅ | Tambah balasan |
| DELETE | `/threads/:threadId/comments/:commentId/replies/:replyId` | ✅ | Hapus balasan (hanya pemilik) |

---

## 📋 Contoh Request & Response

### POST /threads
**Request:**
```http
POST /threads HTTP/1.1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "sebuah thread",
  "body": "sebuah body thread"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "addedThread": {
      "id": "thread-h_W1Plfpj0TY7wyT2PUPX",
      "title": "sebuah thread",
      "owner": "user-DWrT3pXe1hccYkV1eIAxS"
    }
  }
}
```

---

### GET /threads/:threadId
**Response (200):**
```json
{
  "status": "success",
  "data": {
    "thread": {
      "id": "thread-h_2FkLZhtg8KY2kh4CC02",
      "title": "sebuah thread",
      "body": "sebuah body thread",
      "date": "2021-08-08T07:19:09.775Z",
      "username": "dicoding",
      "comments": [
        {
          "id": "comment-_pby2_tmXV6bcvcdev8xk",
          "username": "johndoe",
          "date": "2021-08-08T07:22:33.555Z",
          "content": "sebuah komentar",
          "replies": [
            {
              "id": "reply-BErOXUSefjwWGW1z101hk",
              "content": "sebuah balasan",
              "date": "2021-08-08T07:59:48.766Z",
              "username": "dicoding"
            }
          ]
        },
        {
          "id": "comment-sByj5UtLC98XNBtmAdjhTI",
          "username": "dicoding",
          "date": "2021-08-08T07:26:21.338Z",
          "content": "**komentar telah dihapus**",
          "replies": []
        }
      ]
    }
  }
}
```

---

### POST /threads/:threadId/comments
**Request:**
```http
POST /threads/thread-123/comments HTTP/1.1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "content": "sebuah komentar"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "addedComment": {
      "id": "comment-_pby2_tmXV6bcvcdev8xk",
      "content": "sebuah komentar",
      "owner": "user-CrkYSiAgOdMqv36bIvys2"
    }
  }
}
```

---

### DELETE /threads/:threadId/comments/:commentId
**Response (200):**
```json
{
  "status": "success"
}
```

**Error - Bukan pemilik (403):**
```json
{
  "status": "fail",
  "message": "Anda tidak berhak mengakses resource ini"
}
```

---

### POST /threads/:threadId/comments/:commentId/replies
**Request:**
```http
POST /threads/thread-123/comments/comment-123/replies HTTP/1.1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "content": "sebuah balasan"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "addedReply": {
      "id": "reply-BErOXUSefjwWGW1z101hk",
      "content": "sebuah balasan",
      "owner": "user-CrkYSiAgOdMqv36bIvys2"
    }
  }
}
```

---

## ✅ Kriteria yang Dipenuhi

| No | Kriteria | Status |
|----|----------|--------|
| 1 | Menambahkan Thread | ✅ |
| 2 | Menambahkan Komentar pada Thread | ✅ |
| 3 | Menghapus Komentar (soft delete) | ✅ |
| 4 | Melihat Detail Thread (komentar dihapus = teks khusus) | ✅ |
| 5 | Automation Testing (Unit + Integration) | ✅ |
| 6 | Clean Architecture (4 Layer) | ✅ |
| 7 | [Opsional] Balasan Komentar | ✅ |
| 8 | [Opsional] Hapus Balasan (soft delete) | ✅ |

---

## 🏗️ Catatan Arsitektur

### Soft Delete
Komentar dan balasan tidak benar-benar dihapus dari database. Kolom `is_delete` di-set `true`. Saat menampilkan detail thread:
- Komentar terhapus → konten diganti `"**komentar telah dihapus**"`
- Balasan terhapus → konten diganti `"**balasan telah dihapus**"`

### JWT Middleware
Route yang membutuhkan autentikasi dilindungi oleh `authMiddleware.js` yang memverifikasi Bearer token dari header `Authorization`.

### Clean Architecture Flow
```
Request → Interface (Handler/Routes)
        → Use Case (Business Logic)
        → Domain (Entity Validation)
        → Infrastructure (Repository/DB)
        → Response
```
