/**
 * Erstellt einen neuen Kontakt
 * @param {string} name - Name des Kontakts
 * @param {string} email - Email des Kontakts
 * @param {string} phone - Telefonnummer des Kontakts
 * @returns {Object} - Erstelltes Kontaktobjekt
 */
async function createContact(name, email, phone) {
    const color = generateRandomColor();
    const newContact = createContactObject(name, email, phone, color);
    
    try {
        const response = await storeContact(newContact);
        return await processContactResponse(response, newContact);
    } catch (error) {
        return handleContactCreationError(newContact, error);
    }
}

/**
 * Erstellt ein Kontaktobjekt mit den gegebenen Details
 */
function createContactObject(name, email, phone, color) {
    return {
        name: name,
        email: email,
        phone: phone || "",
        color: color,
        initials: getInitials(name)
    };
}

/**
 * Verarbeitet die Antwort nach dem Erstellen eines Kontakts
 */
async function processContactResponse(response, contact) {
    const contactID = getContactIDFromResponse(response);
    
    if (contactID) {
        contact.contactID = contactID;
        contacts.push(contact);
        saveToLocalStorage('contacts', contacts);
        return contact;
    } else {
        throw new Error("Kontakt konnte nicht gespeichert werden");
    }
}

/**
 * Extrahiert die Kontakt-ID aus der Antwort
 */
function getContactIDFromResponse(response) {
    if (response.status === "success") {
        return response.contactID || response.id;
    }
    return null;
}

/**
 * Behandelt Fehler während der Kontakterstellung
 */
function handleContactCreationError(contact, error) {
    console.error("Fehler beim Erstellen des Kontakts:", error);
    
    // Füge trotzdem zum lokalen Array hinzu für bessere UX
    contact.contactID = createID(); // Temporäre lokale ID
    contacts.push(contact);
    saveToLocalStorage('contacts', contacts);
    
    return contact;
}

/**
 * Generiert eine zufällige Farbe für einen neuen Kontakt
 * @returns {string} - Hex-Farbcode
 */
function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Extrahiert Initialen aus einem Namen
 * @returns {string} - Initialen
 */
function getInitials(name) {
    const parts = name.split(' ');
    if (parts.length > 1) {
        return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    }
    return parts[0][0].toUpperCase();
}

let myStatusEditContact = false;
/** 
 * Opens the window edit contact
*/
function openEditContact(i) {
    clearInputFields();
    styleEditContact();
    getSelectedContact(i);
    showAddOrEditContactWindow();
    distanceInputField();
    document.getElementById('add-contact-bg').classList.remove('d-none');
    addListenerForEditContact();
    myStatusEditContact = false;
    statusOverwriting = false;
}

/**
 * Styles the edit contact window
 */
function styleEditContact(){
    document.getElementById('text-contact').innerHTML = 'Edit contact';
    document.getElementById('text-taskarebetter').classList.add('d-none');
    document.getElementById('join-logo').style.transform = "translateY(-10.968rem)";
    document.getElementById('container-addcontact').classList.add('d-none');
    document.getElementById('container-editcontact').classList.remove('d-none');
    document.getElementById('button-save').style.backgroundColor='#2A3647';
    if(screen.width < 1000){
    document.getElementById('requiredtext').style.marginTop = "0";
    document.getElementById('requiredemail').style.marginTop = "0";
    }
}

/** 
 * Clears the input fields
*/
function clearInputFields() {
    document.getElementById('ltitlename').value = '';
    document.getElementById('ltitleemail').value = '';
    document.getElementById('ltitlephone').value = '';
}

/** 
 * Shows the add or edit contact window
*/
function showAddOrEditContactWindow() {
    document.getElementById('add-contact').classList.remove('animationcloseaddcontact');
    document.body.style.overflowY = 'hidden';
}

/** 
 * Closes the add contact function
*/
function closeAddContact() {
    document.getElementById('add-contact').classList.add('animationcloseaddcontact');
    setTimeout(closeWindow, 1500);
}

/** 
 * Closes the window
*/
function closeWindow() {
    document.getElementById('add-contact-bg').classList.add('d-none');
    document.getElementById('mobile-contact-view').classList.add('d-none');
    document.getElementById('mobile-edit-delete-c').classList.add('d-none');
    document.body.style.overflowY = 'hidden';
}

/** 
 * Loads available contacts
*/
function getSelectedContact(i) {
    document.getElementById('ltitlename').value = `${sortedContactsByName[i]["name"]}`;
    document.getElementById('ltitleemail').value = `${sortedContactsByName[i]["email"]}`;
    document.getElementById('ltitlephone').value = `${sortedContactsByName[i]["phone"]}`;
    document.getElementById('initial-person-card').classList.add('d-none');
    document.getElementById('text-initial').innerHTML = `${sortedContactsByName[i]["initials"]}`;
    document.getElementById('color-icon').style.backgroundColor = `${sortedContactsByName[i]["color"]}`;
    lastIndex = 2000;
}

/** 
 * Closes the add or edit contact with a slide effect
*/
function closeAddContactWithAnimation() {
    closeAddContact();
    setTimeout(successfulSent, 1500);
    setTimeout(closeSuccessfulSent, 2300);
}

/** 
 * Closes the window successfully
*/
function sucessfulCreatedDisable() {
    document.getElementById('text-successfulcreated').classList.add('d-none');
}