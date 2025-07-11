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
    
    // Nach dem Schließen des Erfolgsfensters Sichtbarkeit prüfen
    setTimeout(handleScreenSizeChange, 100);
}

/** 
*  This function shows the delete function.
*/
function deleteContactOfContactPage() {
    document.getElementById('delete').classList.remove('d-none');
}

/**
 * Deletes a contact by its ID
 * Uses the user-specific delete function
 * @param {string|number} contactID - Contact ID
 * @returns {Promise<boolean>} - Success status
 */
async function deleteContact(contactID) {
    try {
        const response = await deleteUserContact(contactID);
        return await processDeleteResponse(response, contactID);
    } catch (error) {
        return handleDeleteError(error, contactID);
    }
}

/**
 * Works with the return after deleting a contact
 */
async function processDeleteResponse(response, contactID) {
    if (response.status === "success") {
        removeContactFromLocalArray(contactID);
        saveToLocalStorage('contacts', contacts);
        return true;
    } else {
        const errorMsg = response.message || "Unbekannter Fehler";
        throw new Error(`Kontakt konnte nicht gelöscht werden: ${errorMsg}`);
    }
}

/**
 * Deals with error while deleting a contact
 */
function handleDeleteError(error, contactID) {
    console.error("Fehler beim Löschen des Kontakts:", error);
    removeContactFromLocalArray(contactID);
    saveToLocalStorage('contacts', contacts);

    return false;
}

/**
 * Deletes a contact from the local array based on the id
 */
function removeContactFromLocalArray(contactID) {
    const index = contacts.findIndex(c => c.contactID == contactID);
    if (index !== -1) {
        contacts.splice(index, 1);
    }
}

/** 
 * Deletes the chosen contacts in the storage
 */
async function finallyDeleted() {
    const contactID = contacts[editIndex]['contactID'] + '';
    await deleteContact(contactID);

    handleSuccessfulDeletion();
}

/**
 * Behandelt die erfolgreiche Löschung eines Kontakts
 */
function handleSuccessfulDeletion() {
    deletedContactList();
    renderContactList();
    closeDeleteContact();
    closeAddContact();
    reloadContactSite();

    if (isMobileView()) {
        backToContactList();
    }
    
    setTimeout(handleScreenSizeChange, 300);
}

