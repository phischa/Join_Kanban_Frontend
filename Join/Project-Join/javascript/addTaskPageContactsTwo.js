/**
 * function renders the nameSymbols in the expanded assigendTo select Menu
 */
function renderCanvases() {
  let canvases = document.getElementsByClassName("dropdownMenuCanvas");

  for (let i = 0; i < canvases.length; i++) {
    let canvas = canvases[i];
    id = canvas.id;

    let contact = getContactFromID(id);

    drawColoredCircle(contact.color, contact.initials, id);
  }
}

/**
 * function renders the nameSymbols in the field on the page, where
 * the namesymbols are shown to represent the assigend contacts
 */
function renderCanvasesInAssignedToRenderArea() {
  let canvases = document.getElementsByClassName("canvasInRenderArea");

  for (let i = 0; i < canvases.length; i++) {
    let canvas = canvases[i];
    id = canvas.id;
    if (canvas.id != "moreContacts") {
      let contactId = id.slice(1);
      let contact = getContactFromID(contactId);
      drawColoredCircle(contact.color, contact.initials, id);
    } else {
      renderMoreContacts();
    }
  }
}

/**
 * function renders the field on the page, where the namesymbols
 * of the assigned Contacts need to appear by constructing canvasses there
 */
function renderAssignedToRenderArea() {
  let amount;
  area = document.getElementById("assignedContactsRenderArea");
  area.innerHTML = "";
  if (assignedContacts.length >= 5) {
    amount = 5;
  } else {
    amount = assignedContacts.length;
  }
  for (let i = 0; i < amount; i++) {
    area.innerHTML += assignedToRenderAreaHTML(i);
  }
  if (assignedContacts.length > 5) {
    area.innerHTML += moreContactsHTML();
  }
  renderCanvasesInAssignedToRenderArea();
}

/**
 * function renders the specialcanvas that indicates that more contacts
 * are assigned then are shown by the namesymbols
 */
function renderMoreContacts() {
  let number = assignedContacts.length - 5;
  number = `+${number.toString()}`;
  drawColoredCircle("#25C0D4", number, "moreContacts");
}

/**
 * html code for constructing a canvas for the symbol that indivates that more
 * contacts are assigned than are shown
 * @returns {String} -HTML CODE
 */
function moreContactsHTML() {
  return `
  <canvas class="canvasInRenderArea" width="48" height="48" id="moreContacts"></canvas>
  `;
}

/**
 * html Code for constructing a canvas for the namesymbol of an assigend Contact in the
 * area where assigend Contacts are shown by their namesymbol
 * @param {Number} i - index in the array
 * @returns {String} - HTML CODE
 */
function assignedToRenderAreaHTML(i) {
  return `
        <canvas class="canvasInRenderArea" width="48" height="48" id="R${assignedContacts[i].contactID}"></canvas>
    `;
}

/**
 * functions renders the unfiltered select Menu of Contacts
 */
function renderAssignedToMenu() {
  let menu = document.getElementById("checkboxes");
  checkForImage(menu);
  renderAssignedToRenderArea();
  renderCanvases();
  renderCanvasesInAssignedToRenderArea();
}

function checkForImage(element){
  element.innerHTML = "";
  let checkIMG = "";
  for (let i = 0; i < contactsOfAddPage.length; i++) {
    if (isAdded(contactsOfAddPage[i].contactID) > -1) {
      checkIMG = "check-button-mobile-check.svg";
    } else {
      checkIMG = "check-button-mobile-uncheck.svg";
    }
    element.innerHTML += getOptionRowHTML(i, checkIMG);
  }
}

/**
 * html code for an unfiltered row in the expanded select Contacts Menu
 * @param {Number} i - index in the array
 * @param {String} checkIMG - name of the image that should be shown as checked or unchecked
 * @returns {String} - HTML CODE
 */
function getOptionRowHTML(i, checkIMG) {
  return ` 
    
     <label class="optionRow" for="one" id="label${contactsOfAddPage[i].contactID}" 
     onclick="addToRemoveFromTask('${contactsOfAddPage[i].contactID}')">
         <canvas class="dropdownMenuCanvas" width="48" height="48" id="${contactsOfAddPage[i].contactID}"></canvas>
         <div class="boxNameAndSelect">
             ${contactsOfAddPage[i].name}
             <img src="../img/icons/${checkIMG}" id="four" />
         </div>
     </label>
 
 
 `;
}

/**
 * html code for the filtered row in the expande selectContacts Menu when
 * no conbtact is found that fits the search parameter.
 * @returns {String} - HTML CODE
 */
function noContactHTML() {
  return `
  <div id="noContactText">
     No contacts found for this search parameter.
  </div>
  `;
}