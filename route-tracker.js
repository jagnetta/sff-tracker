// Route assignment tracking system
class RouteTracker {
    constructor() {
        this.assignments = {};
    }

    // Load existing assignments from the server
    async loadAssignments() {
        try {
            const response = await fetch('/api/assignments');
            if (!response.ok) {
                throw new Error('Failed to load assignments from server');
            }
            const data = await response.json();
            this.assignments = data.assignments || {};
        } catch (error) {
            console.error('Error loading route assignments:', error);
            this.assignments = {};
        }
    }

    // Assign routes to a user
    async assignRoutes(routeIds, userInfo) {
        const newAssignments = {};
        const assignment = {
            lastName: userInfo.lastName,
            unit: userInfo.unit,
            timestamp: new Date().toISOString(),
        };

        // Create a map of new assignments
        routeIds.forEach(routeId => {
            newAssignments[routeId] = assignment;
        });

        try {
            const response = await fetch('/api/assignments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAssignments),
            });
            if (!response.ok) {
                throw new Error('Failed to save assignments to server');
            }
            // Update local assignments
            Object.assign(this.assignments, newAssignments);
            return { ...assignment, routes: routeIds };
        } catch (error) {
            console.error('Error saving route assignments:', error);
            return null;
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

    // Remove a single route assignment
    async removeRouteAssignment(routeId) {
        if (this.assignments[routeId]) {
            try {
                const response = await fetch(`/api/assignments/${routeId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete assignment on server');
                }
                delete this.assignments[routeId];
                return true;
            } catch (error) {
                console.error('Error deleting route assignment:', error);
                return false;
            }
        }
        return false;
    }

    // Clear all assignments (admin function)
    async clearAllAssignments() {
        try {
            const response = await fetch('/api/assignments/clear', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to clear assignments on server');
            }
            this.assignments = {};
        } catch (error) {
            console.error('Error clearing all assignments:', error);
        }
    }

    // Export assignments as text
    exportAssignments() {
        let export_text = 'ROUTE ASSIGNMENTS EXPORT\n';
        export_text += '================================\n\n';

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
            export_text += `${assignee}:\n`;
            assignments[assignee].sort().forEach(routeId => {
                const route = this.findRouteById(routeId);
                if (route) {
                    export_text += `  - ${routeId}: ${route.name} (${route.flyerCount} flyers)\n`;
                }
            });
            export_text += '\n';
        });

        export_text += `\nTotal Routes Assigned: ${Object.keys(this.assignments).length}\n`;
        export_text += `Export Generated: ${new Date().toLocaleString()}\n`;

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