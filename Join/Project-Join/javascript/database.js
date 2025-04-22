/**
 * Database Module
 * Handles data operations and state management for the application
 */

// Global state
let tasks = [];
let contacts = [];
let users = [];
let subtasksOfActualTask = [];

// Current items being edited
let currentTaskId = null;
let actualTask = null;
let actualContact = null;
let actualUser = "Standarduser";
let actualSubtask = null;

/**
 * List of publicly accessible pages (without authentication)
 */
const PUBLIC_PAGES = [
    'signUp.html',
    'start.html',
    'index.html',
    'privacyRestricted.html',
    'legalRestricted.html'
];

/**
 * Checks whether the current page is publicly accessible
 * @returns {boolean} True if the page is public
 */
function isPublicPage() {
    const currentPath = window.location.pathname;
    const isPublic = PUBLIC_PAGES.some(page => currentPath.includes(page));
    return isPublic;
}

/**
 * Backwards compatibility for old isAuthPage function
 * @returns {boolean} True if current page is login or signup
 */
function isAuthPage() {
    return isPublicPage();
}

/**
 * Checks whether a user is authenticated or in guest mode
 * @returns {boolean} True if the user is logged in or in guest mode
 */
function isAuthenticatedOrGuest() {
    const hasToken = isAuthenticated();
    const isGuest = localStorage.getItem('guestMode') === 'true';
    
    return hasToken || isGuest;
}

/**
 * Generates a unique ID for local use
 * @returns {string} Unique ID
 */
function createID() {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstvxyz";
    let id = "";
    
    for (let i = 0; i < 16; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}

/**
 * This function logs in a guest user. 
 */
function guestLogin() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.setItem('guestMode', 'true');
    
    const guestUser = {
        name: "Guest User", 
        email: "guest@example.com"
    };
    saveToLocalStorage('actualUser', guestUser);
    window.location.href = 'summary.html';
}

/**
 * Logs out the current user
 */
function logout() {
    localStorage.setItem('rememberMe', '');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
    localStorage.removeItem('guestMode'); // Wichtig: Auch den Gast-Modus entfernen
    deleteActualUser();
    window.location.href = "./start.html";
}

/**
 * Initializes the application
 * @returns {Promise<void>}
 */
async function initApp() {
    try {
        if (isPublicPage()) {
            return;
        }
        if (!isAuthenticatedOrGuest()) {
            window.location.href = 'start.html';
            return;
        }
        const isContactPage = window.location.pathname.includes('contactsPage.html');
        if (!isContactPage) {
            await loadUserContactsIfAvailable();
        }
        await Promise.all([
            loadTasks(),
            loadUsers(),
            loadActualUser(),
            loadRememberMe()
        ]);
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

/**
 * Loads user contacts if the new function is available,
 * otherwise falls back to the old method
 */
async function loadUserContactsIfAvailable() {
    if (typeof loadUserContacts === 'function') {
        try {
            const userContacts = await loadUserContacts();
            if (Array.isArray(userContacts)) {
                contacts = userContacts.map(contact => ({
                    ...contact,
                    contactID: contact.contactID || contact.id
                }));
            } else {
                console.error("Invalid contacts data from loadUserContacts");
                loadFromLocalStorage('contacts', contacts);
            }
        } catch (error) {
            console.error("Error using loadUserContacts:", error);
            loadFromLocalStorage('contacts', contacts);
        }
    } else {
        await loadContacts();
    }
}

/**
 * Loads all contacts from the backend (old approach)
 * This function remains as a reference but should no longer be used.
 * Instead use loadUserContactsOnInit() in contactsPageOne.js.
 * @returns {Promise<void>}
 * @deprecated
 */
async function loadContacts() {
    try {
        const loadedContacts = await loadAllContacts();

        if (Array.isArray(loadedContacts)) {
            contacts = loadedContacts.map(contact => ({
                ...contact,
                contactID: contact.contactID || contact.id
            }));
        } else {
            console.error("Invalid contacts data:", loadedContacts);
            loadFromLocalStorage('contacts', contacts);
        }
    } catch (error) {
        console.error("Failed to load contacts:", error);
        loadFromLocalStorage('contacts', contacts);
    }
}

/**
 * Loads all tasks from the backend
 * @returns {Promise<void>}
 */
async function loadTasks() {
    try {
        const loadedTasks = await loadAllTasks();
        if (Array.isArray(loadedTasks)) {
            tasks = loadedTasks;
        } else {
            console.error("Invalid tasks data:", loadedTasks);
            if (isGuestMode()) {
                loadFromLocalStorage('tasks', tasks);
            } else {
                tasks = [];
            }
        }
    } catch (error) {
        console.error("Failed to load tasks:", error);
        loadFromLocalStorage('tasks', tasks);
    }
}

/**
 * Loads all users from the backend
 * @returns {Promise<void>}
 */
async function loadUsers() {
    try {
        const loadedUsers = await loadAllUsers();

        if (Array.isArray(loadedUsers)) {
            users = loadedUsers;
        } else {
            console.error("Invalid users data:", loadedUsers);
            loadFromLocalStorage('users', users);
        }
    } catch (error) {
        console.error("Failed to load users:", error);
        loadFromLocalStorage('users', users);
    }
}

/**
 * Loads data from localStorage
 * @param {String} key - Storage key
 * @param {Array} targetArray - Array to populate
 */
function loadFromLocalStorage(key, targetArray) {
    const data = localStorage.getItem(key);

    if (data) {
        const parsedData = JSON.parse(data);
        targetArray.length = 0;
        targetArray.push(...parsedData);
    }
}

// Initialize the application when the page loads
window.addEventListener('DOMContentLoaded', initApp);