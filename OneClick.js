let screenWindows = {};

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('.add');
    const pushButton = document.querySelector('.push');
    const clearButton = document.querySelector('.clear');
    const screenNameInput = document.getElementById('screenName');
    const ipAddressInput = document.getElementById('ipAddress');
    const screensList = document.getElementById('screensList');
    const allCheckbox = document.getElementById('checkAll');
    const fileInput = document.getElementById('fileInput');
    const imageContainer = document.getElementById('imageContainer');
    const imageViewers = document.getElementById('imageViewers');

    addButton.addEventListener('click', () => {
        const screenName = screenNameInput.value.trim();
        const ipAddress = ipAddressInput.value.trim();

        const existingScreens = screensList.querySelectorAll('.screen-checkbox + span');
        let screenExists = false;
        existingScreens.forEach(screen => {
            if (screen.textContent.trim() === screenName) {
                screenExists = true;
            }
        });

        const existingIPs = screensList.querySelectorAll('.screen-checkbox + span + span');
        let ipExists = false;
        existingIPs.forEach(ip => {
            if (ip.textContent.trim() === ipAddress) {
                ipExists = true;
            }
        });

        if (screenName === '' || ipAddress === '') {
            alert('Enter all fields');
        } else if (screenExists && ipExists) {
            alert('Screen name and IP address must be unique');
        } else if (screenExists) {
            alert('Screen name must be unique');
        } else if (ipExists) {
            alert('IP address must be unique');
        } else {
            addScreenToListWithCheckbox(screenName, ipAddress);

            const imageBox = document.createElement('div');
            imageBox.className = 'image-box';
            imageBox.id = `box-${screenName.replace(/\s+/g, '-')}`;
            imageBox.innerHTML = `<h3>${screenName}</h3>`;
            imageContainer.appendChild(imageBox);

            const screenUrl = `screen.html?name=${encodeURIComponent(screenName)}`;

            let screens = JSON.parse(localStorage.getItem('screens')) || [];
            screens.push({ name: screenName, ip: ipAddress, url: screenUrl });
            localStorage.setItem('screens', JSON.stringify(screens));

            var data = new FormData();
            data.append('screenName', screenName);
            data.append('ip', ipAddress);
            data.append('url', screenUrl);

            fetch('addScreen.php', {
                method: 'POST',
                body: data
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });

            screenNameInput.value = '';
            ipAddressInput.value = '';
        }
    });

    pushButton.addEventListener('click', () => {
        const files = Array.from(fileInput.files).filter(isMedia);
        const selectedScreens = screensList.querySelectorAll('.screen-checkbox:checked');

        if (files.length > 0 && selectedScreens.length > 0) {
            selectedScreens.forEach(screen => {
                const screenName = screen.nextSibling.textContent.trim();
                const imageBox = document.getElementById(`box-${screenName.replace(/\s+/g, '-')}`);

                const media = [];

                // Clear current media for the selected screen
                imageBox.innerHTML = `<h3>${screenName}</h3>`;
                for (const file of files) {
                    const mediaElement = document.createElement(file.type.startsWith('image/') ? 'img' : 'video');
                    mediaElement.src = URL.createObjectURL(file);
                    mediaElement.alt = file.name;
                    mediaElement.style = 'max-width: 100%; height: auto; display: block; width: 100%; height: 100%;';
                    if (file.type.startsWith('video/')) {
                        mediaElement.controls = true;
                    }
                    imageBox.appendChild(mediaElement);
                    media.push(mediaElement.src);
                }

                console.log(`Saving media to localStorage for screen: ${screenName}`);
                console.log(media);

                localStorage.setItem(`media-${screenName}`, JSON.stringify(media));
            });

            // Scroll to the "Screens preview" section after pushing
            imageViewers.scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            alert('Please select at least one screen and import images or videos');
        }
    });

    clearButton.addEventListener('click', () => {
        const selectedScreens = screensList.querySelectorAll('.screen-checkbox:checked');

        selectedScreens.forEach(screen => {
            const screenName = screen.nextSibling.textContent.trim();
            const imageBox = document.getElementById(`box-${screenName.replace(/\s+/g, '-')}`);

            imageBox.innerHTML = `<h3>${screenName}</h3>`;
        });
    });

    allCheckbox.addEventListener('change', () => {
        const checkboxes = screensList.querySelectorAll('.screen-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = allCheckbox.checked;
        });
    });

    fileInput.addEventListener('change', (event) => {
        const files = Array.from(event.target.files).filter(isMedia);

        if (files.length === 0) {
            alert('Please select valid image or video files.');
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const mediaBox = document.createElement('div');
                mediaBox.className = 'media-box';
                const mediaElement = document.createElement(file.type.startsWith('image/') ? 'img' : 'video');
                mediaElement.src = e.target.result;
                mediaElement.alt = file.name;
                if (file.type.startsWith('video/')) {
                    mediaElement.controls = true;
                }
                mediaBox.appendChild(mediaElement);
            };
            reader.readAsDataURL(file);
        });
    });

    fileInput.setAttribute('accept', 'image/*,video/*');

    function addScreenToList(screenName, ipAddress) {
        const tableBody = document.querySelector('#usersTable tbody');

        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        const nameLink = document.createElement('a');
        nameLink.textContent = screenName;
        nameLink.href = `screen.html?name=${encodeURIComponent(screenName)}`;
        nameLink.target = '_blank';
        nameLink.onclick = function() {
            console.log(`Opening screen.html with name: ${screenName}`);
            if (!screenWindows[screenName] || screenWindows[screenName].closed) {
                screenWindows[screenName] = window.open(nameLink.href, '_blank', 'width=800,height=600');
            } else {
                screenWindows[screenName].focus();
            }
        };
        nameCell.appendChild(nameLink);
        row.appendChild(nameCell);

        const ipCell = document.createElement('td');
        ipCell.textContent = ipAddress;
        row.appendChild(ipCell);

        const urlCell = document.createElement('td');
        urlCell.textContent = `screen.html?name=${encodeURIComponent(screenName)}`;
        row.appendChild(urlCell);

        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            row.remove();
            removeScreenFromLocalStorage(screenName, ipAddress);
        };
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);
    }

    function removeScreenFromLocalStorage(screenName, ipAddress) {
        let screens = JSON.parse(localStorage.getItem('screens')) || [];
        screens = screens.filter(screen => screen.name !== screenName || screen.ip !== ipAddress);
        localStorage.setItem('screens', JSON.stringify(screens));
    }

    function loadScreens() {
        const screens = JSON.parse(localStorage.getItem('screens')) || [];
        screens.forEach(screen => {
            addScreenToList(screen.name, screen.ip);
            addScreenToListWithCheckbox(screen.name, screen.ip);
        });
    }

    function addScreenToListWithCheckbox(screenName, ipAddress) {
        const screenItem = document.createElement('p');
        screenItem.innerHTML = `<input type="checkbox" class="screen-checkbox"> ${screenName}`;
        screensList.appendChild(screenItem);
    }

    loadScreens();
});

function isMedia(file) {
    return file.type.startsWith('image/') || file.type.startsWith('video/');
}

function goBack() {
    window.history.back();
}
