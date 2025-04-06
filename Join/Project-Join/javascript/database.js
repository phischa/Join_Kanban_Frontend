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
 * Liste der öffentlich zugänglichen Seiten (ohne Authentifizierung)
 */
const PUBLIC_PAGES = [
    'start.html',
    'signUp.html',
    'index.html',
    'privacyRestricted.html',
    'legalRestricted.html'
];

/**
 * Überprüft, ob die aktuelle Seite öffentlich zugänglich ist
 * @returns {boolean} True wenn die Seite öffentlich ist
 */
function isPublicPage() {
    const currentPath = window.location.pathname;
    return PUBLIC_PAGES.some(page => currentPath.includes(page));
}

/**
 * Backwards compatibility for old isAuthPage function
 * @returns {boolean} True if current page is login or signup
 */
function isAuthPage() {
    return isPublicPage();
}

/**
 * Überprüft, ob ein Benutzer authentifiziert oder im Gast-Modus ist
 * @returns {boolean} True, wenn der Benutzer eingeloggt oder im Gast-Modus ist
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
    console.log("Logging in as guest user");
    
    // Authentifizierungsdaten löschen
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    
    // Gast-Modus aktivieren
    localStorage.setItem('guestMode', 'true');
    
    // Basis-Benutzerdaten für den Gast speichern
    const guestUser = {
        name: "Guest User", 
        email: "guest@example.com"
    };
    saveToLocalStorage('actualUser', guestUser);
    
    console.log("Guest mode activated, redirecting to summary");
    
    // Zur Summary-Seite weiterleiten
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
        // Auf öffentlichen Seiten keine Authentifizierung prüfen
        if (isPublicPage()) {
            return;
        }
        // Authentifizierung oder Gast-Modus prüfen
        if (!isAuthenticatedOrGuest()) {
            window.location.href = 'start.html';
            return;
        }
        
        // Vollständige Initialisierung für authentifizierte oder Gast-Seiten
        await Promise.all([
            loadContacts(),
            loadTasks(),
            loadUsers(),
            loadActualUser(),
            loadRememberMe()
        ]);
        
        console.log("Application fully initialized");
    } catch (error) {
        console.error("Error initializing app:", error);
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
            loadFromLocalStorage('tasks', tasks);
        }
    } catch (error) {
        console.error("Failed to load tasks:", error);
        loadFromLocalStorage('tasks', tasks);
    }
}

/**
 * Loads all contacts from the backend
 * @returns {Promise<void>}
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