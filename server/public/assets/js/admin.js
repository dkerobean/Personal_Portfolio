// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Toggle sidebar on mobile
  const sidebarToggle = document.querySelector('.navbar-toggler');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      document.querySelector('.sidebar').classList.toggle('show');
    });
  }

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Auto-hide flash messages after 5 seconds
  const flashMessages = document.querySelectorAll('.alert');
  flashMessages.forEach(function(message) {
    setTimeout(function() {
      const alert = bootstrap.Alert.getOrCreateInstance(message);
      alert.close();
    }, 5000);
  });

  // Preview image on file input change
  const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
  imageInputs.forEach(function(input) {
    input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        
        // Find the closest image preview element
        const previewContainer = input.parentElement.querySelector('.image-preview');
        if (previewContainer) {
          reader.onload = function(e) {
            previewContainer.innerHTML = `<img src="${e.target.result}" class="img-fluid mb-2" style="max-height: 200px; max-width: 100%;">`;
          };
          
          reader.readAsDataURL(file);
        }
      }
    });
  });

  // Dashboard charts initialization if needed
  if (document.getElementById('visitorChart')) {
    const ctx = document.getElementById('visitorChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Visitors',
          data: [65, 59, 80, 81, 56, 55, 40, 50, 60, 70, 80, 90],
          fill: false,
          borderColor: '#4e73df',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Initialize DataTables if they exist
  if ($.fn.DataTable) {
    $('.datatable').DataTable({
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search...",
      }
    });
  }

  // Confirm delete actions
  const deleteButtons = document.querySelectorAll('[data-delete-url]');
  deleteButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        window.location.href = button.dataset.deleteUrl;
      }
    });
  });
});
