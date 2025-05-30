const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated } = require('../middleware/auth');

// Admin dashboard
router.get('/', isAuthenticated, adminController.getDashboard);

// Profile content management
router.get('/profile', isAuthenticated, adminController.getProfileEditor);
router.post('/profile', isAuthenticated, adminController.updateProfile);

// Projects management
router.get('/projects', isAuthenticated, adminController.getProjects);
router.get('/projects/new', isAuthenticated, adminController.getNewProject);
router.post('/projects', isAuthenticated, adminController.createProject);
router.get('/projects/edit/:id', isAuthenticated, adminController.getEditProject);
router.put('/projects/:id', isAuthenticated, adminController.updateProject);
router.delete('/projects/:id', isAuthenticated, adminController.deleteProject);

// Services management
router.get('/services', isAuthenticated, adminController.getServices);
router.get('/services/new', isAuthenticated, adminController.getNewService);
router.post('/services', isAuthenticated, adminController.createService);
router.get('/services/edit/:id', isAuthenticated, adminController.getEditService);
router.put('/services/:id', isAuthenticated, adminController.updateService);
router.delete('/services/:id', isAuthenticated, adminController.deleteService);

// Blog management
router.get('/blogs', isAuthenticated, adminController.getBlogs);
router.get('/blogs/new', isAuthenticated, adminController.getNewBlog);
router.post('/blogs', isAuthenticated, adminController.createBlog);
router.get('/blogs/edit/:id', isAuthenticated, adminController.getEditBlog);
router.put('/blogs/:id', isAuthenticated, adminController.updateBlog);
router.delete('/blogs/:id', isAuthenticated, adminController.deleteBlog);

// Site settings
router.get('/settings', isAuthenticated, adminController.getSettings);
router.post('/settings', isAuthenticated, adminController.updateSettings);

module.exports = router;
