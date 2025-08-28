// Route assignment tracking system
class RouteTracker {
    constructor() {
        this.storageKey = 'routeAssignments';
        this.assignments = this.loadAssignments();
    }
    
    // Load existing assignments from localStorage
    loadAssignments() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading route assignments:', error);
            return {};
        }
    }
    
    // Save assignments to localStorage
    saveAssignments() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.assignments));
        } catch (error) {
            console.error('Error saving route assignments:', error);
        }
    }
    
    // Check if a route is already assigned
    isRouteAssigned(routeId) {
        return this.assignments.hasOwnProperty(routeId);
    }
    
    // Get assignment info for a route
    getRouteAssignment(routeId) {
        return this.assignments[routeId] || null;
    }
    
    // Assign routes to a user
    assignRoutes(routeIds, userInfo) {
        const assignment = {
            lastName: userInfo.lastName,
            unit: userInfo.unit,
            timestamp: new Date().toISOString(),
            routes: routeIds
        };
        
        // Assign each route
        routeIds.forEach(routeId => {
            this.assignments[routeId] = {
                ...assignment,
                routes: undefined // Don't store the full array for each route
            };
        });
        
        this.saveAssignments();
        return assignment;
    }
    
    // Get all assignments for a specific user
    getUserAssignments(lastName, unit) {
        const userRoutes = [];
        Object.keys(this.assignments).forEach(routeId => {
            const assignment = this.assignments[routeId];
            if (assignment.lastName === lastName && assignment.unit === unit) {
                userRoutes.push(routeId);
            }
        });
        return userRoutes;
    }
    
    // Get all available routes for a region (not assigned)
    getAvailableRoutes(region) {
        const allRoutes = routeData[region] || [];
        return allRoutes.filter(route => !this.isRouteAssigned(route.routeId));
    }
    
    // Get statistics about assignments
    getAssignmentStats() {
        const totalAssignments = Object.keys(this.assignments).length;
        const units = {};
        
        Object.values(this.assignments).forEach(assignment => {
            if (!units[assignment.unit]) {
                units[assignment.unit] = 0;
            }
            units[assignment.unit]++;
        });
        
        return {
            totalAssignments,
            unitBreakdown: units
        };
    }
    
    // Clear all assignments (admin function)
    clearAllAssignments() {
        this.assignments = {};
        this.saveAssignments();
    }
    
    // Export assignments as text
    exportAssignments() {
        let export_text = 'ROUTE ASSIGNMENTS EXPORT\\n';
        export_text += '================================\\n\\n';
        
        const assignments = {};
        Object.keys(this.assignments).forEach(routeId => {
            const assignment = this.assignments[routeId];
            const key = `${assignment.lastName} - ${assignment.unit}`;
            if (!assignments[key]) {
                assignments[key] = [];
            }
            assignments[key].push(routeId);
        });
        
        Object.keys(assignments).sort().forEach(assignee => {
            export_text += `${assignee}:\\n`;
            assignments[assignee].sort().forEach(routeId => {
                const route = this.findRouteById(routeId);
                if (route) {
                    export_text += `  - ${routeId}: ${route.name} (${route.flyerCount} flyers)\\n`;
                }
            });
            export_text += '\\n';
        });
        
        export_text += `\\nTotal Routes Assigned: ${Object.keys(this.assignments).length}\\n`;
        export_text += `Export Generated: ${new Date().toLocaleString()}\\n`;
        
        return export_text;
    }
    
    // Helper function to find route by ID across all regions
    findRouteById(routeId) {
        for (const region in routeData) {
            const route = routeData[region].find(r => r.routeId === routeId);
            if (route) return route;
        }
        return null;
    }
}

// Global instance
const routeTracker = new RouteTracker();