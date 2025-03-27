let contactsOfAddPage = [];
let assignedContacts = [];
let filteredContacts = [];

let inputFeld = document.getElementById("inputfeld");
let expanded = false;

/**
 * stops closing the Menu by clicking or pressing a key inside the current Menu and will close all Menus that are already open.
*/
function stopPropagationContacts(){
  stopPropagationMultiSelectContact();
  stopPropagationSelectBox();
  stopPropagationInputFeld();
}

function stopPropagationMultiSelectContact(){
  document
  .getElementById("multiSelectContact")
  .addEventListener("click", function (event) {
    event.stopPropagation();
  });
}

function stopPropagationSelectBox(){
  document
  .getElementById("selectBox")
  .addEventListener("keypress", function (event) {
    event.preventDefault();
  });
}

function stopPropagationInputFeld(){
  inputFeld = document.getElementById("inputfeld");
  inputFeld.addEventListener("keypress", function (e) {
  if (e.key === "Enter" || (e.keyCode || e.which) === 13) e.preventDefault();
  e.stopPropagation();
  });
  inputFeld.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });
}

/**
 * function opens the select Menu of the AssignedToContacts artificial select field
 */
function showCheckboxes() {
  let checkboxes = document.getElementById("checkboxes");
  let searchField = document.getElementById("searchfield");
  let selectField = document.getElementById("selectfield");
  if (!expanded) {
    expandCheckboxes(checkboxes, searchField, selectField);
    renderAssignedToMenu();
    renderAssignedToRenderArea();
  } else {
    contractCheckboxes(checkboxes, searchField, selectField);
    renderAssignedToRenderArea();
  }
}

/**
 * function expands the selectField of AssignToContacts
 * @param {object} checkboxes
 * @param {object} searchField
 * @param {object} selectField
 */
function expandCheckboxes(checkboxes, searchField, selectField) {
  inputFeld = document.getElementById("inputfeld");
  checkboxes.style.display = "flex";
  searchField.style.display = "flex";
  selectField.style.display = "none";
  inputFeld.value = "";
  inputFeld.focus();
  expanded = true;
}

/**
 * function contracts the selectField of AssignToContacts
 * @param {object} checkboxes
 * @param {Object} searchField
 * @param {Object*} selectField
 */
function contractCheckboxes(checkboxes, searchField, selectField) {
  checkboxes.style.display = "none";
  searchField.style.display = "none";
  selectField.style.display = "flex";
  expanded = false;
}

/**
 * sets the optical focus on the artifical AssigendToContacts artificial select field
 */
function multiselectFocus() {
  document.getElementById("selectBox").style.border = "2px solid #25C0D4";
}

/**
 * removes the optical focus on the artifical AssigendToContacts artificial select field
 */
function multiselectBlur() {
  document.getElementById("selectBox").style.border = "0.063rem solid #D1D1D1";
}

/**
 * function closes the assigendToContacts Menu if a
 * click of the mouse outside of that menu is detected.
 * @param {targetElement} targetElement - mouseclick on the addTaskPage
 */

function checkAssignedEventArea(targetElement) {
  let multiSelectContact = document.getElementById("multiSelectContact");
  let checkboxes = document.getElementById("checkboxes");
  let searchField = document.getElementById("searchfield");
  let selectField = document.getElementById("selectfield");

  if (expanded && !multiSelectContact.contains(targetElement)) {
    checkboxes.style.display = "none";
    searchField.style.display = "none";
    selectField.style.display = "flex";
    expanded = false;
  }
}

/**
 * decides if the input requires a filtering
 */
function processInputForFilter() {
  let filterParameter = inputFeld.value;

  if (filterParameter == "") {
    filteredContacts = [];
    renderAssignedToMenu();
    renderAssignedToRenderArea();
  } else {
    filterContacts(filterParameter);
    renderFilteredAssignedToMenu();
    renderAssignedToRenderArea();
  }
}

/**
 * functions gets a String and saves all users which names include that String
 *
 * @param {String} filterParameter - String that to be looked for in the user names
 */
function filterContacts(filterParameter) {
  filterParameter = filterParameter.toLowerCase();
  filteredContacts = [];

  for (let i = 0; i < contactsOfAddPage.length; i++) {
    if (contactsOfAddPage[i].name.toLowerCase().includes(filterParameter)) {
      filteredContacts.push(contactsOfAddPage[i]);
    }
  }
}

