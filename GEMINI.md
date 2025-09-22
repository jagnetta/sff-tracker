# GEMINI Project Context

## Project Overview

This project is a web application designed to manage and track route assignments for the "Scouting for Food" drive. It consists of a Node.js backend and a vanilla JavaScript frontend.

The backend is a simple Express.js server that performs two main functions:
1.  Serves the static HTML, CSS, and JavaScript files for the frontend application.
2.  Provides a RESTful API for managing route assignments, which are stored in a persistent `database.json` file.

The frontend is a multi-page application that allows users to authenticate, view available routes, select and assign routes to themselves, and view their assigned routes. There is also an admin dashboard for managing all route assignments.

## Building and Running

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Server:**
    ```bash
    npm start
    ```
    This will start the web server on `http://localhost:3000`.

## Development Conventions

*   **Backend:** The backend is a minimal Express server. All API logic is contained within `server.js`. The API interacts with a simple JSON file (`database.json`) that acts as the database.

*   **Frontend:** The frontend is built with vanilla JavaScript. Each HTML page has a corresponding JavaScript file that contains the logic for that page.

*   **`route-tracker.js`:** This is the core module on the client-side for managing route assignments. It communicates with the backend API to fetch, create, and delete route assignments.

*   **`data.js`:** This file contains the static data for all the available routes, organized by region.

*   **Authentication:** User authentication is handled on the client-side in `auth.js`. It uses `sessionStorage` to store the authentication status and user information. There are two hardcoded user roles: a regular user and an admin.

*   **API Endpoints:**
    *   `GET /api/assignments`: Retrieves all route assignments.
    *   `POST /api/assignments`: Adds new route assignments.
    *   `DELETE /api/assignments/:id`: Deletes a specific route assignment.
    *   `POST /api/assignments/clear`: Clears all route assignments.
