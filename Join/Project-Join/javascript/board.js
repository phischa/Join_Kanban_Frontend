/**
* The Board-Site is made out of columns to seprate all task.
* Very often, functions needs to know where a specific task is.
* @param {number} columnId - In case it is needed - the function gets columnId which contains a number to declares the right column.
* @param {number} id - The id is the task/index of your current selected column.
* All Columns brought together in 'list'
*/
let toDo = [];
let inProgress = [];
let awaitFeedback = [];
let isDone = [];

let list = [toDo, inProgress, awaitFeedback, isDone];

/**
* Store all tasks before it gets sorted by sortLoadetTasks().
*/
let taskObjects = []
let urlVariable = checkUrlFeature()

/**
* initializing all Settings for the Page
*/
async function initBoard() {
    await baordLoadTasks();
    //await loadActualUser();
    //await initialsOf();
    sortLoadetTasks();
    cleanAllColums();
    checkForCard();
    showNoCard(true);
    initDropZone();
    showDropZone(0, true, false);
    checkUrlFeature();
    loadEventListenerForDropMenu();
}

/**
* If a Task gets edit in any case. It needs to be save in Database/Storage.
* @param {number} columnId - declares the column-array, which contains your task. 
* @param {number} id - declares the index of the task in your column-array.
* @param {string} orWithID - in case you need to fetch a task by his own 'taskId': 
*/
async function saveCurrentTask(columnId = 0, id = 0, orWithID = false) {
    let pullTask = "";
    if (!orWithID) {
        pullTask = list[columnId][id]["taskID"];
    } else {
        pullTask = orWithID;
    }
    actualizeSubtasks(columnId, id);
    editActucalTask(columnId, id);
}

/**
* to delete a Task from Board and storage/database.
*/
function deleteCurrentTask(columnId, id) {
    let pulledTask = list[columnId][id]["taskID"];
    deleteTask(pulledTask);
    deleteTaskFromtaskObjects(columnId, id);
    refreshColumnRender();
    hideBlackbox();
}

/**
* to delete a Task from Board - MainArray before it's get sorted.
* to prevent a complete new load from database.
*/
function deleteTaskFromtaskObjects(columnId, id) {
    let pulledID = list[columnId][id]["taskID"];
    for (let i = 0; i < taskObjects.length; i++) {
        if (pulledID == taskObjects[i]["taskID"]) {
            taskObjects.splice(i, 1);
        }
    }
}

/**
*  Loads tasks from backend API with fallback to localStorage
*/
async function baordLoadTasks() {
    taskObjects = [];
    try {
        // Get tasks from API using our updated loadAllTasks function
        const loadedTasks = await loadAllTasks();
        
        if (Array.isArray(loadedTasks)) {
            taskObjects = [...loadedTasks];
        } else {
            console.error("Invalid response format from loadAllTasks");
            // Fallback to localStorage
            loadTasksFromLocalStorage();
        }
        
        // Ensure each task has an assignedTo array
        taskObjects.forEach(task => {
            if (!task.assignedTo || !Array.isArray(task.assignedTo)) {
                task.assignedTo = [];
            }
        });
        
    } catch (error) {
        console.error("Error loading tasks:", error);
        // Fallback to localStorage
        loadTasksFromLocalStorage();
    }
}

/**
* Fallback to load tasks from localStorage
*/
function loadTasksFromLocalStorage() {
    const localTasks = localStorage.getItem('tasks');
    if (localTasks) {
        taskObjects = JSON.parse(localTasks);
    }
}

/**
*  Checks the Url to fetch a Task by Id
*  After receiving a 'taskID' it is lookig for a task which contains the same id.
*  if foundet it will highlighting the following task - by using the search() function
*/
function checkUrlFeature() {
    let arrayUrl = new URLSearchParams(window.location.search);
    let value = arrayUrl.get("findtaskbyid");
    if (value) {
        search(value);
    } else {
        value = false
    }
    return value;
}

/**
*  deleting all content iside all columns.
*  Mostly used for refreshing the site and make sure nothing is rendering two or more times.
*/
function cleanAllColums() {
    let mobilDragzon = document.querySelectorAll("[drag-zone-mobil]");
    let content = document.querySelectorAll("[is-Column]");
    for (let i = 0; i < content.length; i++) {
        content[i].innerHTML = "";
    }
    for (let i = 0; i < mobilDragzon.length; i++) {
        mobilDragzon[i].remove();
    }
}

