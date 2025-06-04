/*==============================================================*/
// Modern Contact Form Handler - Replaces PHP with Serverless Function
/*==============================================================*/

class ModernContactForm {
    constructor() {
        this.form = null;
        this.isSubmitting = false;
        this.init();
    }

    init() {
        // Wait for jQuery and DOM to be ready
        const setupForm = () => {
            this.form = $("#contactForm");
            if (this.form.length === 0) {
                console.log('Contact form not found on this page');
                return;
            }

            // Initialize form validator if available
            if (this.form.validator) {
                this.form.validator().on("submit", (event) => this.handleSubmit(event));
            } else {
                // Fallback for when validator is not available
                this.form.on("submit", (event) => this.handleSubmit(event));
            }

            console.log('✅ Modern contact form initialized');
        };

        if (typeof $ !== 'undefined') {
            $(document).ready(setupForm);
        } else {
            // Fallback if jQuery is not loaded yet
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(setupForm, 1000);
            });
        }
    }

    async handleSubmit(event) {
        if (event && event.isDefaultPrevented && event.isDefaultPrevented()) {
            // Handle invalid form from validator
            this.formError();
            this.submitMSG(false, "Did you fill in the form properly?");
            return;
        }

        event.preventDefault();

        if (this.isSubmitting) return;

        // Get form data
        const formData = this.getFormData();

        // Validate
        const validation = this.validateFormData(formData);
        if (!validation.isValid) {
            this.formError();
            this.submitMSG(false, validation.message);
            return;
        }

        await this.submitForm(formData);
    }

    getFormData() {
        return {
            name: $("#name").val()?.trim() || '',
            email: $("#email").val()?.trim() || '',
            subject: $("#subject").val()?.trim() || '',
            message: $("#message").val()?.trim() || ''
        };
    }

    validateFormData(data) {
        if (!data.name) return { isValid: false, message: "Please enter your name" };
        if (!data.email) return { isValid: false, message: "Please enter your email" };
        if (!data.subject) return { isValid: false, message: "Please enter a subject" };
        if (!data.message) return { isValid: false, message: "Please enter your message" };

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return { isValid: false, message: "Please enter a valid email address" };
        }

        return { isValid: true };
    }

    async submitForm(formData) {
        this.isSubmitting = true;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.formSuccess(result.message);
            } else {
                this.formError();
                this.submitMSG(false, result.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.formError();
            this.submitMSG(false, 'Network error. Please try again.');
        } finally {
            this.isSubmitting = false;
        }
    }

    formSuccess(message = "Message Submitted!") {
        if (this.form && this.form[0]) {
            this.form[0].reset();
        }
        this.submitMSG(true, message);
    }

    formError() {
        if (this.form) {
            this.form.removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass();
            });
        }
    }

    submitMSG(valid, msg) {
        if (valid) {
            const msgClasses = 'h3 text-center tada animated text-success';
            const msgText = msg;
            $("#msgSubmit").removeClass().addClass(msgClasses).text(msgText).show();

            // Show success message in form area
            $(".input-success").show().text(msgText);
            $(".input-error").hide();
        } else {
            const msgClasses = 'h3 text-center text-danger';
            const msgText = msg;
            $("#msgSubmit").removeClass().addClass(msgClasses).text(msgText).show();

            // Show error message in form area
            $(".input-error").show().text(msgText);
            $(".input-success").hide();
        }

        // Auto-hide message after 6 seconds
        setTimeout(() => {
            $("#msgSubmit").fadeOut();
        }, 6000);
    }
}

// Initialize when ready
$(document).ready(function() {
    new ModernContactForm();
});

// Fallback initialization
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        if (typeof $ !== 'undefined' && !window.modernContactFormInitialized) {
            new ModernContactForm();
            window.modernContactFormInitialized = true;
        }
    });
}

    function submitMSG(valid, msg){
        if(valid){
            var msgClasses = "h4 text-left tada animated text-success";
        } else {
            var msgClasses = "h4 text-left text-danger";
        }
        $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
    }
}(jQuery)); // End of use strict