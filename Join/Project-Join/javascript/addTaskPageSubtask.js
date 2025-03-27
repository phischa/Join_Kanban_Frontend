let subtasksOfAddPage = [];
let finalSubtasksOfAddPage = [];
let actualSubtaskOfAddPage;
let isAddSubtaskActive = false;


/**
 * function sets the optical Focus on the artifical Subtask InputField
 */
function focusSubtaskInput() {
  document.getElementById("subTaskInputField").style.border =
    "2px solid #25C0D4";
}

/**
 * function removes the optical Focus of the artifical Subtask InputField
 */
function blurSubtaskInput() {
  document.getElementById("subTaskInputField").style.border =
    "0.063rem solid #D1D1D1";
}

/**
 * function sets the optical Focus on the artifical Subtask Edit Field
 */
function focusSubtaskEdit(index) {
  document.getElementById(`subtaskRenderAreaRow${index}`).style.borderBottom =
    "1px solid #25C0D4";
}

/**
 * function removes the optical Focus on the artifical Subtask Edit Field
 */
function blurSubtaskEdit(index) {
  document.getElementById(`subtaskRenderAreaRow${index}`).style.borderBottom =
    "";
}

//

/**
 * function handles the passage from EditSubtask View to ShowSubtaks View for the already
 * added subtasks
 * @param {number} index
 */
function changeEditSubTaskToShowSubtask(index) {
  document.getElementById(`subtaskRenderAreaRowIcons${index}`).classList.remove("noDisplay");
  document.getElementById(`editSubTaskItem${index}`).classList.remove("noDisplay");
  document.getElementById(`deleteSubTaskItem${index}`).classList.remove("noDisplay");
  document.getElementById(`dividerEditSubtask${index}`).classList.remove("noDisplay");
  document.getElementById(`bulletpoint${index}`).classList.remove("noDisplay");
  document.getElementById(`subTaskContentContent${index}`).classList.remove("noDisplay");
  document.getElementById(`subtaskRenderAreaRowIconsForEdit${index}`).classList.add("noDisplay");
  document.getElementById(`confirmChange${index}`).classList.add("noDisplay");
  document.getElementById(`cancelChange${index}`).classList.add("noDisplay");
  document.getElementById(`dividerChanges${index}`).classList.add("noDisplay");
}

/**
 * function handles the passage from ShowSubtask View to EditSubtask View for
 * the already added subtasks
 * @param {Number} index
 */
function changeShowSubtaskToEditSubtask(index) {
  document
    .getElementById(`subtaskRenderAreaRowIcons${index}`)
    .classList.add("noDisplay");
  document.getElementById(`editSubTaskItem${index}`).classList.add("noDisplay");
  document
    .getElementById(`deleteSubTaskItem${index}`)
    .classList.add("noDisplay");
  document
    .getElementById(`dividerEditSubtask${index}`)
    .classList.add("noDisplay");
  document
    .getElementById(`subtaskRenderAreaRowIconsForEdit${index}`)
    .classList.remove("noDisplay");
  document
    .getElementById(`confirmChange${index}`)
    .classList.remove("noDisplay");
  document.getElementById(`cancelChange${index}`).classList.remove("noDisplay");
  document
    .getElementById(`dividerChanges${index}`)
    .classList.remove("noDisplay");
}

/**
 * function handles the passage from addSubtask view to ConfirmOrCancel View where the
 * user is actually able to type in a subtask
 */
function changeAddToConfirmOrCancelInSubtask() {
  document.getElementById("addButton").classList.add("noDisplay");
  document.getElementById("addButtonIcon").classList.add("noDisplay");
  document
    .getElementById("CancelAndOkButtonArea")
    .classList.remove("noDisplay");
  document.getElementById("cancelButton").classList.remove("noDisplay");
  document.getElementById("cancelIcon").classList.remove("noDisplay");
  document.getElementById("checkIcon").classList.remove("noDisplay");
  document.getElementById("okButton").classList.remove("noDisplay");
}

/**
 * function handles the passage from the ConfirmOrCancel View where the
 * user is actually able to type in a subtask to the addSubtask View
 */
