const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { isAuthenticated } = require('../middleware/auth');

// API endpoints for content
router.get('/profile', apiController.getProfile);
router.get('/projects', apiController.getProjects);
router.get('/projects/:id', apiController.getProject);
router.get('/services', apiController.getServices);
router.get('/services/:id', apiController.getService);
router.get('/blogs', apiController.getBlogs);
router.get('/blogs/:id', apiController.getBlog);
router.get('/settings', apiController.getSettings);

// Protected API endpoints for admin dashboard
router.post('/profile', isAuthenticated, apiController.updateProfile);
router.post('/projects', isAuthenticated, apiController.createProject);
router.put('/projects/:id', isAuthenticated, apiController.updateProject);
router.delete('/projects/:id', isAuthenticated, apiController.deleteProject);
router.post('/services', isAuthenticated, apiController.createService);
router.put('/services/:id', isAuthenticated, apiController.updateService);
router.delete('/services/:id', isAuthenticated, apiController.deleteService);
router.post('/blogs', isAuthenticated, apiController.createBlog);
router.put('/blogs/:id', isAuthenticated, apiController.updateBlog);
router.delete('/blogs/:id', isAuthenticated, apiController.deleteBlog);
router.post('/settings', isAuthenticated, apiController.updateSettings);

module.exports = router;
