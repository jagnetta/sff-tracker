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
        <div class="assignments-by-region">
    `;
    
    Object.keys(routesByRegion).forEach(region => {
        assignmentsHTML += `<div class="region-assignments">
            <h3>${region} Region</h3>
            <ul>`;
        
        routesByRegion[region].forEach(route => {
            assignmentsHTML += `
                <li class="assigned-route">
                    <strong>Route ${route.routeId} - ${route.name}</strong>
                    <span class="route-flyers">${route.flyerCount} flyers</span>
                    <div class="route-desc">${route.description}</div>
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

function showRegionSelector() {
    const existingDiv = document.getElementById('existingAssignments');
    const regionSelector = document.getElementById('regionSelector');
    
    existingDiv.style.display = 'none';
    regionSelector.style.display = 'block';
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
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    line-height: 1.4; 
                }
                .header { 
                    text-align: center; 
                    border-bottom: 2px solid #333; 
                    padding-bottom: 10px; 
                    margin-bottom: 20px; 
                }
                .summary { 
                    background: #f5f5f5; 
                    padding: 15px; 
                    margin-bottom: 20px; 
                    border-radius: 5px; 
                }
                .region { 
                    margin-bottom: 25px; 
                }
                .region h2 { 
                    color: #2c5aa0; 
                    border-bottom: 1px solid #ccc; 
                    padding-bottom: 5px; 
                }
                .route { 
                    margin-bottom: 15px; 
                    padding: 10px; 
                    border-left: 4px solid #2c5aa0; 
                    background: #f9f9f9; 
                }
                .route-header { 
                    font-weight: bold; 
                    color: #2c5aa0; 
                }
                .route-flyers { 
                    color: #28a745; 
                    font-weight: bold; 
                }
                .route-desc { 
                    margin-top: 5px; 
                    color: #555; 
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Taunton Scouting for Food Drive</h1>
                <h2>Route Assignments</h2>
                <p><strong>Assigned to:</strong> ${userInfo.lastName} - ${userInfo.unit}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="summary">
                <h3>Summary</h3>
                <p><strong>Total Routes:</strong> ${userRoutes.length}</p>
                <p><strong>Total Flyers:</strong> ${totalFlyers.toLocaleString()}</p>
            </div>
    `;
    
    // Add routes by region
    Object.keys(routesByRegion).forEach(region => {
        printContent += `<div class="region"><h2>${region} Region</h2>`;
        routesByRegion[region].forEach(route => {
            printContent += `
                <div class="route">
                    <div class="route-header">
                        Route ${route.routeId} - ${route.name} 
                        <span class="route-flyers">(${route.flyerCount} flyers)</span>
                    </div>
                    <div class="route-desc">${route.description}</div>
                </div>
            `;
        });
        printContent += '</div>';
    });
    
    printContent += '</body></html>';
    
    // Open print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}