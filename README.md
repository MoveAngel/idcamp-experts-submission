# Forum API 🧵

Forum API adalah RESTful API yang dibangun dengan **Node.js + Express** menggunakan **Clean Architecture** dan **Automation Testing**. Proyek ini mencakup fitur thread, komentar, dan balasan komentar lengkap dengan autentikasi JWT.

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

```test.env
HOST=localhost
PORT=5000

PGHOST=localhost
PGPORT=5432
PGDATABASE=forumapi_test
PGUSER=developer
PGPASSWORD=supersecretpassword
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
