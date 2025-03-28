/**
 * Storage Module for API Communication
 * Handles all interactions with the Django backend API
 */

// API Base URL Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api/";

/**
 * Constructs a full API endpoint URL
 * @param {string} endpoint - API endpoint name
 * @returns {string} - Complete API URL
 */
function getApiUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}/`;
}

/**
 * Fetches data from a specific API endpoint
 * @param {string} endpoint - API endpoint (e.g., 'tasks', 'contacts')
 * @returns {Promise<Array>} - Array of objects from the API
 */
async function fetchFromApi(endpoint) {
    try {
        const response = await fetch(getApiUrl(endpoint));
        
        if (!response.ok) {
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
    try {
        console.log(`Creating resource at ${endpoint}:`, data);
        
        const response = await fetch(getApiUrl(endpoint), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
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
    try {
        console.log(`Updating ${endpoint}/${id}:`, data);
        
        const response = await fetch(`${getApiUrl(endpoint)}${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
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
    try {
        const response = await fetch(`${getApiUrl(endpoint)}${id}/`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
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

// Task-specific API functions
/**
 * Loads all tasks from the API
 * @returns {Promise<Array>} - Array of task objects
 */
async function loadAllTasks() {
    return await fetchFromApi('tasks');
}

/**
 * Creates or updates a task
 * @param {Object} task - Task object
 * @returns {Promise<Object>} - Response data
 */
async function storeTask(task) {
    const formattedTask = formatTaskForBackend(task);
    
    if (formattedTask.taskID) {
        return await updateResource('tasks', formattedTask.taskID, formattedTask);
    } else {
        return await createResource('tasks', formattedTask);
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
 * @param {Object} contact - Contact object
 * @returns {Promise<Object>} - Response data
 */
async function storeContact(contact) {
    if (contact.contactID) {
        return await updateResource('contacts', contact.contactID, contact);
    } else {
        return await createResource('contacts', contact);
    }
}

/**
 * Deletes a contact by ID
 * @param {string|number} contactId - Contact ID
 * @returns {Promise<Object>} - Response status
 */
async function deleteContactItem(contactId) {
    return await deleteResource('contacts', contactId);
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
    return getFromLocalStorage('actualUser');
}

function deleteActualUser() {
    removeFromLocalStorage('actualUser');
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

// Ensure a default user exists in the system
async function ensureDefaultUserExists() {
    try {
        const users = await loadAllUsers();
        
        if (!users || users.length === 0) {
            console.log("No users found. Creating a default user...");
            
            const defaultUser = {
                name: "Default User",
                email: "default@example.com",
                password: "defaultpassword" // In production, use a secure password
            };
            
            await storeUser(defaultUser);
            return await loadAllUsers();
        }
        
        return users;
    } catch (error) {
        console.error("Error ensuring default user:", error);
        return [];
    }
}

//------------------end of storage---------------------------------------------------------------------------
