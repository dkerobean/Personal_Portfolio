const supabase = require('../config/supabase');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../server/public/uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Only image files are allowed!'));
  } 
});

// Admin dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Fetch counts for dashboard
    const [
      projectsResponse,
      servicesResponse,
      blogsResponse,
      contactsResponse
    ] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact' }),
      supabase.from('services').select('id', { count: 'exact' }),
      supabase.from('blogs').select('id', { count: 'exact' }),
      supabase.from('contact_submissions').select('id', { count: 'exact' })
    ]);

    // Check for errors
    if (projectsResponse.error) throw projectsResponse.error;
    if (servicesResponse.error) throw servicesResponse.error;
    if (blogsResponse.error) throw blogsResponse.error;
    if (contactsResponse.error) throw contactsResponse.error;

    // Get counts
    const projectsCount = projectsResponse.count || 0;
    const servicesCount = servicesResponse.count || 0;
    const blogsCount = blogsResponse.count || 0;
    const contactsCount = contactsResponse.count || 0;

    // Fetch recent contact submissions
    const { data: recentContacts, error: contactsError } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (contactsError) throw contactsError;

    // Get Express version
    const expressVersion = require('express/package.json').version;
    
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      layout: 'admin',
      counts: {
        projects: projectsCount,
        services: servicesCount,
        blogs: blogsCount,
        contacts: contactsCount
      },
      recentContacts,
      expressVersion
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    req.flash('error_msg', 'Failed to load dashboard data');
    res.status(500).render('admin/dashboard', {
      title: 'Admin Dashboard',
      layout: 'admin',
      counts: {
        projects: 0,
        services: 0,
        blogs: 0,
        contacts: 0
      },
      recentContacts: []
    });
  }
};

// Profile management
exports.getProfileEditor = async (req, res) => {
  try {
    // Fetch profile data
    const { data: profile, error } = await supabase
      .from('profile')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.render('admin/profile', {
      title: 'Edit Profile',
      layout: 'admin',
      profile: profile || {}
    });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    req.flash('error_msg', 'Failed to load profile data');
    res.redirect('/admin');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { 
      name, 
      title, 
      bio, 
      email, 
      phone, 
      address, 
      social_facebook, 
      social_twitter, 
      social_instagram, 
      social_linkedin, 
      social_github 
    } = req.body;

    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profile')
      .select('id')
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    const profileData = {
      name,
      title,
      bio,
      email,
      phone,
      address,
      social_facebook,
      social_twitter,
      social_instagram,
      social_linkedin,
      social_github,
      updated_at: new Date()
    };

    let result;
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('profile')
        .update(profileData)
        .eq('id', existingProfile.id);
    } else {
      // Create new profile
      result = await supabase
        .from('profile')
        .insert([{ ...profileData, created_at: new Date() }]);
    }

    if (result.error) throw result.error;

    req.flash('success_msg', 'Profile updated successfully');
    res.redirect('/admin/profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    req.flash('error_msg', 'Failed to update profile');
    res.redirect('/admin/profile');
  }
};

// Projects management
exports.getProjects = async (req, res) => {
  try {
    // Fetch all projects
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.render('admin/projects/index', {
      title: 'Manage Projects',
      layout: 'admin',
      projects: projects || []
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    req.flash('error_msg', 'Failed to load projects');
    res.redirect('/admin');
  }
};

exports.getNewProject = (req, res) => {
  res.render('admin/projects/new', {
    title: 'Add New Project',
    layout: 'admin'
  });
};

exports.createProject = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      client,
      technologies,
      category,
      project_url,
      featured,
      completion_date
    } = req.body;

    let image_url = '';

    // Handle image upload if included
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    // Insert project into database
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title,
        description,
        client,
        technologies,
        category,
        project_url,
        image_url,
        featured: featured === 'on' ? true : false,
        completion_date,
        created_at: new Date(),
        updated_at: new Date()
      }]);

    if (error) throw error;

    req.flash('success_msg', 'Project added successfully');
    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Error creating project:', error);
    req.flash('error_msg', 'Failed to add project');
    res.redirect('/admin/projects/new');
  }
};

