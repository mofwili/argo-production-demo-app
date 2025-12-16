const request = require('supertest');
const app = require('../server');

describe('Book API Tests', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Welcome to Book API');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('OK');
    });
  });

  describe('GET /api/books', () => {
    it('should return all books', async () => {
      const res = await request(app).get('/api/books');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(5);
    });
  });

  describe('GET /api/books/:id', () => {
    it('should return specific book', async () => {
      const res = await request(app).get('/api/books/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toEqual('The Great Gatsby');
    });

    it('should return 404 for non-existent book', async () => {
      const res = await request(app).get('/api/books/999');
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/books/search', () => {
    it('should search books by title', async () => {
      const res = await request(app).get('/api/books/search?title=gatsby');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data[0].title).toContain('Gatsby');
    });

    it('should search books by author', async () => {
      const res = await request(app).get('/api/books/search?author=orwell');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data[0].author).toContain('Orwell');
    });
  });
});
