/** 
 * Saves the edit contact
*/
let statusOverwriting = false;
function saveEditContact(i) {
    let name = document.getElementById('ltitlename').value;
    let existedName = `${sortedContactsByName[i]["name"]}`;
    let email = document.getElementById('ltitleemail').value;
    let existedEmail = `${sortedContactsByName[i]["email"]}`;
    let phone = document.getElementById('ltitlephone').value;
    let existedPhone = `${sortedContactsByName[i]["phone"]}`;

    if(!name.localeCompare(existedName) && !email.localeCompare(existedEmail) && !phone.localeCompare(existedPhone)) {
        closeAddContactWithAnimation();
    } else {
        saveSelectedContact(name, email, phone, i);
    }
}

/**
 * Contains all sub functions for saving the edit contact
 */
function saveSelectedContact(name, email, phone, i){
    if(!statusOverwriting){
        overwritingAvaibleContact(name, email, phone);
        statusOverwriting = true;
    }
    removeListenerForEditContact();
    document.getElementById('text-successfulcreated').innerHTML = 'Contact successfully edited';
    openContact(i);
    renderContactContainer(i);
    deletedContactList();
    renderContactList();
    closeAddContactWithAnimation();
    
    // Nach dem Bearbeiten des Kontakts prüfen, ob person-card-centric angezeigt werden soll
    setTimeout(function() {
        handleScreenSizeChange();
        logViewportStatus(); // Debug-Log
    }, 2800); // Längere Verzögerung für sicheres Timing
}

/**
 * Updates local contact data
 */
function updateLocalContact(index, name, email, phone) {
    contacts[index].name = name;
    contacts[index].email = email;
    contacts[index].phone = phone;
    contacts[index].initials = getInitials(name);
}

/**
 * Prepares contact data for the backend
 */
function prepareContactForBackend(index, name, email, phone) {
    return {
        contactID: contacts[index].contactID,
        name: name,
        email: email,
        phone: phone,
        color: contacts[index].color,
        initials: getInitials(name)
    };
}

/**
 * Saves contact data to the backend
 */
async function saveContactToBackend(contactData) {
    try {
        const response = await storeContact(contactData);
        handleContactSaveResponse(response);
        return response;
    } catch (error) {
        handleContactSaveError(error);
        return { status: "error", message: error.message };
    }
}

/**
 * Handles the response from the backend
 */
function handleContactSaveResponse(response) {
    if (response.status !== "success") {
        localStorage.setItem('contacts', JSON.stringify(contacts));
    } else {
        console.log("Contact successfully updated");
    }
}

/**
 * Handles errors during backend communication
 */
function handleContactSaveError(error) {
    console.error("Error updating the contact:", error);
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

/**
 * Main function for updating a contact
 * @param {string} name - Name of the contact
 * @param {string} email - Email of the contact
 * @param {string} phone - Phone number of the contact
 */
async function overwritingAvaibleContact(name, email, phone) {
    updateLocalContact(editIndex, name, email, phone);
    const contactData = prepareContactForBackend(editIndex, name, email, phone);
    await saveContactToBackend(contactData);
}