/**
*  to make sure all arrays are empty.
*  Mostly used for refreshing the site and make sure nothing is rendering two or more times.
*/
function emptyAllTasks() {
    toDo = [];
    inProgress = [];
    awaitFeedback = [];
    isDone = [];
}

/**
*  Sorts all task to columns
*  The value of 'currentProgress' decides a task in which column it belongs to.
*/
function sortLoadetTasks() {
    emptyAllTasks();
    for (let i = 0; i < taskObjects.length; i++) {
        if (taskObjects[i]["currentProgress"] == 1) {
            inProgress.push(taskObjects[i]);
        } else if (taskObjects[i]["currentProgress"] == 2) {
            awaitFeedback.push(taskObjects[i]);
        } else if (taskObjects[i]["currentProgress"] == 3) {
            isDone.push(taskObjects[i]);
        } else {
            toDo.push(taskObjects[i]);
        }
    }
    list = [toDo, inProgress, awaitFeedback, isDone];
}

/**
* In case there is no task in a column. it's render a banner/card to inform the user.
* this funcrtion checks if a column contains a task, otherwise renderNoCard() will render a banner/card.
*/
function checkForCard() {
    for (let i = 0; i < list.length; i++) {
        if (list[i].length > 0) {
            for (let e = 0; e < list[i].length; e++) {
                initRenderCard(i, e);
            }
        } else {
            renderNoCard(i);
        }
    }
}

/**
* renders a banner/card to inform the user. that the current column doesn't contain any task. 
* @param {number} index - received by checkForCard() - declares which column contains no task.
*/
function renderNoCard(index) {
    let text = ["in Todo", "in Progress", "awaits Feedback", "is Done"]
    let columns = document.querySelectorAll("[is-Column]");
    columns[index].innerHTML = `<div is-No-card class="no-card class_show">No Task ${text[index]}</div>`;
}

/**
* looking for all columns in board write the current task into it.
*/
function initRenderCard(columnId, id) {
    let columns = document.querySelectorAll("[is-Column]");
    columns[columnId].innerHTML += templateCard(columnId, id);
}

/**
* for refreshing the rendering in board
*/
function refreshColumnRender() {
    sortLoadetTasks();
    cleanAllColums();
    checkForCard();
    showNoCard(true);
    initDropZone();
    showDropZone(0, true, false);
}

/**
* value - returns a {number} in percent of the current progress of finished/unfinished Subtasks.
*/
function returnProgressbar(columnNumber, id) {
    let numbTaskDone = checkSubtaskdone(columnNumber, id);
    let numbTotalTask = list[columnNumber][id]["subtasks"].length;
    let value = Math.round(100 / numbTotalTask * numbTaskDone);
    return value;
}

/**
* iterate though all subtasks to check is task is already done.
* value - returns a {number} of the current progress of all finished subtasks.
*/
function checkSubtaskdone(columnNumber, id) {
    let value = 0;
    let object = list[columnNumber][id]["subtasks"];
    for (let i = 0; i < object.length; i++) {
        if (object[i]["done"] == true) {
            value += 1;
        }
    }
    return value;
}

/**
* checks the category of a task to render the right tag inside a card
* Tags are declares by CSS-class - for getting a color 'values[0]' and text/content 'values[1]'
* - which it gets received by checkCategoryType().
*/
function generateCategory(columnNumber, id) {
    let category = list[columnNumber][id]["category"]
    let values = checkCategoryType(category);
    return `<div class="tag ${values[0]}">${values[1]}</div>`
}

