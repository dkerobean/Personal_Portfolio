const bcrypt = require('bcrypt');
const supabase = require('../config/supabase');

// Get login page
exports.getLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect('/admin');
  }
  // Render the login page directly without layout
  res.render('auth/login-new', {
    title: 'Login',
    error_msg: req.flash('error_msg')
  });
};

// Process login
exports.login = async (req, res) => {
  console.log('\n===== NEW LOGIN ATTEMPT =====');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  // Extract email and password from request body
  const { email, password } = req.body;
  
  try {
    console.log('\n[1/5] Starting login process...');
    const { email, password } = req.body;
    
    console.log('\n[2/5] Validating input...');
    console.log('Email:', email ? 'Provided' : 'Missing');
    console.log('Password:', password ? 'Provided' : 'Missing');
    
    if (!email || !password) {
      console.log('❌ Validation failed: Missing email or password');
      req.flash('error_msg', 'Please provide both email and password');
      return res.redirect('/auth/login');
    }

    console.log('\n[3/5] Querying Supabase...');
    console.log('Table: admin_users');
    console.log('Email to search:', email.toLowerCase());
    
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    console.log('\n[4/5] Supabase response received');
    console.log('Error:', error ? error.message : 'No error');
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (error || !user) {
      console.log('❌ User not found or error occurred');
      if (error) console.log('Supabase error details:', error);
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/auth/login');
    }

    console.log('\n[5/5] Verifying password...');
    console.log('Stored password hash:', user.password ? 'Exists' : 'Missing');
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? '✅ Success' : '❌ Failed');
    
    if (!isMatch) {
      console.log('❌ Invalid password');
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/auth/login');
    }

    console.log('\n✨ LOGIN SUCCESSFUL');
    console.log('User ID:', user.id);
    console.log('Name:', user.name);
    console.log('Role:', user.role);
    
    // Set session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    // Save the session before sending the response
    req.session.save(err => {
      if (err) {
        console.error('Error saving session:', err);
        req.flash('error_msg', 'Error saving session. Please try again.');
        return res.redirect('/auth/login');
      }
      
      console.log('Session data set, redirecting to /admin');
      req.flash('success_msg', 'You are now logged in');
      return res.redirect('/admin');
    });
    
  } catch (error) {
    console.error('\n❌ UNEXPECTED ERROR:', error);
    console.error('Error stack:', error.stack);
    
    // Return to login page with error and form data
    return res.render('auth/login-new', {
      title: 'Login',
      error_msg: 'An error occurred during login. Please try again.',
      email: email || ''
    });
  } finally {
    console.log('\n===== LOGIN ATTEMPT COMPLETE =====\n');
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/admin');
    }
    res.redirect('/auth/login');
  });
};

// Get change password page
exports.getChangePassword = (req, res) => {
  res.render('auth/change-password', {
    title: 'Change Password',
    layout: 'admin'
  });
};

// Process change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.user.id;

    // Validate form data
    if (!currentPassword || !newPassword || !confirmPassword) {
      req.flash('error_msg', 'Please fill in all fields');
      return res.redirect('/auth/change-password');
    }

    if (newPassword !== confirmPassword) {
      req.flash('error_msg', 'New passwords do not match');
      return res.redirect('/auth/change-password');
    }

    if (newPassword.length < 6) {
      req.flash('error_msg', 'Password must be at least 6 characters');
      return res.redirect('/auth/change-password');
    }

    // Fetch user by ID
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/auth/change-password');
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Current password is incorrect');
      return res.redirect('/auth/change-password');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ password: hashedPassword })
      .eq('id', userId);

    if (updateError) throw updateError;

    req.flash('success_msg', 'Password updated successfully');
    res.redirect('/admin');
  } catch (error) {
    console.error('Change password error:', error);
    req.flash('error_msg', 'An error occurred while changing password');
    res.redirect('/auth/change-password');
  }
};
