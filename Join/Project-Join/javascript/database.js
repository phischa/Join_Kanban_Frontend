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
 * Creates a new task with the given parameters
 * @param {String} title - Task title
 * @param {String} description - Task description
 * @param {Array} assignedTo - Array of contact IDs/objects
 * @param {Date} dueDate - Due date
 * @param {String} priority - Task priority
 * @param {String} category - Task category
 * @param {Array} subtasks - Array of subtask objects
 * @param {Number} currentProgress - Task progress
 * @returns {Promise<Object>} - Created task
 */
async function createTask(title, description, assignedTo, dueDate, priority, category, subtasks, currentProgress = 0) {
    const task = {
        title: title,
        description: description,
        assignedTo: formatAssignedTo(assignedTo),
        dueDate: dueDate,
        priority: validatePriority(priority),
        category: validateCategory(category),
        subtasks: formatSubtasks(subtasks),
        currentProgress: Number(currentProgress)
    };
    
    try {
        const response = await storeTask(task);
        
        if (response.status === "success") {
            task.taskID = response.taskID || createID();
            currentTaskId = task.taskID;
            tasks.push(task);
            return task;
        } else {
            // Fallback to local storage
            task.taskID = createID();
            currentTaskId = task.taskID;
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            return task;
        }
    } catch (error) {
        console.error("Error creating task:", error);
        // Fallback to local storage
        task.taskID = createID();
        currentTaskId = task.taskID;
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return task;
    }
}

/**
 * Formats assigned contacts to match API expectations
 * @param {Array} assignedTo - Array of contacts
 * @returns {Array} - Formatted assigned contacts
 */
