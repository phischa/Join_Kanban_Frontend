/** 
*  This function opens the window successfully.
*/
function successfulSent() {
    document.getElementById('success-created').classList.remove('d-none');
}

/** 
*  This function closes the window successfully.
*/
function closeSuccessfulSent() {
    document.getElementById('success-created').classList.add('d-none');
}

/** 
*  This function shows the delete function.
*/
function deleteContactOfContactPage() {
    document.getElementById('delete').classList.remove('d-none');
}

/** 
*  This function deletes the selected contact in the storage.
*/
function finallyDeleted(){
    let contactID;
    contactID = contacts[editIndex]['contactID'] + '';

    deleteContact(contactID);
    deletedContactList();
    renderContactList();
    closeDeleteContact();
    closeAddContact();
    document.getElementById('person-card').classList.add('d-none');
    if(screen.width < 1200){
    backToContactList();
    }
}

/** 
*  This function deletes contact list.
*/
function deletedContactList() {
    content = document.getElementById('contact-list');
    content.innerHTML = '';
}

/* 
*   Insert or fade out of the mobile-version
*/
let showContactList = window.matchMedia('(min-width: 1201px)');
showContactList.addEventListener("resize", showAgainContactList);

function showAgainContactList(e) {
    if (e.matches) {
        document.getElementById('width-contact-container').classList.remove('d-none');
        document.getElementById('mobile-edit-delete-c').classList.add('d-none');
        document.getElementById('person-card-mobile').classList.add('d-none');
        document.getElementById('mobile-name').classList.add('d-none');
        document.getElementById('mobile-option').classList.add('d-none');
        document.getElementById('mobile-addcontact').classList.remove('d-none');
        document.getElementById('button-createcontact').style.marginTop = '0';
        document.getElementById('add-contact').style.height = '37rem';
    }
}

/** 
*  If the contact appears in the mobile version, you can push the arrow and go back.
*/
function backToContactList() {
    document.getElementById('width-contact-container').classList.remove('d-none');
    document.getElementById('mobile-option').classList.add('d-none');
    document.getElementById('mobile-addcontact').classList.remove('d-none');
    document.getElementById('person-card-mobile').classList.add('d-none');
}

/** 
*  This function opens the edit delete container.
*/
function openMobileEditDeleteContainer() {
    document.getElementById('mobile-edit-delete-c').classList.remove('d-none');
    document.getElementById('edit-delete-back').classList.remove('d-none');
    document.getElementById('mobile-edit-delete-c').classList.remove('animation-close-edit-delete-window');
    document.getElementById('mobile-edit-delete-c').classList.add('animation-open-edit-delete-window');
}

/** 
*  This function closes the edit delete window. 
*/
function editDeleteBack() {
    document.getElementById('mobile-edit-delete-c').classList.remove('animation-open-edit-delete-window');
    document.getElementById('mobile-edit-delete-c').classList.add('animation-close-edit-delete-window');
    setTimeout(closeEditDeleteWindow, 800);
}

/** 
*  This function closes the edit / delete container. 
*/
function closeEditDeleteWindow() {
    document.getElementById('edit-delete-back').classList.add('d-none');
}

/** 
*  This function closes the delete window.
*/
function closeDeleteContact() {
    document.getElementById('delete').classList.add('d-none');
}

/** 
*  This function add all Listeners for the edit contact window.
*/
function addListenerForEditContact(){
    let statusValidationName = document.getElementById('ltitlename');
    let eventButton = document.getElementById('button-save');
    let allInputFields = [document.getElementById('ltitlename'), document.getElementById('ltitleemail'), document.getElementById('ltitlephone')];

    allInputFields.forEach(listenerInputfield => {
        listenerInputfield.addEventListener("keyup", checkEditContactValidityNameEmailPhone);
    });
    eventButton.addEventListener("mouseover", validityFalseAboveButtonRedBorderEditContact);
    eventButton.addEventListener("mouseout", validityFalseLeaveButtonWhiteBorderEditContact);
    statusValidationName.addEventListener("input", capitalizeFirstLetterInName);
}

/** 
*  This function remove all Listeners for the edit contact window.
*/
function removeListenerForEditContact(){
    let statusValidationName = document.getElementById('ltitlename');
    let eventButton = document.getElementById('button-save');
    let allInputFields = [document.getElementById('ltitlename'), document.getElementById('ltitleemail'), document.getElementById('ltitlephone')];

    allInputFields.forEach(listenerInputfield => {
        listenerInputfield.addEventListener("keyup", checkEditContactValidityNameEmailPhone);
    });
    eventButton.removeEventListener("mouseover", validityFalseAboveButtonRedBorderEditContact);
    eventButton.removeEventListener("mouseout", validityFalseLeaveButtonWhiteBorderEditContact);
    statusValidationName.removeEventListener("input", capitalizeFirstLetterInName);
}

