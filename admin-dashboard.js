// Admin dashboard JavaScript
let allRoutesData = [];
let filteredRoutesData = [];

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated as admin
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // Load and display dashboard data
    await loadDashboardData();
    
    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('regionFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('searchFilter').addEventListener('input', applyFilters);
}

async function loadDashboardData() {
    // Load assignments first
    await routeTracker.loadAssignments();

    // Compile all routes from all regions
    allRoutesData = [];
    
    Object.keys(routeData).forEach(region => {
        routeData[region].forEach(route => {
            const assignment = routeTracker.getRouteAssignment(route.routeId);
            allRoutesData.push({
                ...route,
                region: region,
                status: assignment ? 'assigned' : 'available',
                assignedTo: assignment ? `${assignment.lastName} - ${assignment.unit}` : 'Available',
                assignmentData: assignment
            });
        });
    });
    
    // Update statistics
    updateStatistics();
    
    // Display routes table
    filteredRoutesData = [...allRoutesData];
    displayRoutesTable();
}

function updateStatistics() {
    const assignedRoutes = allRoutesData.filter(route => route.status === 'assigned');
    const availableRoutes = allRoutesData.filter(route => route.status === 'available');
    
    // Get unique units and calculate flyer counts
    const units = new Set();
    let assignedFlyers = 0;
    let availableFlyers = 0;
    
    assignedRoutes.forEach(route => {
        if (route.assignmentData) {
            units.add(route.assignmentData.unit);
        }
        assignedFlyers += route.flyerCount;
    });
    
    availableRoutes.forEach(route => {
        availableFlyers += route.flyerCount;
    });
    
    document.getElementById('totalAssignedRoutes').textContent = assignedRoutes.length;
    document.getElementById('totalAvailableRoutes').textContent = availableRoutes.length;
    document.getElementById('totalUnits').textContent = units.size;
    document.getElementById('assignedFlyers').textContent = assignedFlyers.toLocaleString();
    document.getElementById('remainingFlyers').textContent = availableFlyers.toLocaleString();
}

function displayRoutesTable() {
    const tableBody = document.getElementById('routesTableBody');
    
    if (filteredRoutesData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="no-routes">No routes match your filter criteria.</td></tr>';
        return;
    }
    
    const tableHTML = filteredRoutesData.map(route => `
        <tr class="route-row ${route.status}">
            <td class="route-id">${route.routeId}</td>
            <td class="route-region">${route.region}</td>
            <td class="route-name">${route.name}</td>
            <td class="route-flyers">${route.flyerCount}</td>
            <td class="route-status">
                <span class="status-badge ${route.status}">${route.status.toUpperCase()}</span>
            </td>
            <td class="route-assignee">${route.assignedTo}</td>
            <td class="route-actions">
                ${route.status === 'assigned' ? 
                    `<button onclick="resetRoute('${route.routeId}')" class="btn-reset">Reset</button>` :
                    '<span class="no-action">—</span>'
                }
            </td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = tableHTML;
}

function applyFilters() {
    const regionFilter = document.getElementById('regionFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    
    filteredRoutesData = allRoutesData.filter(route => {
        // Region filter
        if (regionFilter && route.region !== regionFilter) {
            return false;
        }
        
        // Status filter
        if (statusFilter && route.status !== statusFilter) {
            return false;
        }
        
        // Search filter
        if (searchFilter) {
            const searchText = `${route.routeId} ${route.name} ${route.assignedTo}`.toLowerCase();
            if (!searchText.includes(searchFilter)) {
                return false;
            }
        }
        
        return true;
    });
    
    displayRoutesTable();
}

async function resetRoute(routeId) {
    const route = allRoutesData.find(r => r.routeId === routeId);
    if (!route || route.status !== 'assigned') {
        alert('Route is not assigned or not found.');
        return;
    }
    
    const confirmMessage = `Are you sure you want to reset Route ${routeId}?\n\nThis will make it available for selection again.\n\nCurrently assigned to: ${route.assignedTo}`;
    
    if (confirm(confirmMessage)) {
        // Remove assignment from route tracker
        const success = await routeTracker.removeRouteAssignment(routeId);
        
        if (success) {
            // Reload dashboard data
            await loadDashboardData();
            alert(`Route ${routeId} has been reset and is now available for selection.`);
        } else {
            alert('Error: Assignment not found or could not be removed.');
        }
    }
}

async function clearAllAssignments() {
    const assignedCount = allRoutesData.filter(route => route.status === 'assigned').length;
    
    if (assignedCount === 0) {
        alert('No assignments to clear.');
        return;
    }
    
    const confirmMessage = `⚠️ WARNING: This will clear ALL route assignments!\n\n${assignedCount} routes will be reset to available.\n\nThis action cannot be undone.\n\nType "CLEAR ALL" to confirm:`;
    
    const userInput = prompt(confirmMessage);
    
    if (userInput === 'CLEAR ALL') {
        await routeTracker.clearAllAssignments();
        await loadDashboardData();
        alert('All route assignments have been cleared.');
    } else {
        alert('Clear operation cancelled.');
    }
}

function exportAllAssignments() {
    const assignedRoutes = allRoutesData.filter(route => route.status === 'assigned');
    
    if (assignedRoutes.length === 0) {
        alert('No assignments to export.');
        return;
    }
    
    // Create CSV header with proper line ending
    let csvContent = 'Route ID,Region,Route Name,Flyer Count,Last Name,Unit,Assignment Date\r\n';
    
    // Add assigned routes data with proper line endings
    assignedRoutes.forEach(route => {
        const assignmentData = route.assignmentData;
        const assignmentDate = assignmentData ? 
            new Date(assignmentData.timestamp).toLocaleDateString() : 
            'Unknown';
        
        // Escape commas and quotes in text fields
        const routeName = `"${route.name.replace(/"/g, '""')}"`;
        const lastName = assignmentData ? `"${assignmentData.lastName.replace(/"/g, '""')}"` : 'Unknown';
        const unit = assignmentData ? `"${assignmentData.unit.replace(/"/g, '""')}"` : 'Unknown';
        
        csvContent += `${route.routeId},${route.region},${routeName},${route.flyerCount},${lastName},${unit},${assignmentDate}\r\n`;
    });
    
    // Create and download CSV file with proper MIME type
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `route-assignments-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

