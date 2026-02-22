// roles.js - Handles Role Management CRUD Operations (MOCK DATA)

let mockRoles = [
    { id: 1, name: 'Admin', description: 'System Administrator with full access', created_at: '2026-02-23' },
    { id: 2, name: 'Student', description: 'General Student with borrowing privileges', created_at: '2026-02-23' },
    { id: 3, name: 'Librarian', description: 'Library Staff managing books and circulations', created_at: '2026-02-23' },
    { id: 4, name: 'Faculty', description: 'Teaching and Non-teaching staff', created_at: '2026-02-23' }
];

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('roles.html')) {
        fetchRoles();
    }

    const roleForm = document.getElementById('roleForm');
    if (roleForm) {
        roleForm.addEventListener('submit', handleRoleSubmit);
    }
});

function fetchRoles() {
    const tbody = document.getElementById('roles-table-body');
    if (!tbody) return;

    setTimeout(() => {
        renderRolesTable(mockRoles);
    }, 300);
}

function renderRolesTable(roles) {
    const tbody = document.getElementById('roles-table-body');
    
    if (roles.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No roles found in the system. Click 'Add New Role' to begin.</td></tr>`;
        return;
    }

    tbody.innerHTML = ''; 

    roles.forEach(role => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><strong>${role.name}</strong></td>
            <td>${role.description}</td>
            <td><small class="text-muted">${role.created_at}</small></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" onclick='openEditModal(${JSON.stringify(role).replace(/'/g, "&#39;")})' title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteRole(${role.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function handleRoleSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('saveRoleBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';

    const roleId = document.getElementById('roleId').value;
    const roleData = {
        name: document.getElementById('roleName').value,
        description: document.getElementById('roleDescription').value,
        created_at: new Date().toISOString().split('T')[0]
    };

    setTimeout(() => {
        if (roleId) {
            const index = mockRoles.findIndex(r => r.id == roleId);
            if (index !== -1) {
                mockRoles[index] = { ...mockRoles[index], ...roleData };
            }
            showToast('Success', 'Role updated successfully!', 'success');
        } else {
            roleData.id = Math.floor(Math.random() * 1000) + 5;
            mockRoles.push(roleData);
            showToast('Success', 'Role added successfully!', 'success');
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('roleModal'));
        modal.hide();
        fetchRoles();
        
        submitBtn.disabled = false;
        submitBtn.innerText = 'Save Role';
    }, 400);
}

window.openAddModal = function() {
    document.getElementById('roleForm').reset();
    document.getElementById('roleId').value = '';
    document.getElementById('roleModalLabel').innerText = 'Add New Role';
}

window.openEditModal = function(role) {
    document.getElementById('roleId').value = role.id;
    document.getElementById('roleName').value = role.name;
    document.getElementById('roleDescription').value = role.description;
    document.getElementById('roleModalLabel').innerText = 'Edit Role';
    
    const modal = new bootstrap.Modal(document.getElementById('roleModal'));
    modal.show();
}

window.deleteRole = function(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This role will be deleted! Be careful if users are assigned to it.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e94560',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            mockRoles = mockRoles.filter(r => r.id !== id);
            Swal.fire('Deleted!', 'Role has been deleted.', 'success');
            fetchRoles();
        }
    });
}

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
