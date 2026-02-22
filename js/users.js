// users.js - Handles User Management CRUD Operations (MOCK DATA)

// Initial Mock Data Array representing the AklatBayon database
let mockUsers = [
    { id: 'usr-001', username: 'admin01', full_name: 'Admin User', email: 'admin@example.com', role: 'Admin', faculty_subtype: '', status: 'active' },
    { id: 'usr-002', username: 'lib01', full_name: 'Jane Smith', email: 'jane@example.com', role: 'Librarian', faculty_subtype: '', status: 'active' },
    { id: 'usr-003', username: 'stud01', full_name: 'John Doe', email: 'john@example.com', role: 'Student', faculty_subtype: '', status: 'active' },
    { id: 'usr-004', username: 'prof01', full_name: 'Mark Taylor', email: 'mark@example.com', role: 'Faculty', faculty_subtype: 'teacher', status: 'inactive' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Only fetch users if we are actually on the users page
    if (window.location.pathname.endsWith('users.html')) {
        fetchUsers();
    }

    // Attach event listener to the Add/Edit form
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    }
});

/**
 * Toggle the visibility of Faculty Subtype dropdown based on User Type
 */
window.toggleFacultySubtype = function() {
    const role = document.getElementById('role').value;
    const subtypeContainer = document.getElementById('facultySubtypeContainer');
    if (role === 'Faculty') {
        subtypeContainer.style.display = 'block';
        document.getElementById('facultySubtype').required = true;
    } else {
        subtypeContainer.style.display = 'none';
        document.getElementById('facultySubtype').required = false;
        document.getElementById('facultySubtype').value = '';
    }
}

/**
 * Fetch mock users and render the table
 */
function fetchUsers() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    // Simulate network delay
    setTimeout(() => {
        renderUsersTable(mockUsers);
    }, 300);
}

/**
 * Render the HTML table rows based on user data
 */
function renderUsersTable(users) {
    const tbody = document.getElementById('users-table-body');
    
    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No users found in the system. Click 'Add New User' to begin.</td></tr>`;
        return;
    }

    tbody.innerHTML = ''; 

    users.forEach(user => {
        const row = document.createElement('tr');
        
        // Define role badge color
        let roleBadgeClass = 'bg-secondary';
        if (user.role === 'Admin') roleBadgeClass = 'bg-danger';
        if (user.role === 'Librarian') roleBadgeClass = 'bg-info';
        if (user.role === 'Student') roleBadgeClass = 'bg-success';
        if (user.role === 'Faculty') roleBadgeClass = 'bg-warning text-dark';

        // Format role and subtype nicely
        let roleDisplay = `<span class="badge ${roleBadgeClass}">${user.role}</span>`;
        if (user.role === 'Faculty' && user.faculty_subtype) {
            roleDisplay += `<br><small class="text-muted mt-1 d-inline-block">${user.faculty_subtype.replace('_', ' ').toUpperCase()}</small>`;
        }

        row.innerHTML = `
            <td><code>${user.username}</code></td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 35px; height: 35px; font-weight: bold; font-size: 14px;">
                        ${user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div><strong>${user.full_name}</strong></div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${roleDisplay}</td>
            <td>
                <span class="badge ${user.status === 'active' ? 'bg-success' : (user.status === 'locked' ? 'bg-danger' : 'bg-secondary')}">
                    ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
            </td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" onclick='openEditModal(${JSON.stringify(user).replace(/'/g, "&#39;")})' title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${user.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Handle Add/Edit form submission using Mock Data array
 */
function handleUserSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('saveUserBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';

    const userId = document.getElementById('userId').value;
    const userData = {
        username: document.getElementById('username').value,
        full_name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value,
        faculty_subtype: document.getElementById('facultySubtype').value,
        status: document.getElementById('status').value
    };

    setTimeout(() => {
        if (userId) {
            // Update existing user in array
            const index = mockUsers.findIndex(u => u.id === userId);
            if (index !== -1) {
                mockUsers[index] = { ...mockUsers[index], ...userData };
            }
            showToast('Success', 'User updated successfully!', 'success');
        } else {
            // Create new user in array
            userData.id = 'usr-' + Math.random().toString(36).substr(2, 9);
            mockUsers.unshift(userData); // Add to beginning of array
            showToast('Success', 'User added successfully!', 'success');
        }

        // Close modal and refresh table
        const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
        modal.hide();
        fetchUsers();
        
        submitBtn.disabled = false;
        submitBtn.innerText = 'Save User';
    }, 400); // Simulate network latency
}

/**
 * Open Modal in "Add" mode
 */
window.openAddModal = function() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userModalLabel').innerText = 'Add New User';
    toggleFacultySubtype();
}

/**
 * Open Modal in "Edit" mode and pre-fill data
 */
window.openEditModal = function(user) {
    document.getElementById('userId').value = user.id;
    document.getElementById('username').value = user.username;
    document.getElementById('fullName').value = user.full_name;
    document.getElementById('email').value = user.email;
    document.getElementById('role').value = user.role;
    document.getElementById('facultySubtype').value = user.faculty_subtype || '';
    document.getElementById('status').value = user.status;
    document.getElementById('userModalLabel').innerText = 'Edit User';
    
    toggleFacultySubtype();
    
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

/**
 * Delete a user with SweetAlert confirmation
 */
window.deleteUser = function(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This user will be permanently deleted!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e94560',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Remove from array
            mockUsers = mockUsers.filter(u => u.id !== id);
            
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
            fetchUsers();
        }
    });
}

/**
 * Helper to show toast alerts (fallback to SweetAlert)
 */
function showToast(title, message, icon) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: icon,
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}
