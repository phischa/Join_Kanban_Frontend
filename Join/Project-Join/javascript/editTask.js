let setNewPriority = null;
let boardContacts = []
let phantomTaskObject = {};
let editSubtask = [];

/**
 * Sets subtasks from a task to the workspace in database
 * @param {number} columnId - Column ID of the task
 * @param {number} id - ID of the task
 */
function actualizeSubtasks(columnId, id) {
    subtasksOfActualTask = list[columnId][id]["subtasks"];
}

/**
 * Overwrites old subtasks with current edit
 * @param {number} columnId - Column ID of the task
 * @param {number} id - ID of the task
 */
function editActucalTask(columnId, id) {
    actualTask = list[columnId][id];
}

/**
 * Loads all contacts from storage
 * @returns {Promise<void>}
 */
async function loadBoardContacts() {
    try {
        if (contacts.length === 0) {
            const loadedContacts = await loadAllContacts();
            
            if (Array.isArray(loadedContacts)) {
                boardContacts = loadedContacts.map(contact => ({
                    ...contact,
                    contactID: contact.contactID || contact.id
                }));
            } 
            else {
                console.error("Fehler beim Laden der Kontakte: Kein Array zurückgegeben");
                boardContacts = [];
            }
        } 
        else {
            boardContacts = contacts.map(contact => ({
                ...contact,
                contactID: contact.contactID || contact.id
            }));
        }
    } 
    catch (error) {
        console.error("Fehler beim Laden der Kontakte:", error);
        boardContacts = [];
    }
}

/**
 * Saves changes to the task
 * @param {number} columnNumber - Column number
 * @param {number} id - Task ID
 * @returns {Promise<void>}
 */
async function saveChagesToTask(columnNumber, id) {
    list[columnNumber][id] = phantomTaskObject;
    await saveCurrentTask(columnNumber, id, false);
}

/**
 * Renders a new subtask to edit
 * @param {string} newTask - Text of the new task
 * @param {HTMLElement} elementId - Original parent element
 * @param {number} idOfInput - ID of input
 */
function saveNewSubtask(newTask, elementId, idOfInput) {
    delerror();
    let parentElement = document.getElementById(`selectAddInput_1`);
    let SubtaskList = document.getElementById(`cardLightboxSubtask`);
    if (newTask.length > 0 && newTask != null) {
        SubtaskList.innerHTML += `<li>${newTask}</li>`
    } else {
        seterror(parentElement, "Ups. This Field is required.");
    }
}

/**
 * Initializes after opening the edit mode
 * @param {number} columnNumber - Column number
 * @param {number} id - Task ID
 * @returns {Promise<void>}
 */
async function openEditableMode(columnNumber, id) {
    let content = document.getElementById(`cardLightboxContent`)
    content.innerHTML = templateLightboxEditTask(columnNumber, id)
    setNewPriority = null;
    await loadBoardContacts();
    generatePseudoObject(columnNumber, id, 0);
    generatePseudoObject(columnNumber, id, 1);
    setChagesToPhantomTask(columnNumber, id);
    checkCurrentPrio(columnNumber, id);
    rendersubtask();
    renderProfilsInAssignToEdit();
    setMinDate();
}

/**
 * Rebuilds from an object to prevent deep referencing in objects
 * @param {Array} currentObject - Object to iterate through
 * @returns {Array} - New array with cloned objects
 */
function iteratetThoughObject(currentObject) {
    let newArray = [];
    let emptyObject = {}
    for (let i = 0; i < currentObject.length; i++) {
        Object.assign(emptyObject, currentObject[i]);
        newArray.push(emptyObject);
        emptyObject = {}
    }
    return newArray;
}

/**
 * Sets up a new PseudoTask to store edits until saved
 * @param {number} columnNumber - Column number
 * @param {number} id - Task ID
 * @param {number} modus - Mode (0: assignedTo, 1: subtasks)
 */
