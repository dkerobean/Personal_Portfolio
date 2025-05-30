const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'server/views'));

// Static files - Serve static files from multiple directories
app.use(express.static(path.join(__dirname, 'server/public'), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Global variables middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// Import routes
const mainRoutes = require('./server/routes/main');
const adminRoutes = require('./server/routes/admin');
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');

// Use routes
app.use('/', mainRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Test route for static files
app.get('/test-static', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Static File Test</title>
      <link rel="stylesheet" href="/assets/css/admin.css">
      <style>
        body { padding: 20px; font-family: Arial, sans-serif; }
        .test-box { 
          padding: 20px; 
          margin: 10px 0; 
          border: 1px solid #ddd; 
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <h1>Static File Test</h1>
      
      <div class="test-box">
        <h3>Admin CSS Test</h3>
        <p>If this box has a blue background, the admin CSS is loading correctly.</p>
      </div>
      
      <p><a href="/admin">Back to Admin</a></p>
    </body>
    </html>
  `);
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: '404 Not Found',
    message: 'The page you are looking for does not exist.',
    status: 404
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Server Error',
    message: 'Something went wrong on our end.',
    status: 500
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