/**
 * Reloads ContactsPage
 */
    function reloadContactSite() {
        window.location.href = 'contactsPage.html';
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
showContactList.addEventListener("change", function(e) {
    showAgainContactList(e);
});

/**
 * Called when the screen width is >= 1201px (desktop view)
 */
function showAgainContactList(e) {
    if (e.matches) {
        const widthContactContainer = document.getElementById('width-contact-container');
        const mobileEditDeleteC = document.getElementById('mobile-edit-delete-c');
        const personCardMobile = document.getElementById('person-card-mobile');
        const mobileName = document.getElementById('mobile-name');
        const mobileOption = document.getElementById('mobile-option');
        const mobileAddContact = document.getElementById('mobile-addcontact');
        const buttonCreateContact = document.getElementById('button-createcontact');
        const addContact = document.getElementById('add-contact');

        if (widthContactContainer) widthContactContainer.classList.remove('d-none');
        if (mobileEditDeleteC) mobileEditDeleteC.classList.add('d-none');
        if (personCardMobile) personCardMobile.classList.add('d-none');
        if (mobileName) mobileName.classList.add('d-none');
        if (mobileOption) mobileOption.classList.add('d-none');
        if (mobileAddContact) mobileAddContact.classList.remove('d-none');
        if (buttonCreateContact) buttonCreateContact.style.marginTop = '0';
        if (addContact) addContact.style.height = '37rem';
        
        const personCardCentric = document.querySelector('.person-card-centric');
        if (personCardCentric) {
            personCardCentric.style.display = 'block'; // Direkte Style-Manipulation
            personCardCentric.classList.remove('d-none');
        }
    }
}

/** 
*  If the contact appears in the mobile version, you can push the arrow and go back.
*/
function backToContactList() {
    document.getElementById('width-contact-container').classList.remove('d-none');
    document.getElementById('mobile-contact-view').classList.add('d-none');
    document.getElementById('person-card-mobile').classList.add('d-none');
    
    // Explicitly hide the options button with all possible methods
    const mobileOptionButton = document.getElementById('mobile-option');
    mobileOptionButton.classList.add('d-none');
    mobileOptionButton.style.visibility = 'hidden';
    mobileOptionButton.style.display = 'none';
    mobileOptionButton.style.opacity = '0';
    
    // Explicitly show the add contact button with all possible methods
    const mobileAddButton = document.getElementById('mobile-addcontact');
    mobileAddButton.classList.remove('d-none');
    mobileAddButton.style.visibility = 'visible';
    mobileAddButton.style.display = 'flex';
    mobileAddButton.style.opacity = '1';
    
    // person-card-centric Sichtbarkeit basierend auf Bildschirmgröße steuern
    const personCardCentric = document.querySelector('.person-card-centric');
    if (personCardCentric) {
        if (!isMobileView()) {
            personCardCentric.style.display = 'block'; // Direkte Style-Manipulation
            personCardCentric.classList.remove('d-none');
        } else {
            personCardCentric.style.display = 'none'; // Direkte Style-Manipulation
            personCardCentric.classList.add('d-none');
        }
    }
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
function addListenerForEditContact() {
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
function removeListenerForEditContact() {
    let statusValidationName = document.getElementById('ltitlename');
    let eventButton = document.getElementById('button-save');
    let allInputFields = [document.getElementById('ltitlename'), document.getElementById('ltitleemail'), document.getElementById('ltitlephone')];

    allInputFields.forEach(listenerInputfield => {
        listenerInputfield.removeEventListener("keyup", checkEditContactValidityNameEmailPhone);
    });
    eventButton.removeEventListener("mouseover", validityFalseAboveButtonRedBorderEditContact);
    eventButton.removeEventListener("mouseout", validityFalseLeaveButtonWhiteBorderEditContact);
    statusValidationName.removeEventListener("input", capitalizeFirstLetterInName);
}

/**
 *  This function checks the validity of input name, e-mail and phone. If it is correct, the function saveContact() opens. 
 */
function checkEditContactValidityNameEmailPhone() {
    let statusValidationName = document.getElementById('ltitlename');
    let statusValidationEmail = document.getElementById('ltitleemail');
    let statusValidationPhone = document.getElementById('ltitlephone');
    let email = document.getElementById('ltitleemail').value;
    let isAvailable = isThisEmailAvailable(email);

    if (isAvailable && email != contacts[editIndex].email) {
        ifEmailAvailableBorderRed();
    } else {
        ifEmailNotAvailableBorderRed();
        if (statusValidationName.checkValidity() && statusValidationEmail.checkValidity() && statusValidationPhone.checkValidity()) {
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
function saveTheEditContact() {
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
function changeColorButton() {
    document.getElementById('button-save').disabled = false;
    document.getElementById('button-save').style.backgroundColor = '#2A3647';
    document.getElementById('button-save').style.cursor = "pointer";
}

/**
 * This function is if the email available then the border will be red.  
 */
function ifEmailAvailableBorderRed() {
    disableButtonAndStartSave();
    document.getElementById('ltitleemail').style.outline = '2px solid red';
    document.getElementById('requiredemail').classList.remove('d-none');
}

/**
 * This function is if the email not available then the border will be white. 
 */
function ifEmailNotAvailableBorderRed() {
    document.getElementById('ltitleemail').style.outline = '';
    document.getElementById('requiredemail').classList.add('d-none');
}

/**
 *  This function charge the color and enable the button and start the function saveEditContact.
*/
function disableButtonAndStartSave() {
    document.getElementById('button-save').disabled = true;
    document.getElementById('button-save').style.backgroundColor = '#E5E5E5';
    document.getElementById('button-save').style.cursor = "default";
}

/**
 *  This function checks the validity of input name, e-mail and phone. If the mouse is above the button and if the validation isn't correct, 
 *  the border of the elements ltitlename, ltitleemail, ltitlephone and text "This field is required" will be red.
*/
function validityFalseAboveButtonRedBorderEditContact() {
    let statusValidationName = document.getElementById('ltitlename');
    let statusValidationEmail = document.getElementById('ltitleemail');
    let statusValidationPhone = document.getElementById('ltitlephone');

    removesFocusFromInputField();
    changeBackColorFromButtonEditContactPage();
    checkValidationByTrueBorderRed(statusValidationName, statusValidationEmail, statusValidationPhone);
}

/**
 *  This function changes back the color for the create contact button on the addcontact page.
 */
function changeBackColorFromButtonEditContactPage() {
    let eventButton = document.getElementById('button-save');

    if (eventButton.disabled) {
        document.getElementById('button-save').style.backgroundColor = '#E5E5E5';
        document.getElementById('button-save').style.cursor = "default";
    }
    if (!eventButton.disabled) {
        document.getElementById('button-save').style.backgroundColor = '#25C0D4';
    }
}

/**
*  This function checks the validity of input name, e-mail and phone. If the mouse is above the button and if the validation isn't correct, 
*  the border of the elements ltitlename, ltitleemail, ltitlephone and text "This field is required" will be white.
*/
function validityFalseLeaveButtonWhiteBorderEditContact() {
    let statusValidationName = document.getElementById('ltitlename');
    let statusValidationEmail = document.getElementById('ltitleemail');
    let statusValidationPhone = document.getElementById('ltitlephone');

    changeColorFromButtonEditContactPage();
    checkValidationByTrueBorderInvisible(statusValidationName, statusValidationEmail, statusValidationPhone);
}

/**
 *  This function changes back the color for the create contact button on the editcontact page.
 */
function changeColorFromButtonEditContactPage() {
    let eventButton = document.getElementById('button-save');

    if (eventButton.disabled) {
        document.getElementById('button-save').style.backgroundColor = '#E5E5E5';
    }
    if (!eventButton.disabled) {
        document.getElementById('button-save').style.backgroundColor = '#2A3647';
    }
}

/**
 *  This function deletes contacts of the edit page.
 */
function deleteContactFromEditPage() {
    document.getElementById('delete').classList.remove('d-none');
}

/**
 * This function checked is the Email available.
 */
function isThisEmailAvailable(suppliedemail) {
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].email == suppliedemail) {
            return true;
        }
    }
    return false;
}