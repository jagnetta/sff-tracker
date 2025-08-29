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
    
    // Group routes by region
    const routesByRegion = {};
    let totalFlyers = 0;
    
    userRoutes.forEach(routeId => {
        const route = routeTracker.findRouteById(routeId);
        if (route) {
            // Find region
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
    
    // Create printable HTML content
    let printContent = `
        <html>
        <head>
            <title>Route Assignments - ${userInfo.lastName} - ${userInfo.unit}</title>
            <style>
                @media print {
                    body { margin: 0.5in; }
                    .page-break { page-break-before: always; }
                    .no-break { page-break-inside: avoid; }
                }
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 15px; 
                    line-height: 1.3; 
                    font-size: 12px;
                }
                .header { 
                    text-align: center; 
                    border-bottom: 2px solid #333; 
                    padding-bottom: 8px; 
                    margin-bottom: 15px; 
                }
                .header h1 { 
                    font-size: 18px; 
                    margin: 0 0 5px 0; 
                }
                .header h2 { 
                    font-size: 16px; 
                    margin: 0 0 5px 0; 
                }
                .info-grid {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    gap: 15px;
                }
                .info-box { 
                    background: #f8f8f8; 
                    padding: 10px; 
                    border-radius: 4px; 
                    flex: 1;
                    border: 1px solid #ddd;
                }
                .info-box h3 {
                    font-size: 14px;
                    margin: 0 0 8px 0;
                    color: #2c5aa0;
                }
                .info-box p {
                    margin: 3px 0;
                    font-size: 11px;
                }
                .region { 
                    margin-bottom: 20px; 
                    page-break-inside: avoid;
                }
                .region h2 { 
                    color: #2c5aa0; 
                    border-bottom: 1px solid #ccc; 
                    padding-bottom: 3px;
                    font-size: 15px;
                    margin: 0 0 10px 0;
                }
                .route { 
                    margin-bottom: 12px; 
                    padding: 8px; 
                    border-left: 3px solid #2c5aa0; 
                    background: #f9f9f9; 
                    page-break-inside: avoid;
                }
                .route-header { 
                    font-weight: bold; 
                    color: #2c5aa0; 
                    font-size: 13px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .route-flyers { 
                    color: #28a745; 
                    font-weight: bold; 
                    font-size: 12px;
                }
                .route-desc { 
                    margin-top: 4px; 
                    color: #555; 
                    font-size: 11px;
                    line-height: 1.3;
                }
                .instructions-box {
                    background: #fff3cd;
                    border: 2px solid #ffeaa7;
                    padding: 12px;
                    border-radius: 5px;
                    margin-top: 15px;
                }
                .instructions-box h3 {
                    color: #856404;
                    margin: 0 0 8px 0;
                    font-size: 14px;
                }
                .instructions-box p {
                    margin: 0;
                    font-size: 12px;
                    font-weight: bold;
                    color: #856404;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Taunton Scouting for Food Drive</h1>
                <h2>Route Assignments</h2>
                <p><strong>Assigned to:</strong> ${userInfo.lastName} - ${userInfo.unit} | <strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="info-grid">
                <div class="info-box">
                    <h3>Assignment Summary</h3>
                    <p><strong>Total Routes:</strong> ${userRoutes.length}</p>
                    <p><strong>Total Flyers:</strong> ${totalFlyers.toLocaleString()}</p>
                </div>
                
                <div class="info-box">
                    <h3>Important Dates</h3>
                    <p><strong>Door Hanger Distribution:</strong><br>Oct. 25-26th, 9 AM - 3 PM</p>
                    <p><strong>Food Pickup:</strong><br>Sat., Nov. 1st, 9 AM - 1 PM</p>
                    <p><strong>Drop Off:</strong> Matthew Mission Food Pantry<br>76 Church Green, Taunton, MA 02780</p>
                </div>
            </div>
    `;
    
    // Add routes by region
    Object.keys(routesByRegion).forEach(region => {
        printContent += `<div class="region"><h2>${region} Region</h2>`;
        routesByRegion[region].forEach(route => {
            printContent += `
                <div class="route">
                    <div class="route-header">
                        <span>Route ${route.routeId} - ${route.name}</span>
                        <span class="route-flyers">${route.flyerCount} flyers</span>
                    </div>
                    <div class="route-desc">${route.description}</div>
                </div>
            `;
        });
        printContent += '</div>';
    });
    
    // Add Important Route Instructions after all routes
    printContent += `
            <div class="instructions-box">
                <h3>⚠️ Important Route Instructions</h3>
                <p>Please pay close attention to odd numbers, even numbers, cross streets, etc. where routes begin and end. "All" means both sides of street. This is to avoid overlapping.</p>
            </div>
    `;
    
    printContent += '</body></html>';
    
    // Open print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}