const supabase = require('../config/supabase');

// Home page controller
exports.getHomePage = async (req, res) => {
  try {
    // Initialize default values
    const defaultProfile = {
      full_name: 'Your Name',
      job_title: 'Web Developer',
      bio: 'Welcome to my portfolio!',
      avatar_url: '/images/default-avatar.jpg'
    };

    // Fetch profile data
    let profile;
    const { data: profileData, error: profileError } = await supabase
      .from('profile')
      .select('*')
      .single();
    
    profile = profileError ? defaultProfile : (profileData || defaultProfile);

    // Fetch featured projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6);
    
    if (projectsError) throw projectsError;

    // Fetch services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (servicesError) throw servicesError;

    // Fetch blog posts
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (blogsError) throw blogsError;

    // Fetch site settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (settingsError) throw settingsError;

    res.render('index', {
      title: settings.site_title,
      profile,
      projects,
      services,
      blogs,
      settings
    });
  } catch (error) {
    console.error('Error fetching home page data:', error);
    req.flash('error_msg', 'Failed to load home page data');
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Something went wrong on our end.',
      status: 500
    });
  }
};

// About page controller
exports.getAboutPage = async (req, res) => {
  try {
    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('*')
      .single();
    
    if (profileError) throw profileError;

    // Fetch site settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (settingsError) throw settingsError;

    res.render('about', {
      title: 'About Me | ' + settings.site_title,
      profile,
      settings
    });
  } catch (error) {
    console.error('Error fetching about page data:', error);
    req.flash('error_msg', 'Failed to load about page data');
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Something went wrong on our end.',
      status: 500
    });
  }
};

// Projects page controller
exports.getProjectsPage = async (req, res) => {
  try {
    // Fetch all projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (projectsError) throw projectsError;

    // Fetch site settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (settingsError) throw settingsError;

    res.render('projects', {
      title: 'Projects | ' + settings.site_title,
      projects,
      settings
    });
  } catch (error) {
    console.error('Error fetching projects page data:', error);
    req.flash('error_msg', 'Failed to load projects page data');
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Something went wrong on our end.',
      status: 500
    });
  }
};

// Services page controller
exports.getServicePage = async (req, res) => {
  try {
    // Fetch all services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (servicesError) throw servicesError;

    // Fetch site settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (settingsError) throw settingsError;

    res.render('service', {
      title: 'Services | ' + settings.site_title,
      services,
      settings
    });
  } catch (error) {
    console.error('Error fetching services page data:', error);
    req.flash('error_msg', 'Failed to load services page data');
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Something went wrong on our end.',
      status: 500
    });
  }
};

// Blog page controller
exports.getBlogPage = async (req, res) => {
  try {
    // Fetch all blog posts
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (blogsError) throw blogsError;

    // Fetch site settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (settingsError) throw settingsError;

    res.render('blog', {
      title: 'Blog | ' + settings.site_title,
      blogs,
      settings
    });
  } catch (error) {
    console.error('Error fetching blog page data:', error);
    req.flash('error_msg', 'Failed to load blog page data');
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Something went wrong on our end.',
      status: 500
    });
  }
};

// Blog details page controller
exports.getBlogDetailsPage = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch blog post by ID
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (blogError) throw blogError;

    if (!blog) {
      return res.status(404).render('error', {
        title: '404 Not Found',
        message: 'The blog post you are looking for does not exist.',
        status: 404
      });
    }

    // Fetch recent blog posts
    const { data: recentBlogs, error: recentBlogsError } = await supabase
      .from('blogs')
      .select('*')
      .neq('id', id)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (recentBlogsError) throw recentBlogsError;

    // Fetch site settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (settingsError) throw settingsError;

    res.render('blog-details', {
      title: `${blog.title} | ${settings.site_title}`,
      blog,
      recentBlogs,
      settings
    });
  } catch (error) {
    console.error('Error fetching blog details page data:', error);
    req.flash('error_msg', 'Failed to load blog details page data');
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Something went wrong on our end.',
      status: 500
    });
  }
};

// Single project page controller
exports.getSingleProjectPage = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch project by ID
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (projectError) throw projectError;

    if (!project) {
      return res.status(404).render('error', {
        title: '404 Not Found',
        message: 'The project you are looking for does not exist.',
        status: 404
      });
    }

    // Fetch related projects
    const { data: relatedProjects, error: relatedProjectsError } = await supabase
      .from('projects')
      .select('*')
      .neq('id', id)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (relatedProjectsError) throw relatedProjectsError;

    // Fetch site settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (settingsError) throw settingsError;

    res.render('single-project', {
      title: `${project.title} | ${settings.site_title}`,
      project,
      relatedProjects,
      settings
    });
  } catch (error) {
    console.error('Error fetching single project page data:', error);
    req.flash('error_msg', 'Failed to load single project page data');
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Something went wrong on our end.',
      status: 500
    });
  }
};

// Contact page controller
exports.getContactPage = async (req, res) => {
  try {
    // Fetch profile data for contact information
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('*')
      .single();
    
    if (profileError) throw profileError;

    // Fetch site settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (settingsError) throw settingsError;

    res.render('contact', {
      title: 'Contact | ' + settings.site_title,
      profile,
      settings
    });
  } catch (error) {
    console.error('Error fetching contact page data:', error);
    req.flash('error_msg', 'Failed to load contact page data');
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Something went wrong on our end.',
      status: 500
    });
  }
};

// Process contact form submission
exports.processContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate form data
    if (!name || !email || !message) {
      req.flash('error_msg', 'Please fill in all required fields');
      return res.redirect('/contact');
    }

    // Store contact submission in Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        { 
          name, 
          email, 
          phone, 
          subject, 
          message 
        }
      ]);
    
    if (error) throw error;

    req.flash('success_msg', 'Thank you for your message! We will get back to you soon.');
    res.redirect('/contact');
  } catch (error) {
    console.error('Error processing contact form:', error);
    req.flash('error_msg', 'Failed to submit your message. Please try again later.');
    res.redirect('/contact');
  }
};
