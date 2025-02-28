const API_BASE_URL = "https://narayansena-backend-dy-eqgzhsd3dehddfgc.eastasia-01.azurewebsites.net/api";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const responseMessage = document.getElementById('responseMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            try {
                const response = await fetch(`${API_BASE_URL}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include'
                });

                let result;
                try {
                    result = await response.json();
                } catch (error) {
                    throw new Error('Failed to parse response');
                }

                if (response.ok) {
                    responseMessage.innerHTML = `<p style="color: green;">${result.message || 'Login successful!'}</p>`;
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('userId', result.userId);
                    window.location.href = 'index.html';
                } else {
                    responseMessage.innerHTML = `<p style="color: red;">Login failed: ${result.message || 'Invalid credentials'}</p>`;
                }
            } catch (error) {
                responseMessage.innerHTML = `<p style="color: red;">An error occurred: ${error.message}</p>`;
            }
        });
    }
});
