/** 
 * Creates a new contact and ensures the backend ID is captured
 */
async function createContactOnContactPage() {
    const name = document.getElementById('ltitlename').value;
    const email = document.getElementById('ltitleemail').value;
    const phone = document.getElementById('ltitlephone').value;

    try {
        const createdContact = await createContact(name, email, phone);
        const existingIndex = contacts.findIndex(c => 
            c.email === email && c.name === name
        );
        if (existingIndex >= 0) {
            contacts[existingIndex].contactID = createdContact.contactID;
        } else {
            contacts.push(createdContact);
        }
        handleSuccessfulContactCreation();
    } catch (error) {
        console.error("Failed to create contact:", error);
        alert("Failed to create contact. Please try again.");
    }
}

/**
 * Creates a new contact
 * @param {string} name - Contact name
 * @param {string} email - Contact email
 * @param {string} phone - Contact phone number
 * @returns {Promise<Object>} - Created contact object with backend ID
 */
async function createContact(name, email, phone) {
    const color = generateRandomColor();
    const newContact = createContactObject(name, email, phone, color);

    try {
        const response = await storeContact(newContact);
        if (response.status === "error") {
            throw new Error(response.message || "Failed to create contact");
        }
        const finalContact = await processContactResponse(response, newContact);
        return finalContact;
    } catch (error) {
        console.error("Error in createContact:", error);
        throw error;
    }
}

/**
 * Creates a contact object with the given details
 */
function createContactObject(name, email, phone, color) {
    // Note: user is automatically determined from the auth token in the backend
    return {
        name: name,
        email: email,
        phone: phone || "",
        color: color,
        initials: getInitials(name)
    };
}

/**
 * Processes the response after creating a contact
 * Ensures the contact is associated with the current user
 * @param {Object} response - Response from the backend
 * @param {Object} contact - Original contact object
 * @returns {Object} - Updated contact with backend ID
 */
async function processContactResponse(response, contact) {
    const newID = extractContactIDFromResponse(response);

    if (newID) {
        contact.contactID = newID;
        if (!contacts.find(c => c.contactID === newID)) {
            contacts.push(contact);
        }
        updateContactsInLocalStorage(contacts);
        return contact;
    } else {
        console.error("Failed to extract contact ID from response:", response);
        throw new Error("Contact could not be saved: missing ID in response");
    }
}

/**
 * Extracts contact ID from backend response
 * @param {Object} response - Backend response
 * @returns {string|number|null} - Contact ID or null if not found
 */
function extractContactIDFromResponse(response) {
    if (response && response.contactID) {
        return response.contactID;
    }
    if (response && response.id) {
        return response.id;
    }
    if (response && response.data && (response.data.contactID || response.data.id)) {
        return response.data.contactID || response.data.id;
    }
    return null;
}

/**
 * Updates contacts in local storage
 */
function updateContactsInLocalStorage(contactsArray) {
    saveToLocalStorage('contacts', contactsArray);
}

/**
 * Finds a contact by ID from available contacts
 * @param {string} id - Contact ID to find
 * @returns {Object} - Contact object or null if not found
 */
function getContactIDFromResponse(id) {
    for (let i = 0; i < contactsOfAddPage.length; i++) {
        if (contactsOfAddPage[i].contactID == id) {
            return contactsOfAddPage[i];
        }
    }
    if (typeof contacts !== 'undefined') {
        for (let i = 0; i < contacts.length; i++) {
            if (contacts[i].contactID == id) {
                return contacts[i];
            }
        }
    }
    return {
        name: "Unknown",
        initials: "??",
        color: "#6e6ee5"  // Standardfarbe
    };
}

/**
 * Behandelt Fehler während der Kontakterstellung
 */
function handleContactCreationError(contact, error) {
    console.error("Fehler beim Erstellen des Kontakts:", error);

    /* contact.contactID = createID(); // Temporäre lokale ID
    contacts.push(contact);
    saveToLocalStorage('contacts', contacts);

    return contact; */
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
    
    // Bei Öffnen des Edit-Contact-Fensters person-card-centric ausblenden
    const personCardCentric = document.querySelector('.person-card-centric');
    if (personCardCentric) {
        personCardCentric.style.display = 'none'; // Direkte Style-Manipulation
        personCardCentric.classList.add('d-none');
    }
}

/**
 * Styles the edit contact window
 */
function styleEditContact() {
    document.getElementById('text-contact').innerHTML = 'Edit contact';
    document.getElementById('text-taskarebetter').classList.add('d-none');
    document.getElementById('join-logo').style.transform = "translateY(-10.968rem)";
    document.getElementById('container-addcontact').classList.add('d-none');
    document.getElementById('container-editcontact').classList.remove('d-none');
    document.getElementById('button-save').style.backgroundColor = '#2A3647';
    if (window.innerWidth < 1000) {
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
 * Diese Funktion wird nach dem Schließen des Kontaktformulars aufgerufen
*/
function closeWindow() {
    document.getElementById('add-contact-bg').classList.add('d-none');
    document.getElementById('mobile-contact-view').classList.add('d-none');
    document.getElementById('mobile-edit-delete-c').classList.add('d-none');
    document.body.style.overflowY = 'auto'; // Hier ändern zu 'auto' statt 'hidden'
    setTimeout(handleScreenSizeChange, 100);
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