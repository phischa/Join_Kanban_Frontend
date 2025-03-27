let setNewPriority = null;
let boardContacts = []
let phantomTaskObject = {};
let editSubtask = [];

/**
* set Subtasks from a task to the Workspave in Database.
*/
function actualizeSubtasks(columnId, id) {
    subtasksOfActualTask = list[columnId][id]["subtasks"];
}

/**
* overwrite old Subtasks with current Edit.
*/
function editActucalTask(columnId, id) {
    actualTask = list[columnId][id];
}

/**
* loadings all Contacts from Storage
*/
async function loadBoardContacts() {
    let loadedBoardContacts = [];
    loadedBoardContacts = await getItem('contacts');
    if (loadedBoardContacts.data && loadedBoardContacts.data.value && loadedBoardContacts.data.value != "null") {
        boardContacts = JSON.parse(loadedBoardContacts.data.value);
    }
}

/**
* save chages to the storage
*/
async function saveChagesToTask(columnNumber, id) {
    list[columnNumber][id] = phantomTaskObject;
    await saveCurrentTask(columnNumber, id, false);
}

/**
* renders a new Subtask to Edit.
* if input is empty a error appears.
* @param {string} newTask - text of the new task.
* @param {element} elementId - original Parenelement to add a error if needed.
* @param {number} idOfInput - id from input.
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
* init after open the edit-mode.
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
* rebuild from a object to prevent deep referencing in Objects. 
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
* will set up a new PseudoTask.
* PseudoTask is needed to store all edits until it will be saved.
* After all Edits gets saved the original Task gets overwritten by this PseudoObject.
* @param {number} modus - switch beteween generating assignedTo and subtasks.
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
* After clicking on a Priority it will switch the value of setNewPriority
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
* looks for the current priority before edit appears - to set the current prio-button right
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
* for change appearance of prio-button after click on it.
* @param {number} value - current prio value. (1 = medium, 2 = low, 0 = urgent )
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
* before edit gets closed it will checked for required inputs are empty and save all changes.
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
* collects all needed data to generate phantomTaskObject. -A Clone Object of the current Task
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
* reveived a list with elements, which it will check for empty inputs / missing infos.
* Otherwise is will generate a Error with the received ErrorText
* @param {Array} ArrayWithElements - received from checkRequiredInputs() - A list with Elements, who needs to get checked.
* @param {string} ErrorText - just a Text for the error.
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
* checks for open edits in Subtask and checks for empty Inputs.
* @param {Array} allEditSuptaskInputs - received from checkRequiredInputs() - A list with Elements, who needs to get checked.
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
* @returns true/false if requirements are fulfilled.
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
* rendering each profil into 'Assign To' inside select box
*/
function renderProfilsInAssignToEdit() {
    let content = document.getElementById("selectArea_1");
    let contactId = "";
    content.innerHTML = "";
    for (let i = 0; i < boardContacts.length; i++) {
        contactId = boardContacts[i]["contactID"];
        content.innerHTML += templateProfilForAssignTo(i, contactId);
    }
}

/**
* rendering each Subtask
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
* save a Subtask after editing
* @param id - current id from Subtask in Edit-Windows
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
* delete a Subtask
*/
function deleteSubtask(id) {
    phantomTaskObject["subtasks"].splice(id, 1);
    rendersubtask();
}

/**
* function to sreach in AssignTo
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
* refresh the content in Subtask
* @param {number} id - current id of the Subtask
*/
function makeEditSubtask(id) {
    let content = document.getElementById(`subtask_${id}`);
    content.innerHTML = refreshtemplateSubtaskInEdit(id);
}

/**
* checks inputs and save the new value of a Subtask#
* @param {number} id - current id of the Subtask
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
* switch back to normal view and don't save any changes
* @param {number} id - current id of the Subtask
*/
function undoChagesSubtask(id) {
    delerror();
    let subtask = phantomTaskObject["subtasks"][id]["subTaskName"]
    let content = document.getElementById(`subtask_${id}`);
    content.innerHTML = refreshtemplateSubtaskEdit(subtask, id);
}

/**
* set the current status of someone to assign him to a task.
* @param {string} contactId - Id from Contact
* @param {number} id - current id of loadet User
*/
function changeStatusAssignTo(contactId, id) {
    let isFound = false;
    let array = phantomTaskObject["assignedTo"];
    for (let i = 0; i < phantomTaskObject["assignedTo"].length; i++) {
        if (array[i]["contactID"] == contactId) {
            isFound = true;
            array.splice(i, 1);
        }
    }
    if (isFound == false) {
        array.push(boardContacts[id]);
    }
    renderProfilsInAssignToEdit();
}

/**
* set the rightz image if somebody is already involved to a task. 
* @param {string} contactId - just the id from current User.
*/
function checkIsAssignedto(contactId) {
    let imgpath = "../img/icons/check-button-mobile-uncheck.svg";
    for (let i = 0; i < phantomTaskObject["assignedTo"].length; i++) {
        Searchkey = phantomTaskObject["assignedTo"][i]["contactID"];
        if (contactId == phantomTaskObject["assignedTo"][i]["contactID"]) {
            imgpath = "../img/icons/check-button-mobile-check.svg";
        }
    }
    return imgpath;
}