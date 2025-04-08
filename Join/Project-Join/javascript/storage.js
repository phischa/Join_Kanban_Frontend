/**
 * Storage Module for API Communication
 * Handles all interactions with the Django backend API
 */

// API Base URL Configuration
const API_BASE_URL = "http://127.0.0.1:8000/";

/**
 * Constructs a full API endpoint URL
 * @param {string} endpoint - API endpoint name
 * @returns {string} - Complete API URL
 */
function getApiUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}/`;
}

/**
 * Gets the authentication headers for API requests
 * @returns {Object} - Headers object with authentication
 */
function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }
    return headers;
}

/**
 * Überprüft, ob der Gast-Modus aktiv ist
 * @returns {boolean} True wenn im Gast-Modus
 */
function isGuestMode() {
    return localStorage.getItem('guestMode') === 'true';
}

async function fetchFromApi(endpoint) {
    if (isPublicPage()) {
        console.log(`Public page detected, skipping API fetch for ${endpoint}`);
        return [];
    }
    if (isGuestMode()) {
        return [];
    }

    try {
        console.log(`Fetching data from ${endpoint}...`);
        const response = await fetch(getApiUrl(endpoint), {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Unauthorized - token might be expired
                console.error('Authentication error. Please log in again.');
                // WICHTIG: Umleitung nur wenn wir NICHT auf einer öffentlichen Seite sind
                if (!isPublicPage()) {
                    logout();
                }
                return [];
            }

            console.error(`Error fetching from ${endpoint}: ${response.status}`);
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error(`Error in fetchFromApi(${endpoint}):`, error);
        return [];
    }
}

/**
 * Creates a new resource via the API
 * @param {string} endpoint - API endpoint
 * @param {Object|Array} data - Data to send
 * @returns {Promise<Object>} - Response data
 */
async function createResource(endpoint, data) {
    // Im Gast-Modus Erfolg simulieren statt API-Aufrufe
    if (isGuestMode()) {
        console.log(`Guest mode: Simulating create for ${endpoint}`);
        return {
            status: "success",
            id: createID(), // Lokale ID generieren
            // Weitere Felder je nach Bedarf
        };
    }

    try {
        console.log(`Creating resource at ${endpoint}:`, data);

        const response = await fetch(getApiUrl(endpoint), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error('Authentication error. Please log in again.');
                logout();
                return { status: "error", message: "Authentication failed" };
            }

            return await handleApiError(response, `creating resource at ${endpoint}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error creating resource at ${endpoint}:`, error);
        return { status: "error", message: error.message };
    }
}

/**
 * Updates an existing resource via the API
 * @param {string} endpoint - API endpoint
 * @param {string|number} id - Resource ID
 * @param {Object} data - Data to update
 * @returns {Promise<Object>} - Response data
 */
async function updateResource(endpoint, id, data) {
    // Im Gast-Modus Erfolg simulieren statt API-Aufrufe
    if (isGuestMode()) {
        console.log(`Guest mode: Simulating update for ${endpoint}/${id}`);
        return { status: "success" };
    }

    try {
        console.log(`Updating ${endpoint}/${id}:`, data);

        const response = await fetch(`${getApiUrl(endpoint)}${id}/`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error('Authentication error. Please log in again.');
                logout();
                return { status: "error", message: "Authentication failed" };
            }

            return await handleApiError(response, `updating ${endpoint}/${id}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error updating ${endpoint}/${id}:`, error);
        return { status: "error", message: error.message };
    }
}

/**
 * Deletes a resource via the API
 * @param {string} endpoint - API endpoint
 * @param {string|number} id - Resource ID
 * @returns {Promise<Object>} - Response status
 */
async function deleteResource(endpoint, id) {
    // Im Gast-Modus Erfolg simulieren statt API-Aufrufe
    if (isGuestMode()) {
        console.log(`Guest mode: Simulating delete for ${endpoint}/${id}`);
        return { status: "success" };
    }
    try {
        const response = await fetch(`${getApiUrl(endpoint)}${id}/`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            if (response.status === 401) {
                console.error('Authentication error. Please log in again.');
                logout();
                return { status: "error", message: "Authentication failed" };
            }
            return await handleApiError(response, `deleting ${endpoint}/${id}`);
        }
        return { status: "success" };
    } catch (error) {
        console.error(`Error deleting ${endpoint}/${id}:`, error);
        return { status: "error", message: error.message };
    }
}

/**
 * Processes an API error response
 * @param {Response} response - Fetch Response object
 * @param {string} action - Description of the action that failed
 * @returns {Promise<Object>} - Formatted error response
 */
async function handleApiError(response, action) {
    const errorText = await response.text();
    console.error(`Error ${action}: ${response.status}`);
    console.error(`Response body: ${errorText}`);

    try {
        const errorJson = JSON.parse(errorText);
        return {
            status: "error",
            details: errorJson,
            message: `Server returned ${response.status}`
        };
    } catch (parseError) {
        return {
            status: "error",
            message: `Server returned ${response.status}: ${errorText}`
        };
    }
}

/**
 * Authenticates user with the backend
 * @param {string} email - User email (used as username)
 * @param {string} password - User password
 * @returns {Promise<Object>} - Authentication response with token
 */
async function authenticateUser(email, password) {
    try {
        const response = await loginApiCall(email, password);
        const data = await response.json();
        console.log("Login response:", data);
        
        return processLoginResponse(data);
    } catch (error) {
        console.error("Authentication error:", error);
        return { status: "error", message: error.message };
    }
}

/**
 * Makes the actual API call for login
 * @param {string} email - User's email
 * @param {string} password - User's password 
 * @returns {Promise<Response>} - Fetch response
 */
async function loginApiCall(email, password) {
    return await fetch(`${API_BASE_URL}user_auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: email,
            password: password
        })
    });
}