exports.getEditProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch project by ID
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!project) {
      req.flash('error_msg', 'Project not found');
      return res.redirect('/admin/projects');
    }

    res.render('admin/projects/edit', {
      title: 'Edit Project',
      layout: 'admin',
      project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    req.flash('error_msg', 'Failed to load project');
    res.redirect('/admin/projects');
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      client,
      technologies,
      category,
      project_url,
      featured,
      completion_date,
      current_image
    } = req.body;

    // Prepare update data
    const projectData = {
      title,
      description,
      client,
      technologies,
      category,
      project_url,
      featured: featured === 'on' ? true : false,
      completion_date,
      updated_at: new Date()
    };

    // Handle image upload if included
    if (req.file) {
      projectData.image_url = `/uploads/${req.file.filename}`;
      
      // Delete old image if exists and different from default
      if (current_image && !current_image.includes('default') && fs.existsSync(path.join(__dirname, '../../server/public', current_image))) {
        fs.unlinkSync(path.join(__dirname, '../../server/public', current_image));
      }
    }

    // Update project in database
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id);

    if (error) throw error;

    req.flash('success_msg', 'Project updated successfully');
    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Error updating project:', error);
    req.flash('error_msg', 'Failed to update project');
    res.redirect(`/admin/projects/edit/${req.params.id}`);
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch project to get image path before deleting
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete project from database
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Delete project image if exists and not default
    if (project && project.image_url && !project.image_url.includes('default') && fs.existsSync(path.join(__dirname, '../../server/public', project.image_url))) {
      fs.unlinkSync(path.join(__dirname, '../../server/public', project.image_url));
    }

    req.flash('success_msg', 'Project deleted successfully');
    res.redirect('/admin/projects');
  } catch (error) {
    console.error('Error deleting project:', error);
    req.flash('error_msg', 'Failed to delete project');
    res.redirect('/admin/projects');
  }
};

// Services management
exports.getServices = async (req, res) => {
  try {
    // Fetch all services
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.render('admin/services/index', {
      title: 'Manage Services',
      layout: 'admin',
      services: services || []
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    req.flash('error_msg', 'Failed to load services');
    res.redirect('/admin');
  }
};

exports.getNewService = (req, res) => {
  res.render('admin/services/new', {
    title: 'Add New Service',
    layout: 'admin'
  });
};

exports.createService = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    // Insert service into database
    const { data, error } = await supabase
      .from('services')
      .insert([{
        title,
        description,
        icon,
        created_at: new Date(),
        updated_at: new Date()
      }]);

    if (error) throw error;

    req.flash('success_msg', 'Service added successfully');
    res.redirect('/admin/services');
  } catch (error) {
    console.error('Error creating service:', error);
    req.flash('error_msg', 'Failed to add service');
    res.redirect('/admin/services/new');
  }
};

exports.getEditService = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch service by ID
    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!service) {
      req.flash('error_msg', 'Service not found');
      return res.redirect('/admin/services');
    }

    res.render('admin/services/edit', {
      title: 'Edit Service',
      layout: 'admin',
      service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    req.flash('error_msg', 'Failed to load service');
    res.redirect('/admin/services');
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon } = req.body;

    // Update service in database
    const { data, error } = await supabase
      .from('services')
      .update({
        title,
        description,
        icon,
        updated_at: new Date()
      })
      .eq('id', id);

    if (error) throw error;

    req.flash('success_msg', 'Service updated successfully');
    res.redirect('/admin/services');
  } catch (error) {
    console.error('Error updating service:', error);
    req.flash('error_msg', 'Failed to update service');
    res.redirect(`/admin/services/edit/${req.params.id}`);
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete service from database
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;

    req.flash('success_msg', 'Service deleted successfully');
    res.redirect('/admin/services');
  } catch (error) {
    console.error('Error deleting service:', error);
    req.flash('error_msg', 'Failed to delete service');
    res.redirect('/admin/services');
  }
};

