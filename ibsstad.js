
const webcamElement = document.getElementById('webcam');
const statusElement = document.getElementById('status');
let webcamStream = null;


function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'security' && password === '12345') {
        alert('Login successful!');
        window.location.href = 'ibsstad.html'; // Redirect to the system page
    } else {
        alert('Invalid username or password. Please try again.');
    }
}


function startWebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                webcamStream = stream;
                webcamElement.srcObject = stream;
                statusElement.textContent = "Webcam is live!";
                statusElement.style.color = "#007b83";
            })
            .catch((error) => {
                statusElement.textContent = "Unable to access webcam: " + error.message;
                statusElement.style.color = "red";
            });
    } else {
        statusElement.textContent = "Webcam not supported in this browser.";
        statusElement.style.color = "red";
    }
}


function stopWebcam() {
    if (webcamStream) {
        webcamStream.getTracks().forEach((track) => track.stop());
        webcamElement.srcObject = null;
        statusElement.textContent = "Webcam stopped.";
        statusElement.style.color = "#333";
    }
}



const dateElement = document.getElementById('current-date');
const timeElement = document.getElementById('current-time');
const locationElement = document.getElementById('current-location');


function updateDate() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    dateElement.textContent = formattedDate;
}


function updateTime() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    timeElement.textContent = formattedTime;
}


async function fetchCountry(latitude, longitude) {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data && data.address && data.address.country) {
            locationElement.textContent = `Country: ${data.address.country}`;
        } else {
            locationElement.textContent = 'Unable to determine country.';
        }
    } catch (error) {
        locationElement.textContent = 'Error retrieving country data.';
        console.error('Geocoding error:', error);
    }
}


function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                locationElement.textContent = `Fetching country...`;
                fetchCountry(latitude, longitude);
            },
            () => {
                locationElement.textContent = 'Unable to retrieve location.';
            }
        );
    } else {
        locationElement.textContent = 'Geolocation not supported by this browser.';
    }
}

updateDate();
updateTime();
updateLocation();


setInterval(updateTime, 1000);
