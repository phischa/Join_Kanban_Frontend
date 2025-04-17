/**
 * Simulates saving a contact in guest mode
 */
function simulateGuestTaskSave(task) {
    const tempId = createID();
    task.taskID = tempId;
    
    // Local storage
    const localTasks = getFromLocalStorage('tasks') || [];
    localTasks.push(task);
    saveToLocalStorage('tasks', localTasks);
    
    return {
        status: "success",
        contactID: tempId,
        message: "Contact saved in guest mode"
    };
}
