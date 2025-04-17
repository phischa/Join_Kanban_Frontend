let priority = "none";
currentColumn = 0;

/**
 * loads executes Functions that are needed upfront.
 */
async function onload() {
  setMinDate();
  loadTasks();
  loadUsers();
  await loadUserContactsIfAvailable();
  //await loadActualUser();
  //await initialsOf();
  /* pressMediumButton(); */
  addContactsToPage();
  CheckforUnclosedWindows();
  checkRequirementsMouseover();
  CheckMouseoutCreateTask();
  stopSubtaskPropagation();
  stopPropagationContacts();
  currentColumn = 0;
}


/**
 * ------------------ min date ----------------
 * functions prevents that a user can set a due date in the past.
 */
function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("ldatename").setAttribute("min", today);
}

/**
 * -------  Hover over disabled CreateTaskButton results in red border for required -------
 * checks if the form requirements are fullfilled every time the duetate is changed
 * 
*/
function checkRequirementsDuetate() {
  document
    .getElementById("ldatename")
    .addEventListener("change", function (event) {
      checkCreateTask();
    });
}

/**
 * marks the missing required fields red when mouse hovers over createTaskButton
*/
function checkRequirementsMouseover() {
  document
    .getElementById("createTaskButton")
    .addEventListener("mouseover", function (event) {
      let title = document.getElementById("ltitlename");
      let date = document.getElementById("ldatename");
      let category = document.getElementById("lcategoryname");
      let text = document.getElementById("requiredText");

      requiredTitle();
      requiredDate();
      requiredCategory();

      if (title.value == "" || !date.value || !category.selectedIndex > 0) {
        text.style.border = "2px solid red";
      }
    });
}

/**
 * unmarks the missing required fields when mouse leaves createTaskButton
*/
function CheckMouseoutCreateTask() {
  document
    .getElementById("createTaskButton")
    .addEventListener("mouseout", function (event) {
      let text = document.getElementById("requiredText");

      requiredTitleNorm();
      requiredDateNorm();
      requiredCategoryNorm();

      if (text.style.border == "2px solid red") {
        text.style.border = "";
      }
    });
}
/**
 * marks title red if unfilled
 */
function requiredTitle() {
  let title = document.getElementById("ltitlename");

  if (title.value == "") {
    title.style.border = "2px solid red";
    title.style.padding = "1px 15px 1px 15px";
  }
}

/**
 * unmarks title red if marked
 */
function requiredTitleNorm() {
  let title = document.getElementById("ltitlename");
  if (title.style.border == "2px solid red") {
    title.style.border = "0.063rem solid #D1D1D1";
    title.style.padding = "2px 16px 2px 16px";
  }
}

/**
 * marks date red if unfilled
 */
function requiredDate() {
  let date = document.getElementById("ldatename");
  if (!date.value) {
    date.style.border = "2px solid red";
    date.style.padding = "1px 15px 1px 15px";
  }
}

/**
 * unmarks date if marked
 */
function requiredDateNorm() {
  let date = document.getElementById("ldatename");
  if (date.style.border == "2px solid red") {
    date.style.border = "0.063rem solid #D1D1D1";
    date.style.padding = "2px 16px 2px 16px";
  }
}

/**
 * marks category if unfilled
 */
function requiredCategory() {
  let category = document.getElementById("lcategoryname");
  if (!category.selectedIndex > 0) {
    category.style.border = "2px solid red";
    category.style.padding = "1px 15px 1px 15px";
  }
}

/**
 * unmarks category if marked
 */
function requiredCategoryNorm() {
  let category = document.getElementById("lcategoryname");
  if (category.style.border == "2px solid red") {
    category.style.border = "0.063rem solid #D1D1D1";
    category.style.padding = "2px 16px 2px 16px";
  }
}

/*
 * checks for a menu that is already open.
*/
function CheckforUnclosedWindows() {
  document.addEventListener("click", unclosedWindowsEvent);
  document.addEventListener("keyup", alreadyCheckeCreateTask);
}

/*
 * closes open select menues when a click outside of the menus occurs
*/
function unclosedWindowsEvent(event) {
  let targetElement = event.target;
  renderAssignedToRenderArea();
  checkCreateTask();
  checkAssignedEventArea(targetElement);
  checkCategoryEventArea(targetElement);
  checkSubtaskEventArea(targetElement);
}

//-------Funktionen zum Disablen des createTaskButtons
// after every letting a key go it is checked whether the createTaskButton needs to be disbaled

function alreadyCheckeCreateTask(event) {
  checkCreateTask();
}

/**
 * disabled or enables the createTaskButton depending on the inputstate of the required fields
 */

function checkCreateTask() {
  if (
    document.getElementById("ltitlename").value.length >= 1 &&
    document.getElementById("ldatename").value &&
    document.getElementById("lcategoryname").selectedIndex > 0
  ) {
    document.getElementById("createTaskButton").disabled = false;
    document
      .getElementById("createTaskButton")
      .classList.add("button-createtask");
  } else {
    document.getElementById("createTaskButton").disabled = true;
    document
      .getElementById("createTaskButton")
      .classList.remove("button-createtask");
  }
}

/**
 * clears the addTaskPage-Form
 */
