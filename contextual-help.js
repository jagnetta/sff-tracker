// Contextual Help System
class ContextualHelp {
    constructor() {
        this.helpContent = {
            'login.html': {
                title: 'Login Help',
                content: `
                    <h3>Step 1: Login</h3>
                    <div class="credentials-box">
                        <h4>Before You Start</h4>
                        <p>You need to know:</p>
                        <ul>
                            <li>Username: <strong>Contact Your Unit Leader</strong></li>
                            <li>Password: <strong>Contact Your Unit Leader</strong></li>
                        </ul>
                    </div>
                    <ol>
                        <li>Open the website</li>
                        <li>Type <strong>The Username that was Provided</strong> for username</li>
                        <li>Type <strong>The Password that was Provided</strong> for password</li>
                        <li>Click "Login"</li>
                    </ol>
                `
            },
            'user-info.html': {
                title: 'User Information Help',
                content: `
                    <h3>Step 2: Tell Us About You</h3>
                    <ol>
                        <li>Type your last name</li>
                        <li>Pick your scout unit from the list</li>
                        <li>Click "Continue to Route Selection"</li>
                    </ol>
                    <p>Make sure to enter your information correctly as it will be used to track your route assignments.</p>
                `
            },
            'home.html': {
                title: 'Region Selection Help',
                content: `
                    <h3>Step 3: Pick Your Area</h3>
                    <ol>
                        <li>Look at the 6 areas:
                            <ul>
                                <li>Center</li>
                                <li>East Taunton</li>
                                <li>Oakland</li>
                                <li>Weir</li>
                                <li>Westville</li>
                                <li>Whittenton</li>
                            </ul>
                        </li>
                        <li>Pick the area closest to your home</li>
                        <li>Click "View Routes"</li>
                    </ol>
                    
                    <h4>If You Already Have Routes</h4>
                    <ul>
                        <li>Your current assignments will show at the top</li>
                        <li>Click "Print My Routes" to print them with QR codes for easy navigation</li>
                        <li>Use your phone's camera to scan QR codes for instant Google Maps directions</li>
                        <li>Click "Select Additional Routes" to add more routes</li>
                        <li>Click the red "Remove" button to remove routes you don't want</li>
                    </ul>
                `
            },
            'routes.html': {
                title: 'Route Selection Help',
                content: `
                    <h3>Step 4: Choose Your Routes</h3>
                    <ol>
                        <li>You will see a list of streets in your area</li>
                        <li>Each route shows:
                            <ul>
                                <li>The street name</li>
                                <li>How many door hangers you need</li>
                                <li>Which houses to visit</li>
                            </ul>
                        </li>
                        <li>Check the box next to routes you want</li>
                        <li>You can pick more than one route</li>
                        <li>Click "Confirm Selected Routes"</li>
                    </ol>

                    <h4>Understanding Route Information</h4>
                    <ul>
                        <li><strong>"All"</strong> means both sides of the street</li>
                        <li>Pay attention to house numbers (like "odd numbers only")</li>
                        <li>Some routes say "from Main St to Oak St" - this tells you where to start and stop</li>
                        <li>Follow the directions exactly so you don't miss houses</li>
                    </ul>

                    <h4>Special Features</h4>
                    <ul>
                        <li>Click the 🗺️ button next to each route to view it on Google Maps</li>
                        <li>Use Google Maps to see where you need to go</li>
                    </ul>

                    <div class="tips-box">
                        <h4>Tips for Choosing Routes</h4>
                        <ul>
                            <li>Pick routes near your house so it's easier to get there</li>
                            <li>Don't pick too many routes if you're new to this</li>
                            <li>More door hangers = more time needed</li>
                        </ul>
                    </div>
                `
            },
            'confirm-routes.html': {
                title: 'Confirmation Help',
                content: `
                    <h3>Step 5: Check Your Choice</h3>
                    <ol>
                        <li>Look at your chosen routes</li>
                        <li>Make sure everything looks right</li>
                        <li>If you want to change something, click "Back"</li>
                        <li>If everything is good, click "Confirm Assignment"</li>
                    </ol>
                    <p>Double-check that you've selected the routes you want and that you understand the street descriptions.</p>
                `
            },
            'details.html': {
                title: 'Route Details Help',
                content: `
                    <h3>Step 6: Print Your Routes</h3>
                    <ol>
                        <li>Your routes will show on the screen</li>
                        <li>Click "Print Details" to print them with QR codes</li>
                        <li>The print page will automatically open with a QR code for each route</li>
                        <li>The print dialog will open automatically</li>
                        <li>Keep this paper with you when doing the food drive</li>
                    </ol>

                    <h4>Using QR Codes for Navigation</h4>
                    <ul>
                        <li>Each printed route includes a QR code (square barcode)</li>
                        <li>Use your phone's camera to scan the QR code</li>
                        <li>This opens Google Maps with turn-by-turn directions for your route</li>
                        <li>Works with iPhone Camera app, Android Camera app, or any QR scanner</li>
                        <li>Perfect for getting to your streets quickly and efficiently</li>
                    </ul>

                    <div class="important-dates">
                        <h3>Important Dates to Remember</h3>
                        <ul>
                            <li><strong>Put door hangers on houses:</strong> Oct. 25-26th from 9 AM to 3 PM</li>
                            <li><strong>Pick up food bags:</strong> Saturday, November 1st from 9 AM to 1 PM</li>
                            <li><strong>Bring food to:</strong> The Matthew Mission Food Pantry at 76 Church Green, Taunton, MA 02780</li>
                        </ul>
                    </div>

                    <h4>What Happens Next</h4>
                    <ol>
                        <li>Get your door hangars from your Unit Leaders</li>
                        <li>On October 25th or 26th, put door hangers on doors</li>
                        <li>On November 1st, go back to the same houses</li>
                        <li>Pick up the food bags people left out</li>
                        <li>Take all the food to 76 Church Green, Taunton</li>
                    </ol>
                `
            },
            'admin-dashboard.html': {
                title: 'Admin Dashboard Help',
                content: `
                    <h3>Admin Dashboard Overview</h3>
                    <p>As an admin, you can:</p>
                    <ul>
                        <li><strong>View Statistics:</strong> See how many routes are assigned vs available</li>
                        <li><strong>Export Data:</strong> Download CSV file of all assignments</li>
                        <li><strong>Reset Routes:</strong> Clear individual route assignments or all assignments</li>
                        <li><strong>Monitor Progress:</strong> Track which units have signed up for routes</li>
                    </ul>

                    <h4>Export Functions</h4>
                    <ul>
                        <li>Click "Export Assignments (CSV)" to download all current assignments</li>
                        <li>The CSV file can be opened in Excel for further analysis</li>
                    </ul>

                    <h4>Reset Functions</h4>
                    <ul>
                        <li>Use "Clear All Assignments" to reset the entire system</li>
                        <li>Individual routes can be reset from the route details</li>
                        <li><strong>Warning:</strong> Reset actions cannot be undone</li>
                    </ul>
                `
            }
        };
        this.createModal();
    }