function generatePseudoObject(columnNumber, id, modus = 0) {
    let customObject = {};
    let currentObject = {};
    let keyword = "";
    if (modus == 0) {
        currentObject = list[columnNumber][id]["assignedTo"];
        keyword = "assignedTo";
    } else if (modus == 1) {
        currentObject = list[columnNumber][id]["subtasks"];
        keyword = "subtasks";
    }
    customObject = { [keyword]: iteratetThoughObject(currentObject) };
    Object.assign(phantomTaskObject, customObject)
}

/**
 * Returns the newest priority after clicking on a priority button
 * @returns {string|null} - Priority value
 */
function setNewestPriority() {
    let options = ["urgent", "medium", "low"];
    let currentOption = null;
    if (setNewPriority != null) {
        currentOption = options[setNewPriority];
    }
    return currentOption;
}

/**
 * Checks current priority before edit appears to set priority button correctly
 * @param {number} columnNumber - Column number
 * @param {number} id - Task ID
 */
function checkCurrentPrio(columnNumber, id) {
    let currentValue = list[columnNumber][id]["priority"];
    let newValue = null;
    if (currentValue == "medium") {
        newValue = 1;
    } else if (currentValue == "low") {
        newValue = 2;
    } else if (currentValue == "urgent") {
        newValue = 0;
    }
    setOfValuePrio(newValue);
}

/**
 * Changes appearance of priority button after clicking
 * @param {number} value - Current priority value (1=medium, 2=low, 0=urgent)
 */
function setOfValuePrio(value) {
    let allElements = document.querySelectorAll("[priorityButton]");
    for (let i = 0; i < allElements.length; i++) {
        allElements[i].classList.add("clearColor", "buttonhover");
        if (value == i) {
            if (value != setNewPriority) {
                allElements[i].classList.remove("clearColor", "buttonhover");
                setNewPriority = value;
            } else {
                allElements[i].classList.add("clearColor", "buttonhover");
                setNewPriority = null;
            }
        }
    }
}

/**
 * Checks for required inputs and saves changes
 * @param {number} columnNumber - Column number
 * @param {number} id - Task ID
 * @returns {Promise<void>}
 */
async function checkAndSave(columnNumber, id) {
    delerror();
    let isRequired = checkRequiredInputs();
    let parentElement = document.getElementById("savebutton");
    if (isRequired) {
        setChagesToPhantomTask(columnNumber, id);
        await saveChagesToTask(columnNumber, id);
        taskObjects = [];
        await baordLoadTasks();
        refreshColumnRender(loadAll = true);
        openLightboxCard(columnNumber, id);
    } else {
        seterror(parentElement, "Ups, Some requirements are missing");
    }
}

/**
 * Collects data to generate phantomTaskObject (clone of current task)
 * @param {number} columnNumber - Column number
 * @param {number} id - Task ID
 */
function setChagesToPhantomTask(columnNumber, id) {
    phantomTaskObject["taskID"] = list[columnNumber][id]["taskID"];
    phantomTaskObject["title"] = document.getElementById("lightboxEditTitle").value;
    phantomTaskObject["description"] = document.getElementById("lightboxEditText").value;
    phantomTaskObject["dueDate"] = document.getElementById("ldatename").value;
    phantomTaskObject["category"] = list[columnNumber][id]["category"];
    phantomTaskObject["priority"] = setNewestPriority();
    phantomTaskObject["currentProgress"] = list[columnNumber][id]["currentProgress"];
}

/**
 * Checks elements for empty inputs and generates errors if needed
 * @param {Array} ArrayWithElements - List of elements to check
 * @param {string} ErrorText - Error text to display
 * @returns {boolean} - True if all inputs valid
 */
