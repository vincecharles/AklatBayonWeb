// Common Javascript functionality for AklatBayon Web

// Auto-open category dropdown if a category filter is active (mostly for catalog pages)
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) {
        const catDropdown = document.getElementById('catalog-categories');
        if (catDropdown) {
            catDropdown.classList.add('show');
        }
    }

    // Set active link based on current URL
    const currentLocation = location.href;
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    
    navLinks.forEach(link => {
        if(link.href === currentLocation) {
            link.classList.add('active');
            
            // If it's inside a dropdown, make sure the dropdown is open
            const dropdownCollapse = link.closest('.collapse');
            if (dropdownCollapse) {
                dropdownCollapse.classList.add('show');
                const toggle = document.querySelector(`[data-bs-target="#${dropdownCollapse.id}"]`);
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'true');
                }
            }
        }
    });

    // Handle delete confirmations if any form uses it
    document.querySelectorAll('.delete-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            Swal.fire({
                title: 'Are you sure?',
                text: "This action cannot be undone.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#e94560',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) form.submit();
            });
        });
    });
});
