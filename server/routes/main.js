const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// Home page
router.get('/', mainController.getHomePage);

// About page
router.get('/about', mainController.getAboutPage);

// Projects page
router.get('/projects', mainController.getProjectsPage);

// Services page
router.get('/service', mainController.getServicePage);

// Blog page
router.get('/blog', mainController.getBlogPage);

// Blog details page
router.get('/blog-details/:id', mainController.getBlogDetailsPage);

// Single project page
router.get('/single-project/:id', mainController.getSingleProjectPage);

// Contact page
router.get('/contact', mainController.getContactPage);

// Process contact form
router.post('/contact', mainController.processContactForm);

module.exports = router;