function changeConfirmOrCancelToAddInSubtask() {
  document.getElementById("addButton").classList.remove("noDisplay");
  document.getElementById("addButtonIcon").classList.remove("noDisplay");
  document.getElementById("CancelAndOkButtonArea").classList.add("noDisplay");
  document.getElementById("cancelButton").classList.add("noDisplay");
  document.getElementById("cancelIcon").classList.add("noDisplay");
  document.getElementById("okButton").classList.add("noDisplay");
  document.getElementById("checkIcon").classList.add("noDisplay");
}


/**
 * handles end of subtask add typing with enter-key instead of click on confirm button
*/
function stopSubtaskPropagation(){
  stopPropagationSubtaskName();
  stopPropagationTaskName();
  stopPropagationOkButton();
  stopPropagationCancelButton();
  stopPropagationAddButton();
}

/**
 * handles end of subtask add typing with enter-key instead of click on confirm button
*/
function stopPropagationSubtaskName(){
  document
    .getElementById("lsubtaskname")
    .addEventListener("keydown", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();
        pressConfirmSubtaskButton();
      }
    });
}

function stopPropagationTaskName(){
  document
    .getElementById("lsubtaskname")
    .addEventListener("click", function (event) {
      event.stopPropagation();
    });
}

function stopPropagationOkButton(){
  document.getElementById("okButton").addEventListener("click", function (event) {
    event.stopPropagation();
  });
}

function stopPropagationCancelButton(){
  document
    .getElementById("cancelButton")
    .addEventListener("click", function (event) {
      event.stopPropagation();
    });
}

function stopPropagationAddButton(){
  document
    .getElementById("addButton")
    .addEventListener("click", function (event) {
      event.stopPropagation();
    });
}


/**
 * functions resets subtaskInputField when outside said field is clicked
 * @param {Event} targetElement - mouseclick auf addTaskPage
 */
function checkSubtaskEventArea(targetElement) {
  let subtaskInput = document.getElementById("subTaskInputField");

  if (!subtaskInput.contains(targetElement)) {
    changeConfirmOrCancelToAddInSubtask();
    document.getElementById("lsubtaskname").value = "";
    isAddSubtaskActive = false;
  }
}

/**
 * function finalizes the subtasks by adding them to an array with all
 * the necessary Information, ready to attach them to the task data structure.
 */
function finalizeSubtasks() {
  for (let i = 0; i < subtasksOfAddPage.length; i++) {
    finalSubtasksOfAddPage.push(createSubtask(subtasksOfAddPage[i]));
  }
}

/**
 * function handles the confirmation that the changes in a subtask by editing
 * should be accepted
 * @param {Number} index
 */
function confirmChange(index) {
  let input = document.getElementById(`editSubTaskField${index}`);
  subtasksOfAddPage[index] = input.value;
  input.value = "";
  input.classList.add("noDisplay");
  document.getElementById(
    `subTaskContent${index}`
  ).innerHTML = `<img class="bulletpoint" id="bulletpoint${index}" src="../img/icons/bulletpoint.svg"></img> <div class="subTaskContentContent" id="subTaskContentContent${index}"> ${subtasksOfAddPage[index]}</div>`;
  document
    .getElementById(`subTaskContent${index}`)
    .classList.remove("noDisplay");
  changeEditSubTaskToShowSubtask(index);
  document
    .getElementById(`subtaskRenderAreaRow${index}`)
    .classList.remove("lightBackground");
}

/**
 * function handles that the changes in a subtasj by editing should not be
 * accepted
 * @param {Number} index
 */
function cancelChange(index) {
  let input = document.getElementById(`editSubTaskField${index}`);
  input.value = "";
  input.classList.add("noDisplay");
  document
    .getElementById(`subTaskContent${index}`)
    .classList.remove("noDisplay");
  changeEditSubTaskToShowSubtask(index);
  document
    .getElementById(`subtaskRenderAreaRow${index}`)
    .classList.remove("lightBackground");
}

/**
 * functions handles the deletion of a subtask
 * @param {Number} index
 */
function clickDeleteSubTaskItem(index) {
  subtasksOfAddPage.splice(index, 1);
  renderSubtaskArea();
}

/**
 * functions handles that a subtask should be edited
 * @param {Number} index
 */