function formatAssignedTo(assignedTo) {
    if (!Array.isArray(assignedTo)) {
        return [];
    }
    
    return assignedTo.map(contact => {
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

/**
 * Validates and normalizes task priority
 * @param {String} priority - Priority value
 * @returns {String} - Valid priority
 */
function validatePriority(priority) {
    const validPriorities = ["low", "medium", "high"];
    return validPriorities.includes(priority) ? priority : "medium";
}

/**
 * Validates and normalizes task category
 * @param {String} category - Category value
 * @returns {String} - Valid category
 */
function validateCategory(category) {
    const validCategories = ["todo", "inprogress", "done"];
    return validCategories.includes(category) ? category : "todo";
}

/**
 * Formats subtasks to match API expectations
 * @param {Array} subtasks - Array of subtask objects
 * @returns {Array} - Formatted subtasks
 */
function formatSubtasks(subtasks) {
    if (!Array.isArray(subtasks)) {
        return [];
    }
    
    return subtasks.map(subtask => ({
        subTaskName: subtask.subTaskName || subtask.name || "",
        done: Boolean(subtask.done)
    }));
}

/**
 * Retrieves a task by ID
 * @param {String|Number} id - Task ID
 * @returns {Object|null} - Task object or null
 */
function getTaskFromID(id) {
    return tasks.find(task => task.taskID == id) || null;
}

/**
 * Gets the index of a task in the tasks array
 * @param {String|Number} id - Task ID
 * @returns {Number} - Index or -1 if not found
 */
function getIndexOfTasksById(id) {
    return tasks.findIndex(task => task.taskID == id);
}

/**
 * Deletes a task by ID
 * @param {String|Number} id - Task ID
 * @returns {Promise<void>}
 */
async function deleteTask(id) {
    const index = getIndexOfTasksById(id);
    
    if (index === -1) {
        return;
    }
    
    tasks.splice(index, 1);
    
    try {
        const response = await deleteTaskItem(id);
        
        if (response.status !== "success") {
            console.error("Failed to delete task from backend:", response);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

/**
 * Saves the currently edited task
 * @returns {Promise<void>}
 */
async function saveActualTask() {
    if (!actualTask) {
        return;
    }
    
    const id = actualTask.taskID;
    const index = getIndexOfTasksById(id);
    
    if (index === -1) {
        return;
    }
    
    actualTask.subtasks = subtasksOfActualTask;
    tasks[index] = actualTask;
    
    try {
        const formattedTask = formatTaskForSaving(actualTask);
        const response = await storeTask(formattedTask);
        
        if (response.status !== "success") {
            console.error("Failed to update task:", response);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    } catch (error) {
        console.error("Error saving task:", error);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

/**
 * Formats a task for saving to backend
 * @param {Object} task - Task to format
 * @returns {Object} - Formatted task
 */
function formatTaskForSaving(task) {
    const formatted = { ...task };
    
    if (formatted.subtasks && Array.isArray(formatted.subtasks)) {
        formatted.subtasks = formatted.subtasks.map(subtask => ({
            subTaskName: subtask.subTaskName || subtask.name || "",
            done: Boolean(subtask.done)
        }));
    }
    
    return formatted;
}

/**
 * Sets a task as the current one being edited
 * @param {String|Number} id - Task ID
 */
function setAsActualTask(id) {
    actualTask = getTaskFromID(id);
    subtasksOfActualTask = actualTask ? [...(actualTask.subtasks || [])] : [];
}

/**
 * Creates a subtask object
 * @param {String} content - Subtask content
 * @returns {Object} - Subtask object
 */
function createSubtask(content) {
    return {
        subTaskID: createID(),
        subTaskName: content,
        done: false
    };
}

/**
 * Adds a subtask to the current task
 * @param {String} content - Subtask content
 */
function addSubtask(content) {
    const subTask = createSubtask(content);
    subtasksOfActualTask.push(subTask);
}

/**
 * Deletes a subtask by ID
 * @param {String|Number} id - Subtask ID
 */
function deleteSubtask(id) {
    const index = getIndexOfSubtasksById(id);
    
    if (index !== -1) {
        subtasksOfActualTask.splice(index, 1);
    }
}

/**
 * Sets a subtask as the current one being edited
 * @param {String|Number} id - Subtask ID
 */
function getSubtaskByID(id) {
    const index = getIndexOfSubtasksById(id);
    
    if (index !== -1) {
        actualSubtask = subtasksOfActualTask[index];
    }
}

/**
 * Saves changes to the current subtask
 * @param {String|Number} id - Subtask ID
 */
function saveSubtask(id) {
    if (!actualSubtask) {
        return;
    }
    
    const index = getIndexOfSubtasksById(id);
    
    if (index !== -1) {
        subtasksOfActualTask[index] = actualSubtask;
    }
}

/**
 * Toggles the done status of the current subtask
 */
function toggleDoneOfActualSubtask() {
    if (actualSubtask) {
        actualSubtask.done = !actualSubtask.done;
    }
}

/**
 * Gets the index of a subtask by ID
 * @param {String|Number} id - Subtask ID
 * @returns {Number} - Index or -1 if not found
 */
function getIndexOfSubtasksById(id) {
    return subtasksOfActualTask.findIndex(subtask => subtask.subTaskID == id);
}

/**
 * Extracts initials from a name
 * @param {String} name - Full name
 * @returns {String} - Initials
 */
function getInitials(name) {
    const parts = name.split(" ");
    
    if (parts.length < 2) {
        return parts[0] ? parts[0][0].toUpperCase() : "";
    }
    
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
}

/**
 * Retrieves a contact by ID
 * @param {String|Number} id - Contact ID
 * @returns {Object|null} - Contact object or null
 */
function getContactFromID(id) {
    return contacts.find(contact => contact.contactID == id) || null;
}

/**
 * Generates a random color for a contact
 * @returns {String} - Hex color code
 */
function createContactColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    
    return color;
}

/**
 * Creates a new contact
 * @param {String} name - Contact name
 * @param {String} email - Contact email
 * @param {String} phone - Contact phone
 * @returns {Promise<Object>} - Created contact
 */
async function createContact(name, email, phone) {
    const contact = {
        name: name,
        email: email,
        phone: phone,
        color: createContactColor()
    };
    
    try {
        const response = await storeContact(contact);
        
        if (response.status === "success") {
            contact.contactID = response.contactID || createID();
            contact.initials = getInitials(name);
            contacts.push(contact);
            return contact;
        } else {
            // Fallback to local storage
            contact.contactID = createID();
            contact.initials = getInitials(name);
            contacts.push(contact);
            localStorage.setItem('contacts', JSON.stringify(contacts));
            return contact;
        }
    } catch (error) {
        console.error("Error creating contact:", error);
        // Fallback to local storage
        contact.contactID = createID();
        contact.initials = getInitials(name);
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        return contact;
    }
}

/**
 * Deletes a contact by ID
 * @param {String|Number} id - Contact ID
 * @returns {Promise<void>}
 */
async function deleteContact(id) {
    const normalizedId = !isNaN(id) ? Number(id) : id;
    const index = contacts.findIndex(contact => 
        contact.contactID === normalizedId || contact.id === normalizedId
    );
    
    if (index === -1) {
        console.warn(`Contact with ID ${id} not found`);
        return;
    }
    
    // Check if contact is a user
    const isUser = users.some(user => 
        user.userID === normalizedId || user.id === normalizedId
    );
    
    if (isUser) {
        console.warn("Cannot delete a contact associated with a user account");
        return;
    }
    
    const contactToRemove = contacts[index];
    contacts.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    try {
        const backendId = contactToRemove.id || contactToRemove.contactID;
        const response = await deleteContactItem(backendId);
        
        if (response.status !== "success") {
            console.error("Failed to delete contact from backend:", response);
        }
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
}

/**
 * Creates a new user
 * @param {String} email - User email
 * @param {String} password - User password
 * @param {String} username - Username
 * @returns {Promise<Object>} - Created user
 */
async function createUser(email, password, username) {
    const user = {
        email: email,
        password: password,
        name: capitalizeName(username)
    };
    
    try {
        const response = await storeUser(user);
        
        if (response.status === "success") {
            user.userID = response.userID || createID();
            await createUserContact(user);
            users.push(user);
            return user;
        } else {
            console.error("Failed to create user:", response);
            return null;
        }
    } catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
}

/**
 * Creates a contact for a user
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Created contact
 */
async function createUserContact(user) {
    const contact = {
        contactID: user.userID,
        name: user.name,
        email: user.email,
        initials: getInitials(user.name),
        color: createContactColor()
    };
    
    await storeContact(contact);
    contacts.push(contact);
    return contact;
}

/**
 * Capitalizes a name
 * @param {String} name - Name to capitalize
 * @returns {String} - Capitalized name
 */
function capitalizeName(name) {
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Logs out the current user
 */
function logout() {
    localStorage.setItem('rememberMe', '');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
    deleteActualUser();
    window.location.href = "./start.html";
}

/**
 * Initializes the application
 * @returns {Promise<void>}
 */
async function initApp() {
    try {
        await Promise.all([
            loadContacts(),
            loadTasks(),
            loadUsers(),
            loadActualUser(),
            loadRememberMe()
        ]);
        
        await ensureDefaultUserExists();
        console.log("Application initialized");
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