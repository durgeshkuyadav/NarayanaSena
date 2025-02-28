const form = document.getElementById('registrationForm');
const loginForm = document.getElementById('loginForm'); // Added login form
const responseMessage = document.getElementById('responseMessage');
const loginResponseMessage = document.getElementById('loginResponseMessage'); // Login response message
const mobileInput = document.getElementById('mobile');
const referrerInput = document.getElementById('referrer');
const API_BASE_URL = "https://narayansena-backend-dy-eqgzhsd3dehddfgc.eastasia-01.azurewebsites.net";

const mobilePattern = /^[6-9]\d{9}$/;

// **Registration Form Submission**
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    form.classList.remove('was-validated');
    mobileInput.classList.remove('is-invalid');
    referrerInput.classList.remove('is-invalid');

    if (!mobilePattern.test(mobileInput.value)) {
        mobileInput.classList.add('is-invalid');
        responseMessage.innerHTML = `<p class="text-danger">Please enter a valid 10-digit mobile number.</p>`;
        return;
    }

    const userDto = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        mobileNumber: mobileInput.value.trim(),
        city: document.getElementById('city').value.trim(),
        password: document.getElementById('password').value,
        referrerId: referrerInput.value.trim() || null
    };

    if (userDto.referrerId) {
        try {
            const checkReferrer = await fetch(`${API_BASE_URL}/api/users/check-referrer/${userDto.referrerId}`);
            if (!checkReferrer.ok) {
                referrerInput.classList.add('is-invalid');
                responseMessage.innerHTML = `<p class="text-danger">The provided Referrer ID does not exist.</p>`;
                return;
            }
        } catch (error) {
            console.error('Error checking referrer:', error);
            responseMessage.innerHTML = `<p class="text-danger">Error verifying Referrer ID. Please try again later.</p>`;
            return;
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userDto),
        });

        const data = await response.json();

        if (response.ok) {
            responseMessage.innerHTML = `<p class="text-success">${data.message}</p>`;
            form.reset();
            setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
            responseMessage.innerHTML = `<p class="text-danger">${data.error || 'An unexpected error occurred.'}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        responseMessage.innerHTML = `<p class="text-danger">Registration failed. Please try again later.</p>`;
    }
});

// **Login Form Submission**
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            loginResponseMessage.innerHTML = `<p class="text-success">${data.message}</p>`;
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('fullName', data.fullName);
            setTimeout(() => window.location.href = 'dashboard.html', 1500);
        } else {
            loginResponseMessage.innerHTML = `<p class="text-danger">${data.error || 'Invalid credentials. Please try again.'}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        loginResponseMessage.innerHTML = `<p class="text-danger">Login failed. Please try again later.</p>`;
    }
});

// **Real-time validation for mobile number**
mobileInput.addEventListener('input', () => {
    mobileInput.classList.toggle('is-invalid', !mobilePattern.test(mobileInput.value));
});

// **Check referrer validity**
referrerInput.addEventListener('blur', async () => {
    const referrerId = referrerInput.value.trim();
    if (!referrerId) return; // Skip if empty

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/check-referrer/${referrerId}`);

        // Handle empty or unexpected responses
        let data;
        try {
            data = await response.json();
        } catch (error) {
            data = { error: "Unexpected server response" };
        }

        if (response.ok) {
            referrerInput.classList.add('is-valid');
            referrerInput.classList.remove('is-invalid');
            responseMessage.innerHTML = `<p class="text-success">${data.message || "Referrer ID is valid."}</p>`;
        } else {
            referrerInput.classList.add('is-invalid');
            referrerInput.classList.remove('is-valid');
            responseMessage.innerHTML = `<p class="text-danger">${data.error || "Invalid Referrer ID."}</p>`;
        }
    } catch (error) {
        console.error('Error checking referrer:', error);
        responseMessage.innerHTML = `<p class="text-danger">Error verifying Referrer ID. Please try again later.</p>`;
    }
});