    createModal() {
        // Create modal HTML
        const modalHTML = `
            <div id="helpModal" class="help-modal" style="display: none;">
                <div class="help-modal-content">
                    <div class="help-modal-header">
                        <h2 id="helpModalTitle">Help</h2>
                        <button class="help-modal-close" onclick="contextualHelp.closeModal()">&times;</button>
                    </div>
                    <div class="help-modal-body" id="helpModalBody">
                        <!-- Help content will be inserted here -->
                    </div>
                    <div class="help-modal-footer">
                        <button onclick="contextualHelp.openFullGuide()" class="btn-secondary">View Complete Guide</button>
                        <button onclick="contextualHelp.closeModal()" class="btn-primary">Got It!</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to document
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .help-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .help-modal-content {
                background: #2d2d2d;
                border-radius: 10px;
                width: 90%;
                max-width: 700px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }

            .help-modal-header {
                padding: 20px 30px 10px;
                border-bottom: 2px solid #555;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .help-modal-header h2 {
                margin: 0;
                color: #4a9eff;
                font-size: 1.8em;
            }

            .help-modal-close {
                background: none;
                border: none;
                font-size: 30px;
                color: #999;
                cursor: pointer;
                padding: 0;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }

            .help-modal-close:hover {
                background-color: #555;
                color: #fff;
            }

            .help-modal-body {
                padding: 20px 30px;
                color: #e0e0e0;
            }

            .help-modal-body h3 {
                color: #4a9eff;
                margin: 20px 0 15px 0;
                font-size: 1.4em;
            }

            .help-modal-body h4 {
                color: #b0b0b0;
                margin: 15px 0 10px 0;
                font-size: 1.2em;
            }

            .help-modal-body ul, .help-modal-body ol {
                margin: 15px 0;
                padding-left: 25px;
            }

            .help-modal-body li {
                margin-bottom: 8px;
            }

            .help-modal-body p {
                margin-bottom: 15px;
            }

            .help-modal-body strong {
                color: #4a9eff;
            }

            .help-modal-body .credentials-box,
            .help-modal-body .important-dates,
            .help-modal-body .tips-box {
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
            }

            .help-modal-body .credentials-box {
                background: #4a3a3a;
                border-left: 4px solid #ffc107;
            }

            .help-modal-body .important-dates {
                background: #3a4a3a;
                border-left: 4px solid #28a745;
            }

            .help-modal-body .tips-box {
                background: #3a3a4a;
                border-left: 4px solid #17a2b8;
            }

            .help-modal-footer {
                padding: 15px 30px 25px;
                display: flex;
                gap: 15px;
                justify-content: flex-end;
                border-top: 1px solid #555;
            }

            @media (max-width: 768px) {
                .help-modal-content {
                    width: 95%;
                    margin: 20px;
                }

                .help-modal-header,
                .help-modal-body,
                .help-modal-footer {
                    padding-left: 20px;
                    padding-right: 20px;
                }

                .help-modal-footer {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    showHelp(pageName = null) {
        // Get current page name if not provided
        if (!pageName) {
            pageName = window.location.pathname.split('/').pop();
        }

        const helpData = this.helpContent[pageName];
        
        if (helpData) {
            document.getElementById('helpModalTitle').textContent = helpData.title;
            document.getElementById('helpModalBody').innerHTML = helpData.content;
        } else {
            // Fallback for pages without specific help content
            document.getElementById('helpModalTitle').textContent = 'Help';
            document.getElementById('helpModalBody').innerHTML = `
                <p>No specific help available for this page.</p>
                <p>Click "View Complete Guide" below to see the full user guide.</p>
            `;
        }

        document.getElementById('helpModal').style.display = 'flex';
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('helpModal').style.display = 'none';
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    }

    openFullGuide() {
        this.closeModal();
        window.open('user-guide.html', '_blank');
    }

    // Event handler for help buttons
    handleHelpClick(event) {
        event.preventDefault();
        this.showHelp();
    }
}

// Initialize contextual help when page loads
let contextualHelp;
document.addEventListener('DOMContentLoaded', function() {
    contextualHelp = new ContextualHelp();
    
    // Find all help buttons and update their behavior
    const helpButtons = document.querySelectorAll('.btn-help, a[href="user-guide.html"]');
    helpButtons.forEach(button => {
        // Only update if it's currently linking to user-guide.html
        if (button.getAttribute('href') === 'user-guide.html') {
            button.removeAttribute('href');
            button.style.cursor = 'pointer';
            button.addEventListener('click', (e) => contextualHelp.handleHelpClick(e));
        }
    });
});

// Close modal when clicking outside of it
document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'helpModal') {
        if (contextualHelp) {
            contextualHelp.closeModal();
        }
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && document.getElementById('helpModal').style.display === 'flex') {
        if (contextualHelp) {
            contextualHelp.closeModal();
        }
    }
});