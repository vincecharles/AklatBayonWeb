// Central Configuration (if needed)

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) {
        const catDropdown = document.getElementById('catalog-categories');
        if (catDropdown) {
            catDropdown.classList.add('show');
        }
    }

    const currentLocation = location.href;
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    
    navLinks.forEach(link => {
        if(link.href === currentLocation) {
            link.classList.add('active');
            
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

    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/AklatBayonWeb/')) {
        fetchBooks();
    }
});

async function fetchBooks() {
    // Mock Dashboard Books Data
    const mockBooks = [
        { id: 'ISBN-1001', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', available_copies: 4, total_copies: 5 },
        { id: 'ISBN-1002', title: 'Clean Code: A Handbook', author: 'Robert C. Martin', available_copies: 3, total_copies: 3 },
        { id: 'ISBN-1003', title: 'Design Patterns', author: 'Erich Gamma', available_copies: 0, total_copies: 2 }
    ];
    
    setTimeout(() => {
        renderBooksTable(mockBooks);
    }, 500); // Simulate network latency
}

function renderBooksTable(books) {
    const tbody = document.getElementById('dashboard-activity-table-body');
    if (!tbody) return;

    if (books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No books found in the database.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';

    books.slice(0, 5).forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${book.id ? book.id.substring(0,8) : '-'}</td>
            <td><strong>${book.title || 'Unknown Title'}</strong></td>
            <td>${book.author || 'Unknown Author'}</td>
            <td>
                <span class="badge ${book.available_copies > 0 ? 'bg-success' : 'bg-danger'}">
                    ${book.available_copies || book.total_copies || 0} Available
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });
}