function clickEditSubTaskItem(index) {
  let input = document.getElementById(`editSubTaskField${index}`);
  input.value = subtasksOfAddPage[index];
  input.classList.remove("noDisplay");
  document.getElementById(`subTaskContent${index}`).classList.add("noDisplay");
  document.getElementById(`bulletpoint${index}`).classList.add("noDisplay");
  document
    .getElementById(`subTaskContentContent${index}`)
    .classList.add("noDisplay");
  changeShowSubtaskToEditSubtask(index);
  document
    .getElementById(`subtaskRenderAreaRow${index}`)
    .classList.add("lightBackground");
  input.focus();
}

function decideAddSubTaskEditClick() {
  if (isAddSubtaskActive) {
    pressCancelSubtaskButton();
  } else {
    pressAddSubtaskButton();
  }
}

/**
 * function handles that a subtask on the page is about to be typed in
 */
function pressAddSubtaskButton() {
  if (!isAddSubtaskActive) {
    changeAddToConfirmOrCancelInSubtask();
    clearSubtaskInput();
    let input = document.getElementById("lsubtaskname");
    input.focus();
    isAddSubtaskActive = true;
  }
}

/**
 * functions handles that a typed in subtask is now added
 */
function pressConfirmSubtaskButton() {
  if (document.getElementById("lsubtaskname").value != "") {
    subtasksOfAddPage.push(document.getElementById("lsubtaskname").value);
    document.getElementById("lsubtaskname").focus();
    clearSubtaskInput();
    renderSubtaskArea();
    isAddSubtaskActive = false;
  } else {
    pressCancelSubtaskButton();
  }
}

/**
 * function handles that the typed in subtask is discarded
 */
function pressCancelSubtaskButton() {
  changeConfirmOrCancelToAddInSubtask();
  clearSubtaskInput();
  isAddSubtaskActive = false;
}

/**
 * function clears the inputfield of the subtask Menu
 */
function clearSubtaskInput() {
  document.getElementById("lsubtaskname").value = "";
}



/**
 * function renders the area where all the added subtasks are schown
 */
function renderSubtaskArea() {
  content = document.getElementById("subtaskRenderAreaList");
  content.innerHTML = "";
  for (let i = 0; i < subtasksOfAddPage.length; i++) {
    content.innerHTML += subtaskHTML(i);
  }
}

/**
 * function needed for resetting the form
 */
function clearRenderArea() {
  content = document.getElementById("subtaskRenderAreaList");
  content.innerHTML = "";
}

/**
 * HTML Code for the Row in which a subtask is rendered in. Complete
 * with all related custom edit and delete menus.
 * @param {Number} index
 * @returns {String} - HTML CODE
 */

function subtaskHTML(index) {
  return `
    <div class="subtaskRenderAreaRow" id="subtaskRenderAreaRow${index}"> 
        
        <div class="subTaskContent" id="subTaskContent${index}">
        <img class="bulletpoint" id="bulletpoint${index}" src="../img/icons/bulletpoint.svg">
        <div class="subTaskContentContent" id="subTaskContentContent${index}"> ${subtasksOfAddPage[index]}</div>
        </div>
        <input id="editSubTaskField${index}" onfocus="focusSubtaskEdit(${index})" onblur="blurSubtaskEdit(${index})" class="noDisplay editSubtaskInput">  
        <div>
            <div class="subtaskRenderAreaRowIcons" id="subtaskRenderAreaRowIcons${index}">
                <div id="editSubTaskItem${index}" onclick="clickEditSubTaskItem(${index})" class="editSubTask" > 
                <img src="../img/icons/edit-black.svg">  
                </div>
                <div id="dividerEditSubtask${index}"> | </div>
                <div id="deleteSubTaskItem${index}" onclick="clickDeleteSubTaskItem(${index})" class="deleteSubTask" >
                <img src="../img/icons/delete.svg"> 
                </div>
            </div>
            <div class="subtaskRenderAreaRowIconsForEdit noDisplay" id="subtaskRenderAreaRowIconsForEdit${index}">
                <div id="cancelChange${index}" onclick="cancelChange(${index})"class ="cancelChange noDisplay">
                <img src="../img/icons/delete.svg">
                </div>
                <div id="dividerChanges${index}" class="noDisplay"> | </div>
                <div id="confirmChange${index}" onclick="confirmChange(${index})"class="confirmChange noDisplay">
                <img src="../img/icons/check-icon-adTask_black.svg">
                </div>
            </div>
        </div>
    </div>
    `;
}