// Blog management
exports.getBlogs = async (req, res) => {
  try {
    // Fetch all blog posts
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.render('admin/blogs/index', {
      title: 'Manage Blog Posts',
      layout: 'admin',
      blogs: blogs || []
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    req.flash('error_msg', 'Failed to load blogs');
    res.redirect('/admin');
  }
};

exports.getNewBlog = (req, res) => {
  res.render('admin/blogs/new', {
    title: 'Add New Blog Post',
    layout: 'admin'
  });
};

exports.createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags } = req.body;
    let image_url = '';

    // Handle image upload if included
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    // Insert blog post into database
    const { data, error } = await supabase
      .from('blogs')
      .insert([{
        title,
        content,
        excerpt,
        category,
        tags,
        image_url,
        created_at: new Date(),
        updated_at: new Date()
      }]);

    if (error) throw error;

    req.flash('success_msg', 'Blog post added successfully');
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Error creating blog post:', error);
    req.flash('error_msg', 'Failed to add blog post');
    res.redirect('/admin/blogs/new');
  }
};

exports.getEditBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch blog post by ID
    const { data: blog, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!blog) {
      req.flash('error_msg', 'Blog post not found');
      return res.redirect('/admin/blogs');
    }

    res.render('admin/blogs/edit', {
      title: 'Edit Blog Post',
      layout: 'admin',
      blog
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    req.flash('error_msg', 'Failed to load blog post');
    res.redirect('/admin/blogs');
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category, tags, current_image } = req.body;

    // Prepare update data
    const blogData = {
      title,
      content,
      excerpt,
      category,
      tags,
      updated_at: new Date()
    };

    // Handle image upload if included
    if (req.file) {
      blogData.image_url = `/uploads/${req.file.filename}`;
      
      // Delete old image if exists and different from default
      if (current_image && !current_image.includes('default') && fs.existsSync(path.join(__dirname, '../../server/public', current_image))) {
        fs.unlinkSync(path.join(__dirname, '../../server/public', current_image));
      }
    }

    // Update blog post in database
    const { data, error } = await supabase
      .from('blogs')
      .update(blogData)
      .eq('id', id);

    if (error) throw error;

    req.flash('success_msg', 'Blog post updated successfully');
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Error updating blog post:', error);
    req.flash('error_msg', 'Failed to update blog post');
    res.redirect(`/admin/blogs/edit/${req.params.id}`);
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch blog post to get image path before deleting
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete blog post from database
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Delete blog post image if exists and not default
    if (blog && blog.image_url && !blog.image_url.includes('default') && fs.existsSync(path.join(__dirname, '../../server/public', blog.image_url))) {
      fs.unlinkSync(path.join(__dirname, '../../server/public', blog.image_url));
    }

    req.flash('success_msg', 'Blog post deleted successfully');
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Error deleting blog post:', error);
    req.flash('error_msg', 'Failed to delete blog post');
    res.redirect('/admin/blogs');
  }
};

// Site settings
exports.getSettings = async (req, res) => {
  try {
    // Fetch site settings
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.render('admin/settings', {
      title: 'Site Settings',
      layout: 'admin',
      settings: settings || {}
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    req.flash('error_msg', 'Failed to load settings');
    res.redirect('/admin');
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { 
      site_title, 
      site_description, 
      meta_keywords,
      contact_email,
      contact_phone,
      contact_address,
      footer_text
    } = req.body;

    // Check if settings exist
    const { data: existingSettings, error: checkError } = await supabase
      .from('settings')
      .select('id')
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    const settingsData = {
      site_title,
      site_description,
      meta_keywords,
      contact_email,
      contact_phone,
      contact_address,
      footer_text,
      updated_at: new Date()
    };

    let result;
    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from('settings')
        .update(settingsData)
        .eq('id', existingSettings.id);
    } else {
      // Create new settings
      result = await supabase
        .from('settings')
        .insert([{ ...settingsData, created_at: new Date() }]);
    }

    if (result.error) throw result.error;

    req.flash('success_msg', 'Settings updated successfully');
    res.redirect('/admin/settings');
  } catch (error) {
    console.error('Error updating settings:', error);
    req.flash('error_msg', 'Failed to update settings');
    res.redirect('/admin/settings');
  }
};
