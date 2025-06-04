// Contact Form Handler - Enhanced version with better UX
class ContactFormHandler {
  constructor() {
    this.form = null;
    this.submitButton = null;
    this.successMessage = null;
    this.errorMessage = null;
    this.isSubmitting = false;
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupForm());
    } else {
      this.setupForm();
    }
  }

  setupForm() {
    this.form = document.getElementById('contactForm');
    if (!this.form) {
      console.log('Contact form not found on this page');
      return;
    }

    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.successMessage = this.form.querySelector('.input-success');
    this.errorMessage = this.form.querySelector('.input-error');

    // Hide messages initially
    if (this.successMessage) this.successMessage.style.display = 'none';
    if (this.errorMessage) this.errorMessage.style.display = 'none';

    // Add form submit listener
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    console.log('✅ Contact form handler initialized');
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    
    // Hide previous messages
    this.hideMessages();
    
    // Get form data
    const formData = this.getFormData();
    
    // Validate form
    const validation = this.validateForm(formData);
    if (!validation.isValid) {
      this.showError(validation.message);
      return;
    }

    // Show loading state
    this.setLoadingState(true);
    
    try {
      const response = await this.submitForm(formData);
      
      if (response.success) {
        this.showSuccess(response.message);
        this.form.reset(); // Clear form on success
      } else {
        this.showError(response.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError('Network error. Please check your connection and try again.');
    } finally {
      this.setLoadingState(false);
    }
  }

  getFormData() {
    return {
      name: this.form.querySelector('#name')?.value?.trim() || '',
      email: this.form.querySelector('#email')?.value?.trim() || '',
      subject: this.form.querySelector('#subject')?.value?.trim() || '',
      message: this.form.querySelector('#message')?.value?.trim() || ''
    };
  }

  validateForm(data) {
    if (!data.name) {
      return { isValid: false, message: 'Please enter your name' };
    }
    
    if (!data.email) {
      return { isValid: false, message: 'Please enter your email address' };
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    if (!data.subject) {
      return { isValid: false, message: 'Please enter a subject' };
    }
    
    if (!data.message) {
      return { isValid: false, message: 'Please enter your message' };
    }
    
    if (data.message.length < 10) {
      return { isValid: false, message: 'Message must be at least 10 characters long' };
    }
    
    return { isValid: true };
  }

  async submitForm(formData) {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Server error');
    }
    
    return data;
  }

  setLoadingState(loading) {
    this.isSubmitting = loading;
    
    if (this.submitButton) {
      if (loading) {
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Sending...';
      } else {
        this.submitButton.disabled = false;
        this.submitButton.innerHTML = 'Send Me Message <i class="ri-mail-line"></i>';
      }
    }
  }

  showSuccess(message) {
    if (this.successMessage) {
      this.successMessage.textContent = message;
      this.successMessage.style.display = 'block';
      this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Auto-hide after 8 seconds
    setTimeout(() => this.hideMessages(), 8000);
  }

  showError(message) {
    if (this.errorMessage) {
      this.errorMessage.textContent = message;
      this.errorMessage.style.display = 'block';
      this.errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Auto-hide after 6 seconds
    setTimeout(() => this.hideMessages(), 6000);
  }

  hideMessages() {
    if (this.successMessage) this.successMessage.style.display = 'none';
    if (this.errorMessage) this.errorMessage.style.display = 'none';
  }
}

// Initialize contact form handler
let contactFormHandler;

function initContactForm() {
  if (!contactFormHandler) {
    contactFormHandler = new ContactFormHandler();
  }
}

// Multiple initialization methods for reliability
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}

window.addEventListener('load', initContactForm);

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.initContactForm = initContactForm;
}
