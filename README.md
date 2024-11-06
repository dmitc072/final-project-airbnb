npm install
npm install @toolpad/core  # Required for Navbar functionality
Netlify is used to deploy the app.
"_redirects" file was added in the public folder to allow the routes to function correctly


Features
Dashboard Creation - Set up the initial dashboard for user navigation and management.
Profile Creation - Enable users to create and manage their profiles.
Advertise Property - Add properties for listing and rental.
Listing Properties - List available properties for easy viewing and filtering.
Property Search - Created a search functionality to find listed properties.
Messaging - Allow hosts and guests to communicate.
Modals for Search & Rental Requests - Implemented a modal component to handle search results and rental requests.
Pending Approval - Added a section for hosts to manage rental requests that require approval.
Host Alerts for Approvals - Notify hosts when they receive new rental approval requests.
Redux Sign-Out Update - Reset pendingApprovalMessage to its initial value on sign-out.
Approval Management - Updated PendingApprovalHost.js to allow hosts to approve or disapprove rental requests.
Dynamic Pricing - Added price change capability in Properties.js, stored in Firebase.
Price Change Notification - Created a notice to inform guests of price changes, with a Redux-triggered boolean to display it on login.
Date Conversion Utility - Created a functions folder to manage date conversions.
Rating Modal - Added RatingModal.js component to connect with ApprovedforRenter, allowing renters to leave ratings.
Dark & Light Mode Theme Toggle - Implemented a useEffect to handle theme changes, supporting dark and light modes.
Requesting to Rent
Search for Property - Use the search feature to find properties.
Submit Rental Request - Submit desired dates and request to rent.
Message Host - Direct message goes to the host once a rental request is submitted.