// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  
  req.flash('error_msg', 'Please log in to access this resource');
  return res.redirect('/auth/login');
};

// Middleware to check if user is already logged in
exports.isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  
  return res.redirect('/admin');
};
