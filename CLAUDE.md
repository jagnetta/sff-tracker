# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Application

This is a client-side only web application - simply open `index.html` in any modern web browser. No build process, server, or package installation required.

## Authentication System

The application has a dual authentication system:
- **Regular users**: username `liberty`, password `union` (case-insensitive)
- **Admin users**: username `baden`, password `powell` (case-insensitive)

Regular users go through: Login → User Info Collection → Route Selection → Confirmation → Assignment
Admin users go directly to: Login → Admin Dashboard

## Core Architecture

### Data Flow and Storage
- **Route data**: Static data in `data.js` organized by 6 regions (CENTER, WEIR, OAKLAND, WHITTENTON, EAST TAUNTON, WESTVILLE)
- **Route assignments**: Stored in browser localStorage via `RouteTracker` class for persistence across sessions
- **User session**: Stored in sessionStorage (cleared when browser closes)
- **Authentication state**: Tracked in sessionStorage with `authenticated` and `isAdmin` flags

### Key Components

**RouteTracker Class** (`route-tracker.js`): 
- Central assignment management using localStorage
- Prevents double-booking by filtering out assigned routes
- Provides methods for assignment, reset, and data export
- Global instance available as `routeTracker`

**Authentication Flow** (`auth.js`):
- Handles dual-user authentication (regular vs admin)
- Sets session flags for routing and access control
- Provides `checkAuthentication()` and `logout()` functions used across pages

**Page Flow**:
1. `index.html` - Authentication router based on login state
2. `login.html` - Dual login form 
3. `user-info.html` - Collects Last Name and Unit (regular users only)
4. `home.html` - Region selection with existing assignment display
5. `routes.html` - Multi-select route interface (shows only available routes)
6. `confirm-routes.html` - Confirmation step before assignment
7. `details.html` - Final assignment confirmation and print functionality
8. `admin-dashboard.html` - Complete assignment management (admin only)

### Data Structures

Routes are structured as:
```javascript
{
    routeId: "1-1",           // Unique identifier
    name: "WASHINGTON ST.",    // Route name
    flyerCount: 200,          // Number of flyers to distribute
    description: "Street descriptions..."  // Detailed route info
}
```

Assignments track:
```javascript
{
    lastName: "Smith",
    unit: "Troop 40", 
    timestamp: "2025-01-15T10:30:00.000Z"
}
```

### State Management

Each page includes authentication checks and redirects users appropriately:
- Missing authentication → login page
- Admin users → dashboard
- Regular users without user info → user info page
- Route assignment state maintained across navigation

### Print and Export Features

- **User print**: Opens formatted HTML in new window with print dialog, includes "Important Dates & Instructions" card
- **Admin CSV export**: Downloads CSV with proper CRLF line endings for Excel compatibility
- **Assignment reset**: Admin can reset individual routes or clear all assignments
- **Route removal**: Users can remove their own route assignments, returning routes to available status

## Common Development Tasks

### Adding New Routes
Edit the `routeData` object in `data.js` following the existing structure. Routes are organized by region.

**Route Description Formatting**: Route descriptions use " - All //" as separators between street segments, except for the final segment which ends with " - All" (no double slash). This formatting is critical for proper display across the application.

### Modifying Authentication
Update credentials in `auth.js` login handler. Two user types supported with different redirect flows.

### Changing Route Assignment Logic
The `RouteTracker` class in `route-tracker.js` handles all assignment persistence. Methods include:
- `assignRoutes()` - Creates assignments
- `isRouteAssigned()` - Checks availability  
- `getAvailableRoutes()` - Filters by region and availability
- `getUserAssignments()` - Gets user's routes
- `removeRouteAssignment()` - Removes single route assignments
- `clearAllAssignments()` - Admin function to reset all assignments
- `exportAssignments()` - Generates text export of all assignments

### Styling Changes
Dark theme CSS in `styles.css` with responsive design. Key classes:
- `.btn-primary`, `.btn-secondary`, `.btn-danger` for buttons
- `.stat-card` for dashboard statistics
- `.route-card`, `.confirmation-route-card` for route displays
- `.user-assignment-info`, `.user-confirmation-info` for information cards with dark theme background
- Always use CSS classes rather than inline styles to maintain consistent dark theme styling

## Security Notes

This is a client-side application with hardcoded credentials suitable for small organizational use. All data persistence uses browser storage (localStorage for assignments, sessionStorage for current session).