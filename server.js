const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// In-memory "database"
const books = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    genre: 'Fiction'
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960,
    genre: 'Fiction'
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    genre: 'Dystopian'
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: 1813,
    genre: 'Romance'
  },
  {
    id: 5,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    year: 1937,
    genre: 'Fantasy'
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'book-api',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.ENVIRONMENT || 'development'
  });
});

// Get all books
app.get('/api/books', (req, res) => {
  res.json({
    success: true,
    count: books.length,
    data: books
  });
});

// Get book by ID
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      error: `Book with id ${id} not found`
    });
  }
  
  res.json({
    success: true,
    data: book
  });
});

// Search books
app.get('/api/books/search', (req, res) => {
  const { title, author, genre } = req.query;
  let results = books;
  
  if (title) {
    results = results.filter(b => 
      b.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  
  if (author) {
    results = results.filter(b => 
      b.author.toLowerCase().includes(author.toLowerCase())
    );
  }
  
  if (genre) {
    results = results.filter(b => 
      b.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    name: 'Book API',
    version: '1.0.0',
    endpoints: [
      'GET /api/books',
      'GET /api/books/:id',
      'GET /api/books/search?title=&author=&genre=',
      'GET /health'
    ]
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Book API',
    documentation: '/api',
    health: '/health',
    books: '/api/books'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Book API running on port ${PORT}`);
  console.log(`Environment: ${process.env.ENVIRONMENT || 'development'}`);
  console.log(`Version: ${process.env.APP_VERSION || '1.0.0'}`);
});

module.exports = app;