/**
 * Processes the login API response
 * @param {Object} data - Response data
 * @returns {Object} - Processed login result
 */
function processLoginResponse(data) {
    if (data.token) {
        return handleSuccessfulAuth(data);
    } else {
        return handleFailedAuth(data);
    }
}

/**
 * Handles successful authentication
 * @param {Object} data - Response data with token
 * @returns {Object} - Success response
 */
function handleSuccessfulAuth(data) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);

    return {
        status: "success",
        user: {
            name: data.username,
            email: data.email
        }
    };
}

/**
 * Handles failed authentication
 * @param {Object} data - Error response data
 * @returns {Object} - Error response
 */
function handleFailedAuth(data) {
    let errorMessage = "Login failed";
    
    if (data.non_field_errors) {
        errorMessage = data.non_field_errors[0];
    } else if (data.username) {
        errorMessage = "Username error: " + data.username[0];
    } else if (data.password) {
        errorMessage = "Password error: " + data.password[0];
    }
    
    return { status: "error", message: errorMessage };
}

/**
 * Registers a new user
 * @param {string} username - Username
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} repeatedPassword - Password confirmation
 * @returns {Promise<Object>} - Registration response
 */
async function registerUser(username, email, password, repeatedPassword) {
    try {
        const response = await fetch(`${API_BASE_URL}user_auth/registration/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                repeated_password: repeatedPassword
            })
        });
        const data = await response.json();
        if (!response.ok) {
            return {
                status: "error",
                errors: data.errors || "Registration failed"
            };
        }
        // Store authentication data if registration was successful
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);

        return {
            status: "success",
            user: {
                name: data.username,
                email: data.email,
                userID: data.userID
            }
        };
    } catch (error) {
        console.error("Registration error:", error);
        return { status: "error", message: error.message };
    }
}

// Task-specific API functions
/**
 * Loads all tasks from the API
 * @returns {Promise<Array>} - Array of task objects
 */
async function loadAllTasks() {
    return await fetchFromApi('tasks');
}

/**
 * Creates a new task with the provided parameters
 * @param {string} title - Title of the task
 * @param {string} description - Description of the task
 * @param {Array} assigned - Assigned contacts
 * @param {string} date - Due date
 * @param {string} prio - Priority (low, medium, urgent)
 * @param {string} category - Category of the task
 * @param {Array} subtasks - Subtasks
 * @returns {Object} - Created task
 */
function createTask(title, description, assigned, date, prio, category, subtasks) {
    const task = {
        title: title,
        description: description,
        assignedTo: assigned || [],
        dueDate: date,
        priority: prio || "medium",
        category: category || "todo",
        subtasks: subtasks || [],
        currentProgress: 0
    };
    tasks.push(task);
    console.log("Task created:", task);
    return task;
}

/**
 * Checks the backend response for errors
 * @param {Object} response - Backend response
 * @returns {Object} - Validated response
 * @throws {Error} If response has error status
 */
function checkResponseStatus(response) {
    if (response.status === "error") {
        const errorMsg = response.message || "Unknown error";
        throw new Error(errorMsg);
    }
    return response;
}

/**
 * Stores a task in the backend with improved error handling
 * @param {Object} task - Task object to store
 * @returns {Promise<Object>} - Backend response
 */
async function storeTask(task) {
    try {
        const formattedTask = formatTaskForBackend(task);
        let response;
        if (formattedTask.taskID) {
            response = await updateResource('tasks', formattedTask.taskID, formattedTask);
        } else {
            response = await createResource('tasks', formattedTask);
        }

        return checkResponseStatus(response);
    } catch (error) {
        console.error("Error saving task:", error);
        return { status: "error", message: error.message };
    }
}

/**
 * Speichert alle Tasks in der Datenbank
 * @returns {Promise<Object>} Ergebnis des Speicherns
 */
async function storeTasks() {
    try {
        // Jeder Task wird einzeln gespeichert
        const savingPromises = tasks.map(task => storeTask(task));
        await Promise.all(savingPromises);
        return { status: "success" };
    } catch (error) {
        console.error("Error storing tasks:", error);
        return {
            status: "error",
            message: "Failed to store all tasks: " + error.message
        };
    }
}

/**
 * Deletes a task by ID
 * @param {string|number} taskId - Task ID
 * @returns {Promise<Object>} - Response status
 */
async function deleteTaskItem(taskId) {
    return await deleteResource('tasks', taskId);
}

// Contact-specific API functions
/**
 * Loads all contacts from the API
 * @returns {Promise<Array>} - Array of contact objects
 */
async function loadAllContacts() {
    return await fetchFromApi('contacts');
}

/**
 * Creates or updates a contact
 * The user is automatically derived from the auth token
 * @param {Object} contact - Contact object
 * @returns {Promise<Object>} - Response data
 */
async function storeContact(contact) {
    try {
        // Choose storage operation depending on whether an ID exists
        if (contact.contactID) {
            return await updateResource('contacts', contact.contactID, contact);
        } else {
            return await createResource('contacts', contact);
        }
    } catch (error) {
        console.error("Error in storeContact:", error);
        return { status: "error", message: error.message };
    }
}

/**
 * Deletes a contact by ID
 * Checks if the current user is authorized
 * @param {string|number} contactId - Contact ID
 * @returns {Promise<Object>} - Response status
 */
async function deleteContactItem(contactId) {
    try {
        // The backend checks if the contact belongs to the authenticated user
        return await deleteResource('contacts', contactId);
    } catch (error) {
        console.error("Error in deleteContactItem:", error);
        return { status: "error", message: error.message };
    }
}

/**
 * Loads all users from the API
 * @returns {Promise<Array>} - Array of user objects
 */
async function loadAllUsers() {
    return await fetchFromApi('users');
}

/**
 * Creates or updates a user
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Response data
 */
async function storeUser(user) {
    if (user.userID) {
        return await updateResource('users', user.userID, user);
    } else {
        return await createResource('users', user);
    }
}

/**
 * Deletes a user by ID
 * @param {string|number} userId - User ID
 * @returns {Promise<Object>} - Response status
 */
async function deleteUserItem(userId) {
    return await deleteResource('users', userId);
}

/**
 * Formats a task object to match the backend expectations
 * @param {Object} task - Task object to format
 * @returns {Object} - Formatted task
 */
function formatTaskForBackend(task) {
    const formatted = { ...task };

    // Format assignedTo for the backend
    if (formatted.assignedTo && Array.isArray(formatted.assignedTo)) {
        formatted.assignedTo = formatted.assignedTo.map(contact => {
            if (typeof contact === 'object') {
                if (contact.contactID) {
                    return { contactID: contact.contactID };
                }
                if (contact.id) {
                    return { contactID: contact.id };
                }
            }
            return { contactID: contact };
        });
    }

    // Format subtasks for the backend
    if (formatted.subtasks && Array.isArray(formatted.subtasks)) {
        formatted.subtasks = formatted.subtasks.map(subtask => ({
            subTaskName: subtask.subTaskName || subtask.name || "",
            done: Boolean(subtask.done)
        }));
    }

    // Ensure valid values for priority and category
    if (formatted.priority && !["low", "medium", "urgent"].includes(formatted.priority)) {
        formatted.priority = "medium";
    }

    if (formatted.category && !["todo", "inprogress", "done"].includes(formatted.category)) {
        formatted.category = "todo";
    }

    return formatted;
}

// Local Storage functions
/**
 * Saves data to local storage
 * @param {string} key - Storage key
 * @param {*} value - Data to store
 */
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves data from local storage
 * @param {string} key - Storage key
 * @returns {*} - Stored data or null
 */
function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

/**
 * Removes data from local storage
 * @param {string} key - Storage key
 */
function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

// User session management functions
function storeActualUser(user) {
    saveToLocalStorage('actualUser', user);
}

function loadActualUser() {
    // Try to load user from authentication data first
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (token && username) {
        const user = {
            name: username,
            email: email
        };
        storeActualUser(user);
        return user;
    }

    return getFromLocalStorage('actualUser');
}

function deleteActualUser() {
    removeFromLocalStorage('actualUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
}

function storeRememberMe(value) {
    saveToLocalStorage('rememberMe', value);
}

function loadRememberMe() {
    return getFromLocalStorage('rememberMe');
}

function deleteRememberMe() {
    removeFromLocalStorage('rememberMe');
}

/**
 * Checks if user is authenticated
 * @returns {boolean} - True if user has valid auth token
 */
function isAuthenticated() {
    return localStorage.getItem('authToken') !== null;
}

/**
 * Logs out the current user
 */
function logout() {
    // Wenn wir auf einer öffentlichen Seite sind, nicht umleiten
    const isPublic = isPublicPage();
    console.log("Logout called on public page:", isPublic);
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    removeFromLocalStorage('actualUser');
    if (!localStorage.getItem('rememberMe')) {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
    }
    if (!isPublic) {
        window.location.href = 'start.html';
    }
}

// Ensure a default user exists in the system
async function ensureDefaultUserExists() {
    // This function is less needed with Django authentication
    // But keeping it for backward compatibility
    try {
        const users = await loadAllUsers();

        if (!users || users.length === 0) {
            console.log("No users found in the system.");
        }

        return users;
    } catch (error) {
        console.error("Error checking users:", error);
        return [];
    }
}

//------------------end of storage---------------------------------------------------------------------------