/**
 * sorts the contacts alphabetically
 */
function sortContacts() {
  contactsOfAddPage.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  putUserAsFirstContact();
}

/**
 * if a user is lofgged in, he is put as the first Contact and
 * his name is marked with an added (YOU) like Figma wanted it
 */
function putUserAsFirstContact() {
  if (actualUser.userID) {
    let id = actualUser.userID;
    let index;
    let firstContact;
    for (let i = 0; i < contactsOfAddPage.length; i++) {
      if (contactsOfAddPage[i].contactID == id) {
        index = i;
      }
    }
    firstContact = contactsOfAddPage[index];
    firstContact.name = firstContact.name + " (YOU)";
    contactsOfAddPage.splice(index, 1);
    contactsOfAddPage.unshift(firstContact);
  }
}

/**
 * sorts the contacts which are assigned to a task alphabeticly
 */
function sortAssignedContacts() {
  assignedContacts.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1; //
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

/**
 * function copies the contacts from the main contact array to a
 * contact array specific to this page. So that datamanipulation on this
 * page dont impact the rawdata of the whole site in case something
 * goes wrong
 */
function addContactsToPage() {
  for (let i = 0; i < contacts.length; i++) {
    contactsOfAddPage.push(contacts[i]);
  }
  sortContacts();
}

/**
 * function checks if a contact is already Assigned to the Task, by returning
 * the index of the contact in the assigend Array or the standard value for
 * not found
 * @param {String} Id
 * @returns {Number}
 */
function isAdded(Id) {
  for (let i = 0; i < assignedContacts.length; i++) {
    if (assignedContacts[i].contactID == Id) {
      return i;
    }
  }
  return -1;
}

/**
 * function removes a contact with the given ID from the Task
 * @param {String} id
 */
function addToRemoveFromTask(id) {
  let contact = getAddTaskContactFromID(id);

  if (isAdded(id) > -1) {
    let index = isAdded(id);
    assignedContacts.splice(index, 1);
  } else {
    assignedContacts.push(contact);
  }

  sortAssignedContacts();
  processInputForFilter();
  renderAssignedToRenderArea();
}

/**
 * functin is given an ID of a contact on this page and returns the contact-Object, when found.
 * @param {String} id
 * @returns {contact}
 */
function getAddTaskContactFromID(id) {
  for (let i = 0; i < contactsOfAddPage.length; i++) {
    if (contactsOfAddPage[i].contactID == id) {
      return contactsOfAddPage[i];
    }
  }
  return null;
}

/**
 * function renders the expanded select Menu of the Contacts
 * when they are filtered by userInput
 */
function renderFilteredAssignedToMenu() {
  let menu = document.getElementById("checkboxes");
  checkForImageFilter(menu)
  if (filteredContacts.length == 0) {
    menu.innerHTML = noContactHTML();
  }
  renderAssignedToRenderArea();
  renderCanvases();
  renderCanvasesInAssignedToRenderArea();
}

function checkForImageFilter(element){
  element.innerHTML = "";
  let checkIMG = "";
  for (let i = 0; i < filteredContacts.length; i++) {
    if (isAdded(filteredContacts[i].contactID) > -1) {
      checkIMG = "check-button-mobile-check.svg";
    } else {
      checkIMG = "check-button-mobile-uncheck.svg";
    }
    element.innerHTML += getFilterOptionRowHTML(i, checkIMG);
  }
}

/**
 * html code for an filtered row in the expanded select Contacts Menu
 * @param {*} i - index in the array
 * @param {*} checkIMG - name if the image that should be shown as checked or unchecked
 * @returns {String} - HTML CODE
 */
function getFilterOptionRowHTML(i, checkIMG) {
  return ` 
    
     <label class="optionRow" for="one" id="label${filteredContacts[i].contactID}" onclick="addToRemoveFromTask('${filteredContacts[i].contactID}')">
         <canvas class="dropdownMenuCanvas" width="48" height="48" id="${filteredContacts[i].contactID}"></canvas>
         <div class="boxNameAndSelect">
             ${filteredContacts[i].name}
             <img src="../img/icons/${checkIMG}" id="four" />
         </div>
     </label>
 
 
 `;
}


