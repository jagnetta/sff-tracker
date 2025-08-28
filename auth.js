// Authentication logic
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.toLowerCase().trim();
            const password = document.getElementById('password').value.toLowerCase().trim();
            
            // Check credentials (not case sensitive)
            if (username === 'liberty' && password === 'union') {
                // Set authentication flag for regular user
                sessionStorage.setItem('authenticated', 'true');
                
                // Redirect to user info page
                window.location.href = 'user-info.html';
            } else if (username === 'baden' && password === 'powell') {
                // Set authentication flag for admin user
                sessionStorage.setItem('authenticated', 'true');
                sessionStorage.setItem('isAdmin', 'true');
                
                // Redirect to admin dashboard
                window.location.href = 'admin-dashboard.html';
            } else {
                // Show error message
                showError('Invalid username or password. Please try again.');
            }
        });
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Clear error after 5 seconds
        setTimeout(function() {
            errorMessage.style.display = 'none';
        }, 5000);
    }
});

// Function to check if user is authenticated
function checkAuthentication() {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    
    if (isAuthenticated !== 'true') {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Function to logout
function logout() {
    sessionStorage.removeItem('authenticated');
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('selectedRegion');
    sessionStorage.removeItem('selectedRoutes');
    window.location.href = 'login.html';
}