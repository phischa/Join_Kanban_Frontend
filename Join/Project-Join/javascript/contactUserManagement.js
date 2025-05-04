/**
 * Contact User Management
 * Handles user authentication, contact permissions and initialization
 * for the contact management system
 */

// ==========================================================
// AUTHENTICATION & PERMISSION FUNCTIONS
// ==========================================================

/**
 * Checks if the user is authenticated before loading contacts
 * Redirects to login page if not authenticated
 */
function checkContactAuthentication() {
    if (!isAuthenticated() && !isGuestMode()) {
        redirectToLogin();
        return false;
    }
    return true;
}

/**
 * Redirects the user to the login page
 */
function redirectToLogin() {
    window.location.href = 'start.html';
}

/**
 * Checks authentication status before contact operations
 */
function checkUserBeforeContactOperation() {
    if (!isAuthenticated() && !isGuestMode()) {
        console.warn("User not authenticated for contact operation");
        
        // Option 1: Redirect to login page
        redirectToLogin();
        
        // Option 2: Activate local mode
        //activateGuestModeWithWarning();
        
        return false;
    }
    return true;
}

/**
 * Activates guest mode with warning
 */
function activateGuestModeWithWarning() {
    console.warn("Activating guest mode for contacts. Changes won't be saved to server.");
    if (localStorage.getItem('guestMode') !== 'true') {
        localStorage.setItem('guestMode', 'true');
        alert("You are not logged in. Changes will only be saved locally.");
    }
}

// ==========================================================
// USER CONTACT LOADING FUNCTIONS
// ==========================================================

/**
 * Loads the contacts of the current user
 * Also considers guest mode if active
 * @returns {Promise<Array>} - Array of contacts or empty array
 */
async function loadUserContacts() {
    if (!checkContactAuthentication()) {
        return [];
    }
    try {
        if (isGuestMode()) {
            return loadGuestContacts();
        } else {
            return await loadAuthenticatedContacts();
        }
    } catch (error) {
        handleContactLoadError(error);
        return [];
    }
}

/**
 * Loads contacts for authenticated users from the server
 */
async function loadAuthenticatedContacts() {
    try {
        const response = await fetchFromApi('contacts');
        if (Array.isArray(response)) {
            return response;
        } else {
            console.error("Invalid contacts data:", response);
            return loadContactsFromLocalStorage();
        }
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return loadContactsFromLocalStorage();
    }
}

/**
 * Loads contacts in guest mode
 */
function loadGuestContacts() {
    return loadContactsFromLocalStorage();
}

/**
 * Handles errors when loading contacts
 */
function handleContactLoadError(error) {
    showContactLoadErrorNotification();
}

/**
 * Shows a notification about an error loading contacts
 */
function showContactLoadErrorNotification() {
    // This function could be extended to show a visual notification to the user
    console.warn("Could not load contacts. Showing cached data if available.");
}

// ==========================================================
// CONTACT SAVE & DELETE FUNCTIONS
// ==========================================================

/**
 * Saves a contact and connects it to the current user
 * @param {Object} contact - The contact to save
 * @returns {Promise<Object>} - Response from the server
 */
async function saveUserContact(contact) {
    if (!checkContactAuthentication()) {
        return { status: "error", message: "Not authenticated" };
    }
    
    try {
        return await saveAuthenticatedContact(contact);
    } catch (error) {
        console.error("Error saving contact:", error);
        return { status: "error", message: error.message };
    }
}

/**
 * Saves a contact for an authenticated user
 */
async function saveAuthenticatedContact(contact) {
    return await storeContact(contact);
}

/**
 * Simulates saving a contact in guest mode
 */
function simulateGuestContactSave(contact) {
    const tempId = createID();
    contact.contactID = tempId;
    
    // Local storage
    const localContacts = getFromLocalStorage('contacts') || [];
    localContacts.push(contact);
    saveToLocalStorage('contacts', localContacts);
    
    return {
        status: "success",
        contactID: tempId,
        message: "Contact saved in guest mode"
    };
}

/**
 * Deletes a contact of the current user
 * @param {string|number} contactID - ID of the contact to delete
 * @returns {Promise<Object>} - Response from the server
 */
async function deleteUserContact(contactID) {
    if (!checkContactAuthentication()) {
        return { status: "error", message: "Not authenticated" };
    }
    
    try {
        return await deleteAuthenticatedContact(contactID);
    } catch (error) {
        console.error("Error deleting contact:", error);
        return { status: "error", message: error.message };
    }
}

/**
 * Deletes a contact of an authenticated user
 */
async function deleteAuthenticatedContact(contactID) {
    return await deleteContactItem(contactID);
}

/**
 * Deletes a contact in guest mode (local only)
 */
function deleteGuestContact(contactID) {
    let localContacts = getFromLocalStorage('contacts') || [];
    const initialLength = localContacts.length;
    
    localContacts = localContacts.filter(c => c.contactID != contactID);
    saveToLocalStorage('contacts', localContacts);
    
    return {
        status: "success",
        message: initialLength !== localContacts.length ? 
            "Contact deleted in guest mode" : 
            "Contact not found in guest mode"
    };
}

// ==========================================================
// INITIALIZATION FUNCTIONS
// ==========================================================

/**
 * Initializes the contact management
 * Loads only contacts of the current user
 */
async function initializeContacts() {
    try {
        await setupContactsEnvironment();
        await validateUserSession();
    } catch (error) {
        handleContactInitError(error);
    }
}

/**
 * Sets up the environment for contact management
 */
async function setupContactsEnvironment() {
    if (isPublicPage()) {
        return;
    }
    
    // Check if the user is authorized
    const isAuthorized = isAuthenticatedOrGuest();
    
    if (!isAuthorized) {
        redirectToLogin();
        throw new Error("User not authorized");
    }
    
    // Preparation of the contact environment
    resetContactState();
    setContactsLoadingState(true);
}

/**
 * Checks the user session
 */
async function validateUserSession() {
    if (isPublicPage()) {
        return;
    }
    
    try {
        // Load contacts of the user
        await loadUserContactsOnInit();
        setContactsLoadingState(false);
    } catch (error) {
        console.error("Error loading user contacts:", error);
        showContactLoadError();
        setContactsLoadingState(false);
    }
}

/**
 * Resets the state of the contact management
 */
function resetContactState() {
    contacts = [];
    sortedContactsByName = [];
}

/**
 * Sets the loading state for contacts
 */
function setContactsLoadingState(isLoading) {
    // Optional: Show/hide UI element for loading state
    const loadingIndicator = document.getElementById('contacts-loading-indicator');
    
    if (loadingIndicator) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
}

/**
 * Shows an error when loading contacts
 */
function showContactLoadError() {
    console.error("Could not load contacts. Check your connection.");
}

/**
 * Handles errors during contact initialization
 */
function handleContactInitError(error) {
    console.error("Contact initialization error:", error);
    if (!isPublicPage()) {
        try {
            loadFromLocalStorage('contacts', contacts);
        } catch (fallbackError) {
            console.error("Even local storage fallback failed:", fallbackError);
        }
    }
}

// ==========================================================
// EVENT LISTENERS
// ==========================================================

/**
 * Add event listener for DOMContentLoaded
 * Only initialize contacts if we're on the contacts page
 */
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('contactsPage.html')) {
        if (contacts && contacts.length > 0) {
            return;
        }
        initializeContacts().then(() => {
        });
    }
});