function checkForError(ArrayWithElements, ErrorText) {
    let ischeked = true
    let errorCounter = 0
    for (let i = 0; i < ArrayWithElements.length; i++) {
        let value = ArrayWithElements[i].value;
        if (value.length <= 0) {
            let parentElement = ArrayWithElements[i]
            seterror(parentElement, ErrorText);
            errorCounter += 1
        }
    }
    if (errorCounter > 0) {
        ischeked = false
    }
    return ischeked;
}

/**
 * Checks for open edits in subtasks and validates inputs
 * @param {NodeList} allEditSuptaskInputs - All subtask input elements
 * @returns {boolean} - True if all inputs valid
 */
function checkSuptaskForError(allEditSuptaskInputs) {
    let ischeked = true;
    let idFromInput = "";
    for (let i = 0; i < allEditSuptaskInputs.length; i++) {
        if (allEditSuptaskInputs[i].value.length <= 0) {
            ischeked = false;
        }
        idFromInput = allEditSuptaskInputs[i].getAttribute("openEditInputField")
        saveChagesSubtask(idFromInput);
    }
    return ischeked;
}

/**
 * Checks if all required inputs are filled
 * @returns {boolean} - True if all requirements are met
 */
function checkRequiredInputs() {
    let title = document.getElementById("lightboxEditTitle");
    let date = document.getElementById("ldatename");
    let allEditSuptaskInputs = document.querySelectorAll("[openEditInputField]");
    let elementArray = [title, date];
    let isCheked = checkForError(elementArray, "Ups. This Field is required.");
    let isSubtaskCheked = checkSuptaskForError(allEditSuptaskInputs);
    if (isCheked && isSubtaskCheked) {
        return true;
    }
    return false;
}

/**
 * Renders contact profiles in the AssignTo selection box
 */
function renderProfilsInAssignToEdit() {
    let content = document.getElementById("selectArea_1");
    if (!content) {
        console.error("selectArea_1 Element nicht gefunden");
        return;
    }
    content.innerHTML = "";
    if (!boardContacts || boardContacts.length === 0) {
        content.innerHTML = `<div class="no-contacts">Keine Kontakte verfügbar</div>`;
        return;
    }
    
    for (let i = 0; i < boardContacts.length; i++) {
        const contactId = boardContacts[i].contactID;
        content.innerHTML += templateProfilForAssignTo(i, contactId);
    }
}

/**
 * Renders all subtasks in the edit view
 */
function rendersubtask() {
    let content = document.getElementById("cardLightboxEditSubtask");
    content.innerHTML = "";
    if (phantomTaskObject["subtasks"].length > 0) {
        for (let i = 0; i < phantomTaskObject["subtasks"].length; i++) {
            content.innerHTML += templateSubtaskEdit(phantomTaskObject["subtasks"][i]["subTaskName"], i);
        }
    } else {
        content.innerHTML = `<li class="stopHover noSubtask"><div class="NosubtaskContainer">Keine Subtasks vorhanden!<div></li>`;
    }
}

/**
 * Saves a new subtask after editing
 * @param {number} id - ID of the subtask
 * @returns {boolean} - True if saved successfully
 */
function addNewSubTask(id) {
    let isSaved = true;
    let inputElement = document.getElementById(`selectAddInputField_${id}`);
    let parentElement = document.getElementById(`selectAddInput_${id}`);
    if (inputElement.value.length <= 0) {
        seterror(parentElement, "Ups. This Field is required.");
        isSaved = false;
    } else {
        let subtask = {
            done: false,
            subTaskID: createID(),
            subTaskName: inputElement.value
        }
        phantomTaskObject["subtasks"].push(subtask);
        rendersubtask();
    }
    return isSaved
}

/**
 * Deletes a subtask
 * @param {number} id - ID of the subtask to delete
 */
function deleteSubtask(id) {
    phantomTaskObject["subtasks"].splice(id, 1);
    rendersubtask();
}

/**
 * Searches for contacts in the AssignTo dropdown
 */