/**
* Filter-Function to sort a category to a color and text.
* @param {string} category - contains the name of the category.
* Tags are declares by CSS-class - for getting a color 'array[1]' and text/content 'array[2]'
* in any case, there is no category found - is will be set a grey tag with 'No Category' for a fallback.
*/
function checkCategoryType(category) {
    let categoryColor = "grey";
    let text = "No Category";
    let array = [];
    switch (category) {
        case "technicalTask": categoryColor = "turquoise", text = "Technical Task"; break;
        case "userStory": categoryColor = "blue", text = "User Story"; break;
        case "bug": categoryColor = "raspberry", text = "Bug"; break;
        case "feature": categoryColor = "yellow", text = "Feature"; break;
        case "refactor": categoryColor = "peach", text = "Refactor"; break;
        case "documentation": categoryColor = "pruple", text = "Dokumentationy"; break;
        case "Testing": categoryColor = "green", text = "Testing QA"; break;
        case "Analysis": categoryColor = "darkCyan", text = "Analysis/Research"; break;
        case "Design": categoryColor = "rose", text = "Design"; break;
        case "todo": categoryColor = "blue", text = "To Do"; break;
        case "inprogress": categoryColor = "yellow", text = "In Progress"; break;
        case "done": categoryColor = "green", text = "Done"; break;
        default: color = categoryColor = "grey", text = "No Category";
    }
    array = [categoryColor, text]
    return array
}

/**
* set the right picture for priority of a task.
*/
function setPriorityImage(columnNumber, id) {
    let imageArray = ["../img/icons/empty-icon.svg", "../img/icons/urgent-icon.svg", "../img/icons/medium-icon.svg", "../img/icons/low-icon.svg"];
    let priority = list[columnNumber][id]["priority"];
    let value = 0;
    if (priority == "low") {
        value = 3;
    } else if (priority == "urgent") {
        value = 1;
    }
    else if (priority == "medium") {
        value = 2;
    }
    return imageArray[value]
}

/**
* initSearch() is needet to check for a min-length of 3 characters in your keyword.
* It also send a error if a User pressed the Searchbutton, to inform him to type min. 3 characters in Searchbar.
* @param {booleans} clickedButton - describes if a user has clicked the button.
*/
function initSearch(clickedButton = false) {
    delerror();
    parentId = document.getElementById("search").parentElement;
    let searchValue = document.getElementById("search").value;
    if (searchValue.length >= 3) {
        search(searchValue);
    } else if (searchValue.length <= 3 && clickedButton) {
        seterror(parentId, "Min. 3 or more characters are necessary.");
    } else if (searchValue.length <= 3 && !clickedButton) {
        search("", 0);
    }
}

/**
* The actual Searchfunction to search a specific task.
* @param {string} searchValue - Your keyword for your search
* @param {number} search() is abale to find your task and hightlighting it (modus = 0)
*                or returs the current coordinates of your task inside of 'list'. (modus = 1)
*/
function search(searchValue, modus = 0) {
    let keySoup = result = ""
    for (let i = 0; i < list.length; i++) {
        if (list[i].length > 0) {
            for (let x = 0; x < list[i].length; x++) {
                keySoup = keysfromCardForSearch(i, x);
                ProcessWithTask(i, x, false, 0)
                if (keySoup.includes(searchValue.toLowerCase()) || list[i][x]["taskID"] == searchValue) {
                    result = ProcessWithTask(i, x, true, modus);
                }
            }
        }
    }
}

/**
* to search inside 'title' and 'description' and maybe later more - it get mixed into a "Soup" - full of all informations to search() for
*/
function keysfromCardForSearch(columnNumber, id) {
    let keySoup = "";
    keySoup += list[columnNumber][id]["title"].toLowerCase();
    keySoup += " " + list[columnNumber][id]["description"].toLowerCase();
    return keySoup;
}

/**
* After looking for a search. ProcessWithTask() decides which task will gets highlighted and which one gets transparent.
* in addition the modus = 1 returns the current coordinates of your task.
* @param {boolean} wasfound =  was a task getting found by search() the value gets true otherwise it will be false.
* @param {number} modus = received by search(). Possible to be 0 or 1. Usually the value is 0 and doesn't return the current coordinates.
*/
function ProcessWithTask(columnId, id, wasfound = false, modus = 0) {
    if (!modus && !wasfound) {
        toogleTransparents(columnId, id, true);
    } else if (!modus && wasfound) {
        toogleTransparents(columnId, id, false);
    } else if (modus = 1 && wasfound) {
        return [columnId, id];
    }
}

/**
* The following task gets transparent if serach() doesn't find the current task.
* @param {boolean} setAllOn - Task is getting 'addTransparent' class to get transparent.
*/
function toogleTransparents(columnId, id, setAllOn) {
    element = document.getElementById(`ColumnNumb-${columnId}_Id-${id}`);
    if (!setAllOn) {
        element.classList.remove("addTransparent");
    } else {
        element.classList.add("addTransparent");
    }
}