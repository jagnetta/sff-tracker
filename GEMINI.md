# GEMINI.md

## Project Overview

This project is a web-based application designed to manage the Taunton Scouting for Food Drive. It provides a user-friendly interface for volunteers to select and manage their food drive routes, and a comprehensive dashboard for administrators to monitor and manage the entire event.

The application is built using vanilla HTML, CSS, and JavaScript, with no external frameworks. It runs entirely on the client-side, using the browser's `localStorage` and `sessionStorage` to persist data. This makes the application lightweight, easy to deploy, and requires no server-side backend.

**Key Features:**

*   **Dual Authentication:** Separate login for volunteers and administrators.
*   **Route Selection:** Volunteers can view and select available routes from different regions.
*   **Assignment Management:** Volunteers can view their assigned routes, print them, and remove them if necessary.
*   **Admin Dashboard:** Administrators have a real-time overview of all routes, their assignment status, and can manage assignments.
*   **Data Export:** Administrators can export all assignment data to a CSV file.
*   **Client-Side Data:** All route and assignment data is stored in the browser, making the application self-contained.

## Building and Running

This is a client-side application and does not require a build process.

To run the application:

1.  Clone or download the repository.
2.  Open the `index.html` file in a modern web browser.

**Credentials:**

*   **Volunteer:**
    *   Username: `liberty`
    *   Password: `union`
*   **Administrator:**
    *   Username: `baden`
    *   Password: `powell`

## Development Conventions

*   **File Structure:** The project follows a clear and modular file structure, with separate HTML, CSS, and JavaScript files for each major feature.
*   **JavaScript:** The project uses vanilla JavaScript (ES6+). The code is organized into modules, with each module responsible for a specific part of the application's functionality.
*   **Data Management:**
    *   `sessionStorage` is used to manage user authentication and session data.
    *   `localStorage` is used to persist route assignments across sessions.
    *   The `routeTracker.js` file encapsulates all the logic for managing route assignments.
*   **Styling:** The application uses a single `styles.css` file for all its styling, which implements a dark theme.
*   **No Dependencies:** The project has no external dependencies, except for the `qrcode.js` library which is included in the `print-routes.html` file for generating QR codes.