function searchInAssignTo() {
    let toSearch = document.getElementById("selectInput_1").value;
    let content = document.getElementById("selectArea_1");
    content.innerHTML = "";
    for (let i = 0; i < boardContacts.length; i++) {
        let contactId = boardContacts[i]["contactID"]
        let currentName = boardContacts[i]["name"].toLowerCase();
        let currentEmail = boardContacts[i]["email"].toLowerCase();
        if (toSearch.length > 0 && currentName.includes(toSearch.toLowerCase()) || currentEmail.includes(toSearch.toLowerCase())) {
            content.innerHTML += templateProfilForAssignTo(i, contactId);
        } else if (toSearch.length <= 0) {
            renderProfilsInAssignToEdit();
        }
    }
}

/**
 * Makes a subtask editable
 * @param {number} id - ID of the subtask
 */
function makeEditSubtask(id) {
    let content = document.getElementById(`subtask_${id}`);
    content.innerHTML = refreshtemplateSubtaskInEdit(id);
}

/**
 * Saves changes to a subtask
 * @param {number} id - ID of the subtask
 */
function saveChagesSubtask(id) {
    delerror();
    let newValue = document.getElementById(`subtask_${id}_input`).value
    let parentElement = document.getElementById(`subtask_${id}_input`);
    if (newValue.length <= 0) {
        seterror(parentElement, "Ups. This Field is required.")
    } else {
        let content = document.getElementById(`subtask_${id}`);
        phantomTaskObject["subtasks"][id]["subTaskName"] = newValue;
        content.innerHTML = refreshtemplateSubtaskEdit(newValue, id);
    }
}

/**
 * Cancels changes to a subtask
 * @param {number} id - ID of the subtask
 */
function undoChagesSubtask(id) {
    delerror();
    let subtask = phantomTaskObject["subtasks"][id]["subTaskName"]
    let content = document.getElementById(`subtask_${id}`);
    content.innerHTML = refreshtemplateSubtaskEdit(subtask, id);
}

/**
 * Toggles assignment status of a contact to a task
 * @param {string} contactId - ID of the contact
 * @param {number} id - Index of the contact in boardContacts
 */
function changeStatusAssignTo(contactId, id) {
    let isFound = false;
    let array = phantomTaskObject.assignedTo || [];
    
    for (let i = 0; i < array.length; i++) {
        let currentContactId = array[i].contactID;
        
        if (typeof currentContactId === 'object' && currentContactId !== null) {
            currentContactId = currentContactId.id || currentContactId.contactID;
        }
        
        if (currentContactId == contactId) {
            isFound = true;
            array.splice(i, 1);
            break;
        }
    }
    
    if (!isFound && id >= 0 && id < boardContacts.length) {
        array.push({
            contactID: boardContacts[id].contactID,
            name: boardContacts[id].name,
            email: boardContacts[id].email,
            color: boardContacts[id].color,
            initials: boardContacts[id].initials
        });
    }
    
    phantomTaskObject.assignedTo = array;
    renderProfilsInAssignToEdit();
}

/**
 * Checks if a contact is already assigned to a task
 * @param {string} contactId - ID of the contact to check
 * @returns {string} - Path to the appropriate checkmark icon
 */
function checkIsAssignedto(contactId) {
    let imgpath = "../img/icons/check-button-mobile-uncheck.svg";
    
    if (phantomTaskObject && phantomTaskObject.assignedTo) {
        for (let i = 0; i < phantomTaskObject.assignedTo.length; i++) {
            let assignedContactId = phantomTaskObject.assignedTo[i].contactID;
            
            if (typeof assignedContactId === 'object' && assignedContactId !== null) {
                assignedContactId = assignedContactId.id || assignedContactId.contactID;
            }
            
            if (contactId == assignedContactId) {
                imgpath = "../img/icons/check-button-mobile-check.svg";
                break;
            }
        }
    }
    
    return imgpath;
}