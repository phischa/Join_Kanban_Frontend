/**
* will loading by clicking at the plus icon on board
*/
async function openAddTask(number){
    await addTaskInBoardInit(number);
    currentColumn = number;
    addContactsToPage();
}


/**
* loading All Settings to run Add-Task
*/
async function addTaskInBoardInit(setColumn = 0){
    filteredContacts = [];
    contactsOfAddPage = [];
    assignedContacts = [];
    filteredContacts = [];
    currentColumn = setColumn;
    renderAddTaskTemplateLightBox();
    clearAddTask()
    setMinDate();
    loadTasks();
    loadUsers();
    await loadContacts();
    //await loadActualUser();
    CheckforUnclosedWindows();
    checkRequirementsMouseover();
    CheckMouseoutCreateTask();
    stopSubtaskPropagation();
    stopPropagationContacts();
    currentColumn = 0;
    subtasksOfAddPage = [];
    finalSubtasksOfAddPage = [];
}


/**
* will happen after clicking 'create Task' button.
*/
function renderAddTaskTemplateLightBox(){
    content = document.getElementById("cardLightboxContent");
    content.innerHTML = templateAddTaskLightbox();
}


/**
* will happen after clicking 'create Task' button.
*/
async function submitTaskOnBoard(){
        let title = document.getElementById("ltitlename");
        let description = document.getElementById("ldescriptionname").value;
        let assigned = assignedContacts;
        let date = document.getElementById("ldatename").value;
        let prio = priority;
        let category = document.getElementById("lcategoryname").value;
        finalizeSubtasks();
        let subtasks = finalSubtasksOfAddPage;
        createTask(title.value, description, assigned, date, prio, category, subtasks);
        await storeTasks();
        clearRenderArea();
        title.value = title.defaultValue;
        clearForm();
        await setTaskToBoard();
        currentColumn = 0;
}


/**
* to close the Windows Add-Task-Windows
*/
async function setTaskToBoard() {
    // Close the modal
    hideBlackbox();
    delteEventListener();
    
    // Small delay to ensure API processing
    setTimeout(async () => {
        // Reload data
        await baordLoadTasks();
        
        // Optional functions if they exist
        if (typeof loadActualUser === 'function') await loadActualUser();
        if (typeof initialsOf === 'function') await initialsOf();
        
        // Refresh board
        sortLoadetTasks();
        cleanAllColums();
        checkForCard();
        showNoCard(true);
        initDropZone();
        showDropZone(0, true);
    }, 250);
}


/**
* in addition to clean the form by clicking the button 'Clear'
*/
function clearAddTask(){
    let checkboxes = document.getElementById("checkboxes");
    checkboxes.innerHTML = "";
    clearForm();
}


/**
* to reloading all data after creating a task
*/
async function reloadData(){
    await baordLoadTasks();
    await loadActualUser();
    await initialsOf();
    sortLoadetTasks();
    cleanAllColums();
    checkForCard();
    showNoCard(true);
    initDropZone();
    showDropZone(0, true);
}


/**
* removing a line under Adding-Subtask, which appears if there no Subtask to render.
*/
function setBorderAtSubtask(){
    let SubtaskListElement = document.getElementById("subtaskRenderAreaList");
    let isOnBoard = SubtaskListElement.hasAttribute("isOnBoard");
    if(isOnBoard && subtasksOfAddPage.length <= 0){
        SubtaskListElement.classList.remove("border");
    } else if(isOnBoard && subtasksOfAddPage.length > 0){
        SubtaskListElement.classList.add("border");
    }
}


/**
* after closing Add-Task-Windows it will delete all delteEventListener
*/
function delteEventListener(){
    document.removeEventListener("click", unclosedWindowsEvent); 
    document.removeEventListener("click", alreadyCheckeCreateTask); 
}