// Route confirmation page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!checkAuthentication()) {
        return;
    }
    
    // Check if user info is provided
    const userInfo = sessionStorage.getItem('userInfo');
    if (!userInfo) {
        window.location.href = 'user-info.html';
        return;
    }
    
    const selectedRegion = sessionStorage.getItem('selectedRegion');
    const selectedRouteIds = JSON.parse(sessionStorage.getItem('selectedRoutes') || '[]');
    
    if (!selectedRegion || selectedRouteIds.length === 0) {
        // Redirect back to main page if no data
        window.location.href = 'home.html';
        return;
    }
    
    // Display confirmation page
    displayConfirmationPage(selectedRegion, selectedRouteIds, JSON.parse(userInfo));
});

function displayConfirmationPage(region, routeIds, userInfo) {
    // Display region
    document.getElementById('selectedRegion').textContent = region;
    
    // Display user info
    const userInfoDiv = document.getElementById('userInfo');
    userInfoDiv.innerHTML = `
        <p><strong>Name:</strong> ${userInfo.lastName}</p>
        <p><strong>Unit:</strong> ${userInfo.unit}</p>
        <p><strong>Selection Date:</strong> ${new Date().toLocaleDateString()}</p>
    `;
    
    // Get route data for selected routes
    const allRoutes = routeData[region] || [];
    const selectedRoutes = allRoutes.filter(route => routeIds.includes(route.routeId));
    
    // Display selected routes
    displaySelectedRoutes(selectedRoutes);
    
    // Update summary
    updateSummary(selectedRoutes);
}

function displaySelectedRoutes(routes) {
    const routesList = document.getElementById('selectedRoutesList');
    
    if (routes.length === 0) {
        routesList.innerHTML = '<p>No routes selected.</p>';
        return;
    }
    
    const routesHTML = routes.map(route => `
        <div class="confirmation-route-card">
            <div class="route-confirmation-header">
                <h4>Route ${route.routeId} - ${route.name}</h4>
                <span class="route-confirmation-flyers">${route.flyerCount} flyers</span>
            </div>
            <div class="route-confirmation-description">
                ${route.description}
            </div>
        </div>
    `).join('');
    
    routesList.innerHTML = routesHTML;
}

function updateSummary(routes) {
    const totalFlyers = routes.reduce((sum, route) => sum + route.flyerCount, 0);
    
    document.getElementById('totalRoutes').textContent = routes.length;
    document.getElementById('totalFlyers').textContent = totalFlyers.toLocaleString();
}

function cancelSelection() {
    // Go back to route selection
    history.back();
}

function confirmSelection() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const selectedRouteIds = JSON.parse(sessionStorage.getItem('selectedRoutes') || '[]');
    
    if (selectedRouteIds.length === 0) {
        alert('No routes selected to confirm.');
        return;
    }
    
    // Show confirmation dialog
    const confirmMessage = `Are you sure you want to confirm the selection of ${selectedRouteIds.length} route(s)? This action cannot be undone and these routes will no longer be available for other users.`;
    
    if (confirm(confirmMessage)) {
        // Assign routes to user
        routeTracker.assignRoutes(selectedRouteIds, userInfo);
        
        // Clear selection from session storage
        sessionStorage.removeItem('selectedRoutes');
        sessionStorage.removeItem('selectedRegion');
        
        // Redirect to success page
        window.location.href = 'details.html?confirmed=true';
    }
}