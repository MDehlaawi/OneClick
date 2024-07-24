document.addEventListener('DOMContentLoaded', function () {
    function loadUsers() {
        // Retrieve users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
        usersTable.innerHTML = '';
        users.forEach((user, index) => {
            const row = usersTable.insertRow();
            const usernameCell = row.insertCell(0);
            const adminCell = row.insertCell(1);
            const deleteCell = row.insertCell(2);

            usernameCell.textContent = user.userName;

            const adminCheckbox = document.createElement('input');
            adminCheckbox.type = 'checkbox';
            adminCheckbox.className = 'admin-checkbox';
            adminCheckbox.checked = user.isAdmin;
            adminCheckbox.addEventListener('change', () => setAdmin(index, adminCheckbox.checked));
            adminCell.appendChild(adminCheckbox);

            const deleteBtn = document.createElement('span');
            deleteBtn.textContent = 'X';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteUser(index));
            deleteCell.appendChild(deleteBtn);
        });
    }

    function setAdmin(index, isChecked) {
        const users = JSON.parse(localStorage.getItem('users'));
        users[index].isAdmin = isChecked;
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
    }

    function deleteUser(index) {
        const users = JSON.parse(localStorage.getItem('users'));
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
    }

    loadUsers();
});

function goBack() {
    window.history.back();
}
