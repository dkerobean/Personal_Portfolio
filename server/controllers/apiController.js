const supabase = require('../config/supabase');

// API endpoints for content
exports.getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch profile data' 
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch projects data' 
    });
  }
};

exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch project data' 
    });
  }
};

exports.getServices = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch services data' 
    });
  }
};

exports.getService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ 
        success: false, 
        error: 'Service not found' 
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch service data' 
    });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch blogs data' 
    });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ 
        success: false, 
        error: 'Blog not found' 
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch blog data' 
    });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch settings data' 
    });
  }
};

// Protected API endpoints for admin dashboard
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

    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update profile' 
    });
  }
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
      completion_date,
      image_url
    } = req.body;

    const projectData = {
      title,
      description,
      client,
      technologies,
      category,
      project_url,
      image_url: image_url || '',
      featured: featured === true || featured === 'true',
      completion_date,
      created_at: new Date(),
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select();

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      message: 'Project created successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create project' 
    });
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
      image_url
    } = req.body;

    const projectData = {
      title,
      description,
      client,
      technologies,
      category,
      project_url,
      featured: featured === true || featured === 'true',
      completion_date,
      updated_at: new Date()
    };

    // Only update image_url if provided
    if (image_url) {
      projectData.image_url = image_url;
    }

    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select();

    if (error) throw error;

    res.status(200).json({ 
      success: true, 
      message: 'Project updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update project' 
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ 
      success: true, 
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete project' 
    });
  }
};

exports.createService = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    const serviceData = {
      title,
      description,
      icon,
      created_at: new Date(),
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select();

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      message: 'Service created successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create service' 
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon } = req.body;

    const serviceData = {
      title,
      description,
      icon,
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select();

    if (error) throw error;

    res.status(200).json({ 
      success: true, 
      message: 'Service updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update service' 
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ 
      success: true, 
      message: 'Service deleted successfully' 
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete service' 
    });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, image_url } = req.body;

    const blogData = {
      title,
      content,
      excerpt,
      category,
      tags,
      image_url: image_url || '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('blogs')
      .insert([blogData])
      .select();

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      message: 'Blog created successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create blog' 
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category, tags, image_url } = req.body;

    const blogData = {
      title,
      content,
      excerpt,
      category,
      tags,
      updated_at: new Date()
    };

    // Only update image_url if provided
    if (image_url) {
      blogData.image_url = image_url;
    }

    const { data, error } = await supabase
      .from('blogs')
      .update(blogData)
      .eq('id', id)
      .select();

    if (error) throw error;

    res.status(200).json({ 
      success: true, 
      message: 'Blog updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update blog' 
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ 
      success: true, 
      message: 'Blog deleted successfully' 
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete blog' 
    });
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
        .eq('id', existingSettings.id)
        .select();
    } else {
      // Create new settings
      result = await supabase
        .from('settings')
        .insert([{ ...settingsData, created_at: new Date() }])
        .select();
    }

    if (result.error) throw result.error;

    res.status(200).json({ 
      success: true, 
      message: 'Settings updated successfully',
      data: result.data[0]
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update settings' 
    });
  }
};
