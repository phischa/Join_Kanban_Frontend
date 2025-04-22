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
    await loadUserContactsOnInit();
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
 * Collects task data from the board form
 * @returns {Object} - Task data object
 */
function collectBoardTaskData() {
  const title = document.getElementById("ltitlename").value;
  const description = document.getElementById("ldescriptionname").value;
  const assignedTo = assignedContacts.map(contact => ({
    contactID: contact.contactID
  }));
  const dueDate = document.getElementById("ldatename").value;
  const prio = priority === 'none' ? 'medium' : priority;
  const category = document.getElementById("lcategoryname").value;

  finalizeSubtasks();
  const subtasks = finalSubtasksOfAddPage;
  
  return { title, description, assignedTo, dueDate, prio, category, subtasks };
}

/**
 * Cleans up the board form after task creation
 */
function cleanupBoardTaskForm() {
  const title = document.getElementById("ltitlename");
  clearRenderArea();
  title.value = title.defaultValue;
  clearForm();
}

/**
 * Handles errors when saving a board task
 * @param {Object} error - Error object
 */
function handleBoardTaskSaveError(error) {
  console.error("Failed to save board task:", error);
  const message = error.message || "Unknown error";
  //alert("Task could not be saved: " + message);
}

/**
 * Saves the board task and updates the view
 * @param {Object} taskData - Task data
 * @returns {Promise<void>}
 */
async function saveBoardTaskAndUpdate(taskData) {
  try {
    const newTask = createTask(
      taskData.title, taskData.description, taskData.assignedTo,
      taskData.dueDate, taskData.prio, taskData.category, taskData.subtasks
    );
    
    const response = await storeTask(newTask);
    
    if (response.status === "success") {
      cleanupBoardTaskForm();
      await setTaskToBoard();
      currentColumn = 0;
    } else {
      handleBoardTaskSaveError(response);
    }
  } catch (error) {
    handleBoardTaskSaveError(error);
  }
}

/**
 * Creates and saves a task from the board
 * @returns {Promise<void>}
 */
async function submitTaskOnBoard() {
  const taskData = collectBoardTaskData();
  await saveBoardTaskAndUpdate(taskData);
}

/**
* to close the Windows Add-Task-Windows
*/
async function setTaskToBoard() {
    hideBlackbox();
    delteEventListener();
    setTimeout(async () => {
        await baordLoadTasks();
        
        if (typeof loadActualUser === 'function') await loadActualUser();
        if (typeof initialsOf === 'function') await initialsOf();
        
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