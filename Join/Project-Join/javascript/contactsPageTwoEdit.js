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
}

/**
 * Aktualisiert lokale Kontaktdaten
 */
function updateLocalContact(index, name, email, phone) {
    contacts[index].name = name;
    contacts[index].email = email;
    contacts[index].phone = phone;
    contacts[index].initials = getInitials(name);
}

/**
 * Bereitet Kontaktdaten für das Backend vor
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
 * Speichert Kontaktdaten im Backend
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
 * Behandelt die Antwort vom Backend
 */
function handleContactSaveResponse(response) {
    if (response.status !== "success") {
        console.error("Kontakt konnte nicht im Backend aktualisiert werden:", response);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    } else {
        console.log("Kontakt erfolgreich aktualisiert");
    }
}

/**
 * Behandelt Fehler während der Backend-Kommunikation
 */
function handleContactSaveError(error) {
    console.error("Fehler beim Aktualisieren des Kontakts:", error);
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

/**
 * Main function for updating a contact
 * @param {string} name - Name of the contact
 * @param {string} email - Email of the contact
 * @param {string} phone - Phone number of the contact
 */
async function overwritingAvaibleContact(name, email, phone) {
    // Update local data
    updateLocalContact(editIndex, name, email, phone);
    
    // Prepare data for backend
    const contactData = prepareContactForBackend(editIndex, name, email, phone);
    
    // Send to backend
    await saveContactToBackend(contactData);
}