function clearForm() {
  document.getElementById("ldescriptionname").value = "";
  assignedContacts = [];
  document.getElementById("ldatename").value = "";
  uncheckprio();
  /* pressMediumButton(); */
  document.getElementById("lcategoryname").value = "Select task category";
  clearSubtaskInput();
  subtasksOfAddPage = [];
  renderSubtaskArea();
  actualSubtaskOfAddPage = null;
}

/**
 * Collects all task data from the form
 * @returns {Object} - Task data object
 */
function collectTaskData() {
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
 * Cleans up the form after successful task creation
 */
function cleanupTaskForm() {
  const title = document.getElementById("ltitlename");
  clearRenderArea();
  title.value = title.defaultValue;
  clearForm();
  showModal();
}

/**
 * Handles errors when saving a task
 * @param {Object} error - Error object
 */
function handleTaskSaveError(error) {
  console.error("Failed to save task:", error);
  
  // Mehr Details anzeigen
  if (error.message) {
    console.error("Error message:", error.message);
  }
  
  // Falls der Server eine detaillierte Antwort sendet
  if (error.response) {
    console.error("Server response:", error.response);
  }
  
  const message = error.message || "Unknown error";
  //alert("Task could not be saved: " + message);
}

/**
 * Saves the task and shows feedback
 * @param {Object} taskData - Task data
 * @returns {Promise<void>}
 */
async function saveTaskAndRedirect(taskData) {
  try {
    const newTask = createTask(
      taskData.title, taskData.description, taskData.assignedTo,
      taskData.dueDate, taskData.prio, taskData.category, taskData.subtasks
    );

    const response = await storeTask(newTask);
    if (response.status === "success") {
      cleanupTaskForm();
      setTimeout(goToBoard, 500);
    } else {
      handleTaskSaveError(response);
    }
  } catch (error) {
    handleTaskSaveError(error);
  }
}

/**
 * Creates and saves a task from form data
 * @returns {Promise<void>}
 */
async function submitTask() {
  const taskData = collectTaskData();
  await saveTaskAndRedirect(taskData);
}

/**
 * redirects to board page
 */
function goToBoard() {
  window.location.href = "board.html";
}

//------ Modal Functions

/**
 * shows the modal
 */
function showModal() {
  modal = document.getElementById("modalConfirmTaskCreated");
  modal.style.display = "flex";
}

//---------- Functions for Setting Priority

/**
 * pressing the button results in marking itself if unmarked, unmarking
 * itself if marked, and unmarking other buttons if they are marked
 */
function pressUrgentButton() {
  if (priority == "none") {
    markUrgent();
    priority = "urgent";
  } else if (priority == "urgent") {
    unmarkUrgent();
    priority = "none";
  } else if (priority != "none") {
    unmarkLow();
    unmarkMedium();
    markUrgent();
    priority = "urgent";
  }
}

/**
 * pressing the button results in marking itself if unmarked, unmarking
 * itself if marked, and unmarking other buttons if they are marked
 */
function pressMediumButton() {
  if (priority == "none") {
    markMedium();
    priority = "medium";
  } else if (priority == "medium") {
    unmarkMedium();
    priority = "none";
  } else if (priority != "none") {
    markMedium();
    unmarkLow();
    unmarkUrgent();
    priority = "medium";
  }
}

/**
 * pressing the button results in marking itself if unmarked, unmarking
 * itself if marked, and unmarking other buttons if they are marked
 */
function pressLowButton() {
  if (priority == "none") {
    markLow();
    priority = "low";
  } else if (priority == "low") {
    unmarkLow();
    priority = "none";
  } else if (priority != "none") {
    unmarkMedium();
    markLow();
    unmarkUrgent();
    priority = "low";
  }
}

/**
 * mark the button
 */
function markUrgent() {
  document.getElementById("urgentButton").classList.add("urgentButtonPressed");
  document.getElementById("urgentButtonImage").src =
    "../img/icons/urgent-icon-white.svg";
}

/**
 * unmark the button
 */
function unmarkUrgent() {
  document
    .getElementById("urgentButton")
    .classList.remove("urgentButtonPressed");
  document.getElementById("urgentButtonImage").src =
    "../img/icons/urgent-icon.svg";
}

/**
 * mark the button
 */
function markMedium() {
  document.getElementById("mediumButton").classList.add("mediumButtonPressed");
  document.getElementById("mediumButtonImage").src =
    "../img/icons/priority-medium-white.svg";
}

/**
 * unmark the button
 */
function unmarkMedium() {
  document
    .getElementById("mediumButton")
    .classList.remove("mediumButtonPressed");
  document.getElementById("mediumButtonImage").src =
    "../img/icons/priority-medium.svg";
}

/**
 * mark the button
 */
function markLow() {
  document.getElementById("lowButton").classList.add("lowButtonPressed");
  document.getElementById("lowButtonImage").src =
    "../img/icons/low-icon-white.svg";
}

/**
 * unmark the button
 */
function unmarkLow() {
  document.getElementById("lowButton").classList.remove("lowButtonPressed");
  document.getElementById("lowButtonImage").src = "../img/icons/low-icon.svg";
}

/**
 * in case scenario is needed where no priority button is marked
 */
function uncheckprio() {
  unmarkLow();
  unmarkMedium();
  unmarkUrgent();
  priority = "none";
}