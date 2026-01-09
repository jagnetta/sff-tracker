# Taunton Scouting for Food Drive Route Selector

A comprehensive web-based application for volunteers and administrators to manage food drive routes in Taunton, MA. This system provides secure user authentication, route assignment tracking, assignment confirmation, and administrative oversight for the annual Scouting for Food Drive.

## Overview

The Taunton Scouting for Food Drive Route Selector processes route data from a CSV spreadsheet and presents it through an intuitive web interface. The system supports both volunteer users and administrators, with complete route assignment tracking and prevention of double-booking to ensure optimal coverage during the food drive.

## Features

### Authentication System
- **Dual Login System**: Separate access paths for volunteers and administrators
- **Session Management**: Secure session handling with automatic logout functionality

### Volunteer Features

#### User Registration & Information Collection
- **Personal Information**: Last Name and Unit selection required for tracking
- **Unit Selection**: Dropdown with Troop 40, Troop 22, Pack 49, Pack 87, or custom "Other" option
- **Data Persistence**: User information maintained throughout session

#### Route Selection Process
1. **Region Selection**: Choose from 6 Taunton regions (CENTER, WEIR, OAKLAND, WHITTENTON, EAST TAUNTON, WESTVILLE)
2. **Available Routes Display**: Only shows routes not yet assigned to other users
3. **Multi-Route Selection**: Checkbox interface for selecting multiple routes
4. **Route Details**: Comprehensive information including street descriptions and flyer counts
5. **Selection Confirmation**: Dedicated confirmation page with assignment warning
6. **Assignment Completion**: Routes become unavailable to other users after confirmation

#### Assignment Management
- **Existing Assignment Display**: Shows user's previously selected routes organized by region
- **Route Removal**: Users can remove their own route assignments, returning routes to available status
- **Additional Route Selection**: Option to select more routes from different regions
- **Assignment Summary**: Total routes and flyer counts for user's assignments
- **Enhanced Print System**: Optimized print layout with QR codes for Google Maps navigation
- **QR Code Integration**: Scannable QR codes for each route that open detailed Google Maps directions
- **Auto-Print Feature**: Print dialog automatically opens when accessing route details for printing

### Administrative Features

#### Complete Assignment Dashboard
- **Real-Time Statistics**: 
  - Routes Assigned vs Available
  - Active Units participating
  - Assigned Flyers vs Remaining Flyers
- **Comprehensive Route Table**: All 150+ routes with assignment status and details
- **Advanced Filtering**: By region, assignment status, or search by route/assignee

#### Assignment Management
- **Individual Route Reset**: Restore any assigned route back to available status
- **Bulk Reset**: Clear all route assignments with safety confirmation
- **Assignment Tracking**: Complete audit trail of who selected which routes and when

#### Data Export & Reporting
- **CSV Export**: Download complete assignment data in CSV format with proper formatting
- **Assignment Reports**: Detailed exports showing routes by assignee and region
- **Data Integrity**: Proper line endings and CSV standards for Excel compatibility

### User Experience Enhancements
- **Dark Theme**: Professional dark interface design throughout all pages
- **Responsive Design**: Mobile-friendly interface that works across all device sizes
- **Intuitive Navigation**: Clear navigation paths with back links and logout options
- **Real-time Updates**: Dynamic button updates and live assignment counts
- **Self-Service Management**: Users can manage their own assignments without admin intervention
- **Important Information Cards**: Key dates and instructions displayed prominently
- **Error Handling**: User-friendly error messages and validation
- **Print Optimization**: Clean, professional print layouts for route information

## Technical Architecture

### Complete File Structure
```
sff-tracker/
├── server.js               # Node.js Express server and API
├── database.json           # Persistent data storage for assignments
├── index.html              # Authentication router and main entry point (active drive)
├── index_thankyou.html     # Thank you page with drive results (between drives)
├── login.html              # Dual login form (volunteer/admin)
├── user-info.html          # User information collection (volunteers only)
├── home.html               # Region selection with existing assignments display
├── routes.html             # Route selection interface (available routes only)
├── confirm-routes.html     # Route selection confirmation page
├── details.html            # Final assignment confirmation and details
├── print-routes.html       # Optimized print layout with QR codes and auto-print
├── admin-dashboard.html    # Complete administrative interface
├── user-guide.html         # Interactive help documentation
├── styles.css              # Comprehensive dark theme styling
├── auth.js                 # Authentication and session management
├── user-info.js            # User information collection logic
├── data.js                 # Static route data organized by regions
├── route-tracker.js        # Client-side assignment tracking and API communication
├── main.js                 # Home page and assignment display logic
├── routes.js               # Route selection and filtering logic
├── confirm-routes.js       # Confirmation page functionality
├── details.js              # Assignment details and print functionality
├── admin-dashboard.js      # Complete admin dashboard functionality
├── GEMINI.md               # Developer guidance for Gemini Code
└── README.md               # This comprehensive documentation
```