/**
 *  This function checks the validity of input name, e-mail and phone. If it is correct, the function saveContact() opens. 
 */
function checkEditContactValidityNameEmailPhone(){
    let statusValidationName = document.getElementById('ltitlename');
    let statusValidationEmail = document.getElementById('ltitleemail');
    let statusValidationPhone = document.getElementById('ltitlephone');
    let email = document.getElementById('ltitleemail').value;
    let isAvailable = isThisEmailAvailable(email);
       
    if(isAvailable && email != contacts[editIndex].email){
        ifEmailAvailableBorderRed();
    } else{
        ifEmailNotAvailableBorderRed();
       if(statusValidationName.checkValidity() && statusValidationEmail.checkValidity() && statusValidationPhone.checkValidity()){
        changeColorButton();
        saveTheEditContact();
    } else {
        disableButtonAndStartSave();
    }
  }
}

/**
 *  This function saved once the edit contact
 */
function saveTheEditContact(){
    let eventButton = document.getElementById('button-save');

    eventButton.addEventListener("click", function () {
        if (!myStatusEditContact) {
            saveEditContact(editIndex);
            myStatusEditContact = true;
        }
    });
}

/**
 * This function change the color of the button save.
 */
function changeColorButton(){
    document.getElementById('button-save').disabled = false;
    document.getElementById('button-save').style.backgroundColor='#2A3647';
    document.getElementById('button-save').style.cursor = "pointer";
}

/**
 * This function is if the email available then the border will be red.  
 */
function ifEmailAvailableBorderRed(){
    disableButtonAndStartSave();
    document.getElementById('ltitleemail').style.outline = '2px solid red'; 
    document.getElementById('requiredemail').classList.remove('d-none');
}

/**
 * This function is if the email not available then the border will be white. 
 */
function ifEmailNotAvailableBorderRed(){
    document.getElementById('ltitleemail').style.outline = ''; 
    document.getElementById('requiredemail').classList.add('d-none');
}
    
 /**
  *  This function charge the color and enable the button and start the function saveEditContact.
 */
function disableButtonAndStartSave(){
    document.getElementById('button-save').disabled = true;
    document.getElementById('button-save').style.backgroundColor='#E5E5E5';
    document.getElementById('button-save').style.cursor = "default";
}
    
 /**
  *  This function checks the validity of input name, e-mail and phone. If the mouse is above the button and if the validation isn't correct, 
  *  the border of the elements ltitlename, ltitleemail, ltitlephone and text "This field is required" will be red.
*/
function validityFalseAboveButtonRedBorderEditContact(){
    let statusValidationName = document.getElementById('ltitlename');
    let statusValidationEmail = document.getElementById('ltitleemail');
    let statusValidationPhone = document.getElementById('ltitlephone');
   
    removesFocusFromInputField();
    changeBackColorFromButtonEditContactPage();
    checkValidationByTrueBorderRed(statusValidationName,statusValidationEmail,statusValidationPhone);
}

/**
 *  This function changes back the color for the create contact button on the addcontact page.
 */
function changeBackColorFromButtonEditContactPage(){
    let eventButton = document.getElementById('button-save');

    if(eventButton.disabled){
        document.getElementById('button-save').style.backgroundColor='#E5E5E5';
        document.getElementById('button-save').style.cursor = "default";
    }
    if(!eventButton.disabled){
        document.getElementById('button-save').style.backgroundColor='#25C0D4';
    }
}

/**
*  This function checks the validity of input name, e-mail and phone. If the mouse is above the button and if the validation isn't correct, 
*  the border of the elements ltitlename, ltitleemail, ltitlephone and text "This field is required" will be white.
*/
function validityFalseLeaveButtonWhiteBorderEditContact(){
    let statusValidationName = document.getElementById('ltitlename');
    let statusValidationEmail = document.getElementById('ltitleemail');
    let statusValidationPhone = document.getElementById('ltitlephone');

    changeColorFromButtonEditContactPage();
    checkValidationByTrueBorderInvisible(statusValidationName,statusValidationEmail,statusValidationPhone);
}

/**
 *  This function changes back the color for the create contact button on the editcontact page.
 */
function changeColorFromButtonEditContactPage(){
    let eventButton = document.getElementById('button-save');

    if(eventButton.disabled){
        document.getElementById('button-save').style.backgroundColor='#E5E5E5';
    }
    if(!eventButton.disabled){
        document.getElementById('button-save').style.backgroundColor='#2A3647';
    }
}

/**
 *  This function deletes contacts of the edit page.
 */
function deleteContactFromEditPage(){
    document.getElementById('delete').classList.remove('d-none');
}

/**
 * This function checked is the Email available.
 */
function isThisEmailAvailable(suppliedemail){   
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].email == suppliedemail) {
        return true;
        }
    }
    return false;
}