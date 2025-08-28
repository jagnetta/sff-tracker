// Routes page JavaScript for route selection
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
    
    if (!selectedRegion) {
        // Redirect back to main page if no region selected
        window.location.href = 'home.html';
        return;
    }
    
    // Display selected region
    document.getElementById('selectedRegion').textContent = selectedRegion;
    
    // Get available routes for the selected region (not assigned)
    const routes = routeTracker.getAvailableRoutes(selectedRegion);
    
    // Populate routes list
    const routesList = document.getElementById('routesList');
    const submitButton = document.getElementById('submitRoutes');
    
    if (routes.length === 0) {
        routesList.innerHTML = '<p class="no-routes">No routes found for this region.</p>';
        return;
    }
    
    // Create route checkboxes
    routes.forEach(route => {
        const routeItem = document.createElement('div');
        routeItem.className = 'route-item';
        
        routeItem.innerHTML = `
            <input type="checkbox" id="route-${route.routeId}" name="selectedRoutes" value="${route.routeId}">
            <div class="route-info">
                <div class="route-header">Route ${route.routeId} - ${route.name}</div>
                <div class="route-description">${route.description}</div>
            </div>
            <div class="flyer-count">${route.flyerCount} flyers</div>
        `;
        
        routesList.appendChild(routeItem);
    });
    
    // Add event listeners to checkboxes
    const checkboxes = routesList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSubmitButton);
    });
    
    // Handle form submission
    const routeForm = document.getElementById('routeForm');
    routeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const selectedRouteIds = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        if (selectedRouteIds.length > 0) {
            // Store selected routes in sessionStorage for confirmation page
            sessionStorage.setItem('selectedRoutes', JSON.stringify(selectedRouteIds));
            
            // Redirect to confirmation page
            window.location.href = 'confirm-routes.html';
        } else {
            alert('Please select at least one route.');
        }
    });
    
    function updateSubmitButton() {
        const checkedBoxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
        submitButton.disabled = checkedBoxes.length === 0;
        
        if (checkedBoxes.length > 0) {
            const routeText = checkedBoxes.length === 1 ? 'Route' : 'Routes';
            submitButton.textContent = `Confirm Selected ${routeText} (${checkedBoxes.length})`;
        } else {
            submitButton.textContent = 'Confirm Selected Routes';
        }
    }
});