### Data Management Architecture

#### Route Assignment Tracking
- **Node.js Backend**: An Express.js server handles all data persistence.
- **`RouteTracker` Class**: A client-side class that communicates with the backend API to manage assignments.
- **Persistent Storage**: Route assignments are stored in `database.json` on the server, ensuring data is shared across all users and sessions.
- **Assignment Prevention**: The backend logic prevents routes assigned to one user from being available to others.
- **User Identification**: Tracks assignments by Last Name + Unit combination.
- **Assignment Removal**: Users can remove their own assignments, which sends a request to the server to make the route available again.

#### Data Structure
Routes are structured as:
```javascript
{
    routeId: "1-1",                    // Unique identifier (region-number)
    name: "WASHINGTON ST.",            // Route designation
    flyerCount: 200,                   // Number of flyers to distribute
    description: "Street descriptions..." // Detailed route coverage
}
```

Assignments track:
```javascript
{
    lastName: "Smith",                 // User's last name
    unit: "Troop 40",                 // Scout unit
    timestamp: "2025-01-15T10:30:00.000Z" // Assignment date/time
}
```

### State Management & Flow Control

#### Authentication Flow
1. **Entry Point**: `index.html` routes users based on authentication status stored in `sessionStorage`.
2. **Login Required**: Unauthenticated users are directed to `login.html`.
3. **Role-Based Routing**:
   - Regular users: Login → User Info → Route Selection
   - Admin users: Login → Admin Dashboard

#### Assignment Flow (Regular Users)
1. **User Information**: Collect Last Name and Unit (`user-info.html`), stored in `sessionStorage`.
2. **Home Page**: Display existing assignments (fetched from the server) or region selection (`home.html`).
3. **Route Selection**: Choose available routes by region (`routes.html`).
4. **Confirmation**: Review and confirm selections (`confirm-routes.html`).
5. **Completion**: Final assignment details with print option (`details.html`).

#### Session & Storage Management
- **`sessionStorage`**: Used for user authentication status and user information for the current session.
- **`database.json`**: A file on the server that provides persistent storage for all route assignments.

### Security & Data Integrity

#### Access Control
- **Hardcoded Credentials**: Suitable for small organizational use with known users.
- **Session-Based Security**: Authentication status is tracked per browser session.
- **Role Separation**: Complete separation between volunteer and admin interfaces.

#### Data Persistence
- **Server-Side Storage**: All route assignment data is stored on the server in `database.json`.
- **API Endpoints**: The server provides API endpoints to ensure controlled access and modification of the data.
- **Assignment Integrity**: The backend logic prevents double-booking of routes.
- **Data Recovery**: The admin interface allows for the correction of assignment errors.
- **Export Capability**: Complete data export for backup and external use.

## Installation & Setup

### Requirements
- **Node.js**: Required to run the server.
- **Modern Web Browser**: Chrome, Firefox, Safari, Edge, etc.

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to the project directory:**
   ```bash
   cd sff-tracker
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application
1. **Start the server:**
   ```bash
   npm start
   ```
2. **Access the application:**
   Open your web browser and navigate to `http://localhost:3000`.

### Drive Phase Management
The application supports two operational modes:

**Active Drive Mode** (during the drive):
- Entry point: `index.html`
- Provides full authentication and route assignment functionality
- Users can select routes, view assignments, and print route details

**Thank You Mode** (between drives):
- Entry point: `index_thankyou.html`
- Displays gratitude message to Scouts and donors
- Shows drive results with no login required:
  - Total Routes Completed
  - Total Flyers Distributed
  - Participating Units
  - Coverage Achieved (percentage)
- Reads from same localStorage data as active mode

**Switching Between Modes**:
1. When drive concludes: Rename `index.html` → `index_active.html`, then `index_thankyou.html` → `index.html`
2. When new drive starts: Rename `index.html` → `index_thankyou.html`, then `index_active.html` → `index.html`

