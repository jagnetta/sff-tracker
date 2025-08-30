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

function generateGoogleMapsUrl(route) {
    // Parse the route description to extract street names
    const description = route.description;
    
    // Split by " - All //" or " - All" to get individual street segments
    const segments = description.split(/ - All(?:\s*\/\/|$)/).map(s => s.trim()).filter(s => s.length > 0);
    
    if (segments.length === 0) {
        // Fallback to basic search
        return `https://www.google.com/maps/search/${encodeURIComponent(route.name + ' Taunton MA')}`;
    }
    
    // Create a directions URL connecting the street segments
    // Start with the first street segment, then create waypoints for others
    let waypoints = [];
    
    segments.forEach(segment => {
        // Clean up the segment - remove parenthetical descriptions
        let cleanSegment = segment.replace(/\([^)]+\)/g, '').trim();
        
        // Add "Taunton MA" to each segment
        waypoints.push(encodeURIComponent(cleanSegment + ', Taunton, MA'));
    });
    
    if (waypoints.length === 1) {
        // Single location search - let Google Maps center on the street automatically
        return `https://www.google.com/maps/search/${waypoints[0]}`;
    } else {
        // Multi-point directions - Google will automatically center on the route
        const origin = waypoints[0];
        const destination = waypoints[waypoints.length - 1];
        const intermediate = waypoints.slice(1, -1);
        
        let url = `https://www.google.com/maps/dir/${origin}`;
        
        if (intermediate.length > 0) {
            url += '/' + intermediate.join('/');
        }
        
        if (waypoints.length > 1) {
            url += '/' + destination;
        }
        
        // Remove the fixed coordinates - let Google Maps center automatically on the route
        return url;
    }
}

function displayRouteDetails(routes) {
    const routeDetails = document.getElementById('routeDetails');
    
    if (routes.length === 0) {
        routeDetails.innerHTML = '<p>No route details available.</p>';
        return;
    }
    
    const detailsHTML = routes.map(route => {
        const mapUrl = generateGoogleMapsUrl(route);
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&format=png&data=${encodeURIComponent(mapUrl)}`;
        
        return `
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
                <div class="route-map-section">
                    <div class="route-qr-code">
                        <img src="${qrApiUrl}" width="100" height="100" alt="QR Code for Route Map" />
                    </div>
                    <div class="route-map-info">
                        <div><strong>🗺️ View Map</strong></div>
                        <div>Scan QR code to view route on Google Maps</div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    routeDetails.innerHTML = detailsHTML;
}

// Utility functions for actions
function printDetails() {
    // Get current session data
    const selectedRegion = sessionStorage.getItem('selectedRegion');
    const selectedRouteIds = JSON.parse(sessionStorage.getItem('selectedRoutes') || '[]');
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    
    // Create URL parameters for the print page
    const params = new URLSearchParams({
        region: selectedRegion,
        routes: encodeURIComponent(JSON.stringify(selectedRouteIds)),
        user: encodeURIComponent(JSON.stringify(userInfo))
    });
    
    // Open print page in new tab
    const printWindow = window.open(`print-routes.html?${params.toString()}`, '_blank');
    
    // Optional: Focus the new window
    if (printWindow) {
        printWindow.focus();
    }
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
    
    content += `IMPORTANT ROUTE INSTRUCTIONS\\n`;
    content += `========================================\\n`;
    content += `Please pay close attention to odd numbers, even numbers, cross streets, etc. where\\n`;
    content += `routes begin and end. "All" means both sides of street. This is to avoid overlapping.\\n\\n`;
    content += `ROUTE DETAILS\\n`;
    content += `========================================\\n\\n`;
    
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