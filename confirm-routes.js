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

function displayConfirmationPage(region, routeIds, userInfo) {
    // Display region
    document.getElementById('selectedRegion').textContent = region;
    
    // Display user info
    const userInfoDiv = document.getElementById('userInfo');
    userInfoDiv.innerHTML = `
        <p><strong>Name:</strong> ${userInfo.lastName}</p>
        <p><strong>Unit:</strong> ${userInfo.unit}</p>
        <p><strong>Selection Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <div class="user-assignment-info">
            <h4>Important Dates & Instructions</h4>
            <p><strong>Door Hanger Distribution:</strong> Oct. 25-26th from 9 AM to 3 PM</p>
            <p><strong>Food Pickup:</strong> Sat., Nov. 1st from 9 AM to 1 PM</p>
            <p><strong>Food Drop Off Location:</strong> The Matthew Mission Food Pantry at 76 Church Green, Taunton, MA 02780</p>
        </div>
    `;
    
    // Check and display existing assignments
    displayExistingAssignments(userInfo);
    
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
    
    const routesHTML = routes.map(route => {
        const mapUrl = generateGoogleMapsUrl(route);
        return `
            <div class="confirmation-route-card">
                <div class="route-confirmation-header">
                    <h4>Route ${route.routeId} - ${route.name}</h4>
                    <span class="route-confirmation-flyers">${route.flyerCount} flyers</span>
                </div>
                <div class="route-confirmation-description">
                    ${route.description}
                </div>
                <div class="route-actions">
                    <a href="${mapUrl}" target="_blank" class="btn-map">🗺️ View Map</a>
                </div>
            </div>
        `;
    }).join('');
    
    routesList.innerHTML = routesHTML;
}

function displayExistingAssignments(userInfo) {
    // Hide the existing assignments section on confirm page
    const existingSection = document.getElementById('existingAssignmentsSection');
    existingSection.style.display = 'none';
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