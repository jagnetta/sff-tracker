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
1. `index.html` - Authentication router based on login state (active drive mode)
2. `index_thankyou.html` - Thank you page with drive results (between drives)
3. `login.html` - Dual login form
4. `user-info.html` - Collects Last Name and Unit (regular users only)
5. `home.html` - Region selection with existing assignment display
6. `routes.html` - Multi-select route interface (shows only available routes)
7. `confirm-routes.html` - Confirmation step before assignment
8. `details.html` - Final assignment confirmation and print functionality
9. `admin-dashboard.html` - Complete assignment management (admin only)
10. `print-routes.html` - Optimized print layout with QR codes (auto-opens print dialog)
11. `user-guide.html` - Help documentation accessible from all pages

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

- **User print**: Opens `print-routes.html` in new window with auto-print functionality
- **Print page optimization**: Compact layout with QR codes, efficient spacing for minimal paper usage
- **QR code generation**: Uses TinyURL API to shorten complex Google Maps URLs, then generates QR codes client-side or via fallback API
- **Auto-print timing**: Waits for all QR codes to complete URL shortening and generation before opening print dialog
- **Admin CSV export**: Downloads CSV with proper CRLF line endings for Excel compatibility
- **Assignment reset**: Admin can reset individual routes or clear all assignments
- **Route removal**: Users can remove their own route assignments, returning routes to available status

### QR Code System

The application generates QR codes for Google Maps directions:
1. **Complex URL generation**: Parses route descriptions to create multi-waypoint Google Maps directions
2. **URL shortening**: Uses TinyURL API (`https://tinyurl.com/api-create.php`) to create short URLs for simpler QR codes
3. **Dual generation methods**: Client-side generation with `qrcode.js` library, fallback to `qrserver.com` API
4. **Print optimization**: 100x100px QR codes positioned left of route descriptions
5. **Error handling**: Falls back to original long URLs if shortening fails

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
- `.thank-you-container` for thank you page layout
- `.thank-you-message` for thank you text content
- Always use CSS classes rather than inline styles to maintain consistent dark theme styling

### Switching Between Active and Thank You Modes
The application has two entry points for different phases of the drive:
- **During the drive**: Use `index.html` (authentication router for active assignments)
- **Between drives**: Use `index_thankyou.html` (public thank you page with drive results)

To switch modes:
1. **When drive ends**: Rename `index.html` to `index_active.html`, then rename `index_thankyou.html` to `index.html`
2. **When new drive starts**: Rename `index.html` to `index_thankyou.html`, then rename `index_active.html` to `index.html`

The thank you page displays:
- Gratitude message to Scouts and donors
- Drive results summary (replaces "Current Drive Status"):
  - Total Routes Completed (assigned routes count)
  - Total Flyers Distributed (sum of flyerCount for assigned routes)
  - Participating Units (unique unit count)
  - Coverage Achieved (percentage of routes completed)
- No login functionality or authentication required
- Reads from same localStorage data as active drive mode

### Print Page Development
When working with `print-routes.html`:
- Uses compact, print-optimized layout with minimal spacing
- QR codes are generated asynchronously with URL shortening
- Auto-print functionality waits for `window.qrCodesReady` flag
- Print styles use point sizes (10pt-12pt) and ensure proper page breaks
- Font sizes: 12pt body, 11pt headers, 10pt descriptions/instructions

## Security Notes

This is a client-side application with hardcoded credentials suitable for small organizational use. All data persistence uses browser storage (localStorage for assignments, sessionStorage for current session).