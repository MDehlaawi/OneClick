document.getElementById('createUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email1 = document.getElementById('email1').value;
    const password1 = document.getElementById('password1').value;
    const email2 = document.getElementById('email2').value;
    const password2 = document.getElementById('password2').value;
    const isAdmin = document.getElementById('admin').checked;

    if (password1 !== password2) {
        alert('Passwords do not match!');
        return;
    }

    if (!validatePassword(password1)) {
        alert('Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.');
        return;
    }

    if (isEmailRegistered(email1)) {
        alert('This email is already registered!');
        return;
    }

    if (isUsernameRegistered(email2)) {
        alert('This username is already taken!');
        return;
    }

    const newUser = {
        email: email1,
        userName: email2,
        password: password1,
        isAdmin: isAdmin
    };

    // Retrieve existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);

    // Save updated user list to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    console.log('New user created:', newUser);
    alert('User created successfully!');

    // Reset the form
    document.getElementById('createUserForm').reset();
});

function goBack() {
    window.history.back();
}

function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar;
}

function isEmailRegistered(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.email === email);
}

function isUsernameRegistered(username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.userName === username);
}
