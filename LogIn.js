document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please fill out all fields.');
        return;
    }

    // Retrieve existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.userName === username && user.password === password);

    // Special case for hardcoded admin
    if (username === 'admin' && password === 'ad987') {
        window.location.href = 'Amin1Home.html';
    } else if (user) {
        // If user exists in localStorage, redirect based on their role
        if (user.isAdmin) {
            window.location.href = 'SubAdmin.html';
        } else {
            window.location.href = 'OneClick.html';
        }
    } else {
        // If credentials do not match any user
        alert('Incorrect username or password');
    }

    // Reset the form
    document.getElementById('loginForm').reset();
});
