document.addEventListener('DOMContentLoaded', () => {
    let screenWindows = {};

    // Function to add a new screen to the table
    function addScreenToList(screenName, ipAddress, url) {
        const tableBody = document.querySelector('#usersTable tbody');

        // Create a new row
        const row = document.createElement('tr');

        // Create and append the screen name cell with a link
        const nameCell = document.createElement('td');
        const nameLink = document.createElement('a');
        nameLink.textContent = screenName;
        // nameLink.href = url; // Link to the URL
        nameLink.target = '_blank'; // Open link in a new tab
        nameCell.appendChild(nameLink);
        row.appendChild(nameCell);

        // Create and append the IP address cell
        const ipCell = document.createElement('td');
        ipCell.textContent = ipAddress;
        row.appendChild(ipCell);

        // Create and append the URL cell
        const urlCell = document.createElement('td');
        const urlLink = document.createElement('a');
        urlLink.textContent = url;
        urlLink.href = url;
        urlLink.target = '_blank';
        urlCell.appendChild(urlLink);
        row.appendChild(urlCell);

        // Create and append the delete button cell
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            row.remove();
            removeScreenFromLocalStorage(screenName, ipAddress);
        };
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        // Append the row to the table body
        tableBody.appendChild(row);
    }

    // Function to remove a screen from localStorage
    function removeScreenFromLocalStorage(screenName, ipAddress) {
        let screens = JSON.parse(localStorage.getItem('screens')) || [];
        screens = screens.filter(screen => screen.name !== screenName || screen.ip !== ipAddress);
        localStorage.setItem('screens', JSON.stringify(screens));
    }

    // Load saved screens from localStorage and display them
    function loadScreens() {
        const screens = JSON.parse(localStorage.getItem('screens')) || [];
        screens.forEach(screen => addScreenToList(screen.name, screen.ip, screen.url));
    }

    // Load screens on page load
    loadScreens();
});

function goBack() {
    window.history.back();
}