## Usage Instructions

### For Volunteers
1. **Access**: Open `index.html` in web browser
2. **Login**: Contact Organization Leadership
3. **Registration**: Provide Last Name and select Unit
4. **Route Selection**: 
   - Choose region from dropdown
   - Select desired routes (only available routes shown)
   - Confirm selection on confirmation page
5. **Assignment Management**:
   - View existing assignments on return visits
   - Remove unwanted route assignments (returns routes to available status)
   - Select additional routes from different regions
   - Print route assignments with QR codes for mobile navigation and important dates

### For Administrators
1. **Access**: Open `index.html` in web browser
2. **Login**: Contact Organization Leadership
3. **Dashboard Overview**:
   - Monitor assignment statistics
   - View all routes and their assignment status
   - Filter and search assignments
4. **Assignment Management**:
   - Reset individual route assignments
   - Clear all assignments if needed
   - Export complete assignment data to CSV
5. **Data Management**:
   - Monitor flyer distribution coverage
   - Track unit participation
   - Generate reports for coordination

## Data Source & Coverage

### Route Information
- **Source Data**: Static route data in `data.js` (originally derived from CSV data)
- **Total Routes**: 149 routes across Taunton
- **Geographic Coverage**: 6 distinct regions covering all of Taunton
- **Route Details**: Street-by-street descriptions for each route
- **Flyer Distribution**: Specific flyer counts for each route

### Regional Organization
- **CENTER**: 28 routes (Routes 1-1 through 1-28)
- **WEIR**: 23 routes (Routes 2-1 through 2-23)
- **OAKLAND**: 35 routes (Routes 3-1 through 3-35)
- **WHITTENTON**: 22 routes (Routes 4-1 through 4-22)
- **EAST TAUNTON**: 21 routes (Routes 5-1 through 5-21)
- **WESTVILLE**: 20 routes (Routes 6-1 through 6-20)

## Technical Specifications

### Frontend Technologies
- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Modern dark theme with responsive design using Flexbox/Grid
- **Vanilla JavaScript**: ES6+ features, modular design
- **External Dependencies**: QRCode.js library for client-side QR generation, TinyURL API for URL shortening
- **Local Storage APIs**: For persistent route assignment tracking
- **Print Optimization**: Dedicated print styles with QR codes for route navigation

### Performance Optimizations
- **Lightweight**: No external libraries or frameworks
- **Fast Loading**: Minimal HTTP requests, optimized asset delivery
- **Efficient Rendering**: DOM manipulation only when necessary
- **Memory Management**: Proper cleanup of event listeners and resources

### Browser Compatibility
- **Desktop**: Full support for Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: Responsive design supports iOS Safari, Chrome Mobile
- **Required APIs**: ES6, localStorage, sessionStorage, CSS Grid/Flexbox

## Development & Customization

### Common Modifications
- **Route Data Updates**: Edit `routeData` object in `data.js`
- **Authentication Changes**: Modify credentials in `auth.js`
- **Styling Customization**: Update dark theme colors and layouts in `styles.css`
- **Feature Extensions**: Add new functionality through modular JavaScript architecture

### Key Development Patterns
- **Separation of Concerns**: Clear separation between data, presentation, and logic
- **Progressive Enhancement**: Basic HTML functionality enhanced with JavaScript
- **Event-Driven Architecture**: Event listeners handle all user interactions
- **Modular Design**: Each page has dedicated JavaScript modules
- **State Persistence**: Consistent use of browser storage for state management

## Support & Maintenance

### Error Handling
- **User-Friendly Messages**: Clear error messages for all failure scenarios
- **Input Validation**: Comprehensive validation with immediate feedback
- **Graceful Degradation**: Application continues to function with JavaScript errors
- **Recovery Options**: Admin tools for correcting assignment errors

### Data Backup & Recovery
- **CSV Export**: Complete assignment data export for backup
- **Assignment Reset**: Individual and bulk reset capabilities
- **Session Recovery**: User state maintained across browser sessions
- **Data Integrity**: Automatic validation of assignment data

## License & Usage

This project is designed specifically for the Taunton Scouting for Food Drive volunteer organization. Usage should align with the organization's community service mission and Scout values. The system is provided as-is for volunteer coordination and should not be used for commercial purposes.
