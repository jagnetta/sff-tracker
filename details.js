// Details page JavaScript for displaying selected routes
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
    
    // Get route data for selected routes
    const allRoutes = routeData[selectedRegion] || [];
    const selectedRoutes = allRoutes.filter(route => selectedRouteIds.includes(route.routeId));
    
    // Display summary information
    displaySummary(selectedRegion, selectedRoutes);
    
    // Display detailed route information
    displayRouteDetails(selectedRoutes);
});

function displaySummary(region, routes) {
    const summaryInfo = document.getElementById('summaryInfo');
    
    const totalFlyers = routes.reduce((sum, route) => sum + route.flyerCount, 0);
    const routeCount = routes.length;
    
    summaryInfo.innerHTML = `
        <div class="summary-item">
            <div class="summary-value">${region}</div>
            <div class="summary-label">Region</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">${routeCount}</div>
            <div class="summary-label">${routeCount === 1 ? 'Route' : 'Routes'} Selected</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">${totalFlyers.toLocaleString()}</div>
            <div class="summary-label">Total Flyers</div>
        </div>
    `;
}

function displayRouteDetails(routes) {
    const routeDetails = document.getElementById('routeDetails');
    
    if (routes.length === 0) {
        routeDetails.innerHTML = '<p>No route details available.</p>';
        return;
    }
    
    const detailsHTML = routes.map(route => `
        <div class="route-detail-card">
            <div class="route-detail-header">
                <div>
                    <strong>Route ${route.routeId} - ${route.name}</strong>
                </div>
                <div>
                    <strong>${route.flyerCount} flyers</strong>
                </div>
            </div>
            <div class="route-detail-content">
                <div class="route-detail-description">
                    ${route.description}
                </div>
            </div>
        </div>
    `).join('');
    
    routeDetails.innerHTML = detailsHTML;
}

// Utility functions for actions
function printDetails() {
    window.print();
}

function downloadDetails() {
    const selectedRegion = sessionStorage.getItem('selectedRegion');
    const selectedRouteIds = JSON.parse(sessionStorage.getItem('selectedRoutes') || '[]');
    const allRoutes = routeData[selectedRegion] || [];
    const selectedRoutes = allRoutes.filter(route => selectedRouteIds.includes(route.routeId));
    
    const totalFlyers = selectedRoutes.reduce((sum, route) => sum + route.flyerCount, 0);
    
    let content = `TAUNTON FOOD DRIVE ROUTE DETAILS\\n`;
    content += `========================================\\n\\n`;
    content += `Region: ${selectedRegion}\\n`;
    content += `Routes Selected: ${selectedRoutes.length}\\n`;
    content += `Total Flyers: ${totalFlyers.toLocaleString()}\\n`;
    content += `Generated: ${new Date().toLocaleDateString()}\\n\\n`;
    
    selectedRoutes.forEach(route => {
        content += `ROUTE ${route.routeId} - ${route.name}\\n`;
        content += `Flyers: ${route.flyerCount}\\n`;
        content += `Description: ${route.description}\\n`;
        content += `${'='.repeat(60)}\\n\\n`;
    });
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-drive-routes-${selectedRegion.toLowerCase().replace(/\\s+/g, '-')}-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}