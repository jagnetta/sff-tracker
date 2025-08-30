// Main page JavaScript for region selection
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
    
    // Check for existing assignments
    const userInfoData = JSON.parse(userInfo);
    const existingRoutes = routeTracker.getUserAssignments(userInfoData.lastName, userInfoData.unit);
    
    if (existingRoutes.length > 0) {
        showExistingAssignments(existingRoutes, userInfoData);
    }
    
    const regionForm = document.getElementById('regionForm');
    
    if (regionForm) {
        regionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const selectedRegion = document.getElementById('regionSelect').value;
            
            if (selectedRegion) {
                // Store selected region in sessionStorage
                sessionStorage.setItem('selectedRegion', selectedRegion);
                
                // Redirect to routes page
                window.location.href = 'routes.html';
            } else {
                alert('Please select a region first.');
            }
        });
    }
});

function showExistingAssignments(routeIds, userInfo) {
    const existingDiv = document.getElementById('existingAssignments');
    const assignmentsList = document.getElementById('assignmentsList');
    const regionSelector = document.getElementById('regionSelector');
    
    // Group routes by region
    const routesByRegion = {};
    let totalFlyers = 0;
    
    routeIds.forEach(routeId => {
        const route = routeTracker.findRouteById(routeId);
        if (route) {
            // Find which region this route belongs to
            let routeRegion = null;
            for (const region in routeData) {
                if (routeData[region].find(r => r.routeId === routeId)) {
                    routeRegion = region;
                    break;
                }
            }
            
            if (routeRegion) {
                if (!routesByRegion[routeRegion]) {
                    routesByRegion[routeRegion] = [];
                }
                routesByRegion[routeRegion].push(route);
                totalFlyers += route.flyerCount;
            }
        }
    });
    
    let assignmentsHTML = `
        <div class="user-assignment-info">
            <p><strong>Assigned to:</strong> ${userInfo.lastName} - ${userInfo.unit}</p>
            <p><strong>Total Routes:</strong> ${routeIds.length}</p>
            <p><strong>Total Flyers:</strong> ${totalFlyers.toLocaleString()}</p>
        </div>
        <div class="user-assignment-info">
            <h3>Important Dates & Instructions</h3>
            <p><strong>Door Hanger Distribution:</strong> Oct. 25-26th from 9 AM to 3 PM</p>
            <p><strong>Food Pickup:</strong> Sat., Nov. 1st from 9 AM to 1 PM</p>
            <p><strong>Food Drop Off Location:</strong> The Matthew Mission Food Pantry at 76 Church Green, Taunton, MA 02780</p>
        </div>
        <div class="assignments-by-region">
    `;
    
    Object.keys(routesByRegion).forEach(region => {
        assignmentsHTML += `<div class="region-assignments">
            <h3>${region} Region</h3>
            <ul>`;
        
        routesByRegion[region].forEach(route => {
            const mapUrl = generateGoogleMapsUrl(route);
            assignmentsHTML += `
                <li class="assigned-route">
                    <div class="route-info">
                        <strong>Route ${route.routeId} - ${route.name}</strong>
                        <span class="route-flyers">${route.flyerCount} flyers</span>
                        <div class="route-desc">${route.description}</div>
                    </div>
                    <div class="route-actions">
                        <a href="${mapUrl}" target="_blank" class="btn-map">🗺️ View Map</a>
                        <button onclick="removeRouteFromAssignment('${route.routeId}')" class="btn-danger remove-route-btn">Remove</button>
                    </div>
                </li>
            `;
        });
        
        assignmentsHTML += `</ul></div>`;
    });
    
    assignmentsHTML += '</div>';
    assignmentsList.innerHTML = assignmentsHTML;
    
    existingDiv.style.display = 'block';
    regionSelector.style.display = 'none';
}

function removeRouteFromAssignment(routeId) {
    if (confirm('Are you sure you want to remove this route from your assignments?')) {
        const removed = routeTracker.removeRouteAssignment(routeId);
        if (removed) {
            // Refresh the assignments display
            refreshAssignmentsDisplay();
        } else {
            alert('Error removing route assignment.');
        }
    }
}

function refreshAssignmentsDisplay() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const userRoutes = routeTracker.getUserAssignments(userInfo.lastName, userInfo.unit);
    
    if (userRoutes.length === 0) {
        // No routes left, show region selector
        showRegionSelector();
    } else {
        // Still have routes, refresh the display
        showExistingAssignments(userRoutes, userInfo);
    }
}

function showRegionSelector() {
    const existingDiv = document.getElementById('existingAssignments');
    const regionSelector = document.getElementById('regionSelector');
    
    existingDiv.style.display = 'none';
    regionSelector.style.display = 'block';
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

function printUserAssignments() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const userRoutes = routeTracker.getUserAssignments(userInfo.lastName, userInfo.unit);
    
    if (userRoutes.length === 0) {
        alert('No route assignments to print.');
        return;
    }
    
    // Group routes by region to determine primary region
    const routesByRegion = {};
    
    userRoutes.forEach(routeId => {
        const route = routeTracker.findRouteById(routeId);
        if (route) {
            // Find region for this route
            let routeRegion = null;
            for (const region in routeData) {
                if (routeData[region].find(r => r.routeId === routeId)) {
                    routeRegion = region;
                    break;
                }
            }
            
            if (routeRegion) {
                if (!routesByRegion[routeRegion]) {
                    routesByRegion[routeRegion] = [];
                }
                routesByRegion[routeRegion].push(route);
            }
        }
    });
    
    // Use the first region found (most routes), or fallback to CENTER
    // Note: The print page now searches all regions, so this is mainly for compatibility
    const primaryRegion = Object.keys(routesByRegion)[0] || 'CENTER';
    
    // Create URL parameters for the print page
    const params = new URLSearchParams({
        region: primaryRegion,
        routes: encodeURIComponent(JSON.stringify(userRoutes)),
        user: encodeURIComponent(JSON.stringify(userInfo))
    });
    
    // Open print page in new tab
    const printWindow = window.open(`print-routes.html?${params.toString()}`, '_blank');
    
    // Optional: Focus the new window
    if (printWindow) {
        printWindow.focus();
    }
}