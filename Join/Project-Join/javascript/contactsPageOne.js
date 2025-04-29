let sortedContactsByName, resetBgColor = 0, lastIndex, editIndex;

/**
 * Konsistente Methode zur Prüfung, ob aktuell die Mobile-Ansicht aktiv ist
 * @returns {boolean} True wenn mobile Ansicht (≤1200px), sonst False
 */
function isMobileView() {
    return window.innerWidth <= 1200;
}

/** 
 * Logs die aktuelle Bildschirmbreite und Sichtbarkeit des zentralen Elements
 */
function logViewportStatus() {
    const personCardCentric = document.querySelector('.person-card-centric');
    const isMobile = isMobileView();
    const isHidden = personCardCentric ? personCardCentric.classList.contains('d-none') : 'Element nicht gefunden';
    
    console.log(`Viewport: ${window.innerWidth}px, Mobile: ${isMobile}, person-card-centric versteckt: ${isHidden}`);
}

/** 
 *  Loads functions that are needed upfront.
 */
async function onload() {
    try {
        if (typeof loadUserContactsOnInit === 'function') {
            await loadUserContactsOnInit();
        } else {
            await loadContacts();
        }
        renderContactList();
        
        // Überprüfe initial die Bildschirmgröße und setze die Sichtbarkeit
        handleScreenSizeChange();
        // Debug-Log
        logViewportStatus();
    } catch (error) {
        console.error("Fehler beim Laden der Kontakte:", error);
        await loadContacts();
        renderContactList();
    }
}

/**
 * Loads the contacts of the logged in user
 */
async function loadUserContactsOnInit() {
    try {
        // Check if the new function is available
        if (typeof loadUserContacts === 'function') {
            const userContacts = await loadUserContacts();
            if (Array.isArray(userContacts)) {
                contacts = userContacts.map(contact => ({
                    ...contact,
                    contactID: contact.contactID || contact.id
                }));
            } else {
                loadFromLocalStorage('contacts', contacts);
            }
        } else {
            await loadContacts();
        }
    } catch (error) {
        loadFromLocalStorage('contacts', contacts);
    }
}

/**
 *  Show the contact-list inclusive letter, name and email. 
 */
function renderContactList() {
    if (contacts.length != 0) {
        sortedContactsByName = sortContactsByName(contacts);
        let allExistedFirstLetter = allUniqueFirstLetter();

        let content = document.getElementById('contact-list');
        content.innerHTML = ''; // Liste leeren bevor wir sie neu aufbauen

        for (let i = 0; i < allExistedFirstLetter.length; i++) {
            loadFirstLetterContainer(allExistedFirstLetter[i]);
            loadContactsContactPage(allExistedFirstLetter[i]);
        }
        
        // Nach dem Rendern der Liste Sichtbarkeit prüfen
        handleScreenSizeChange();
    }
}

/**
 *  Loads the existing contact.
 */
function loadContactsContactPage(letter) {
    for (let i = 0; i < contacts.length; i++) {
        if (letter == sortedContactsByName[i]["name"].charAt(0).toUpperCase()) {
            renderContactContainer(i);
        }
    }
}

/**
* Sorts the contacts alphabetically.
 */
function sortContactsByName(contacts) {
    contacts.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    return contacts;
}

/**
 *  Loads the first existing letter from existing contact.
 */
function allUniqueFirstLetter() {
    let firstLetter, allUniqueFirstLetter = [];

    for (let i = 0; i < contacts.length; i++) {
        firstLetter = sortedContactsByName[i]["name"].charAt(0).toUpperCase();
        if (!allUniqueFirstLetter.includes(firstLetter)) {
            allUniqueFirstLetter.push(firstLetter);
        }
    }
    return allUniqueFirstLetter;
}

/**
 *  Show the first letter container.
 */
function loadFirstLetterContainer(firstLetter) {
    let content = document.getElementById('contact-list');

    content.innerHTML += `
        <div class="firstletter-container" id="firstletter">${firstLetter}</div>
        <div class="dividing-line"></div>
    `;
}

/**
 *  Show the contacts in the list.
 */
function renderContactContainer(i) {
    let content = document.getElementById('contact-list');

    content.innerHTML += `
    <div class="preview-contact-container d_flexdirection_r_c" id="contact-container${i}" onclick="openContact(${i})">
      <section class="circle-area d_flex_c_c" id="border-circle${i}" style="background-color: ${sortedContactsByName[i]["color"]};">
        <div class="initial">${sortedContactsByName[i]["initials"]}</div>
    </section>
      <div class="name-email-container d_flex_column_sb">
        <div-white class="first-last-name" id="first-last-name${i}">${sortedContactsByName[i]["name"]}</div-white>
        <div class="email">${sortedContactsByName[i]["email"]}</div>
      </div>
    </div>
    `;
}

/** 
 * Show the person card.
 */
function openContact(i) {
    editIndex = i;

    if (!isMobileView()) {
        openPersonCard(i);
    } else {
        ifScreenMobileDisplayNone();
        showPersonCard(i);
        lastIndex = i;
    }
    
    // Debug-Log
    logViewportStatus();
}

/**
 * This function is the algorithm for open the person card 
 */
function openPersonCard(i){
    if (i != lastIndex) {
        document.getElementById('person-card').classList.remove('d-none');
        renderPreviewContact(i);
        let phoneNumber = spaceInPhoneNumber(sortedContactsByName[i]["phone"]);
        if (!isMobileView()) {
            animationPersonCard();
        }
        renderContact(i, phoneNumber);
        lastIndex = i;
    }
}

/**
 *  Show the person card.
 */
function showPersonCard(i) {
    renderPreviewContact(i);
    let phoneNumber = spaceInPhoneNumber(sortedContactsByName[i]["phone"]);
    renderContact(i, phoneNumber);
}

/** 
 * Switch display on / off from the ID.
 * Diese Funktion wird aufgerufen, wenn auf mobile Ansicht umgeschaltet wird
 */
function ifScreenMobileDisplayNone() {
    document.getElementById('width-contact-container').classList.add('d-none');
    document.getElementById('mobile-contact-view').classList.remove('d-none');
    document.getElementById('person-card-mobile').classList.remove('d-none');
    document.getElementById('mobile-addcontact').classList.add('d-none');
    document.getElementById('mobile-option').classList.remove('d-none');
    
    // In der mobilen Ansicht person-card-centric immer ausblenden
    const personCardCentric = document.querySelector('.person-card-centric');
    if (personCardCentric) {
        personCardCentric.style.display = 'none'; // Direkte Style-Manipulation
        personCardCentric.classList.add('d-none');
        console.log("Mobile Ansicht aktiviert: person-card-centric ausgeblendet");
    }
}

/**
 * Zentrale Funktion zur Steuerung der Sichtbarkeit von .person-card-centric
 * basierend auf der Bildschirmbreite
 */
function handleScreenSizeChange() {
    const personCardCentric = document.querySelector('.person-card-centric');
    if (!personCardCentric) {
        console.warn("Element .person-card-centric nicht gefunden!");
        return;
    }
    
    if (isMobileView()) {
        // Mobile Ansicht: Element ausblenden
        personCardCentric.style.display = 'none'; // Direkte Style-Manipulation
        personCardCentric.classList.add('d-none');
        console.log("Kleine Bildschirmbreite erkannt: person-card-centric ausgeblendet");
    } else {
        // Desktop-Ansicht: Element einblenden
        personCardCentric.style.display = 'block'; // Direkte Style-Manipulation
        personCardCentric.classList.remove('d-none');
        console.log("Große Bildschirmbreite erkannt: person-card-centric eingeblendet");
    }
}

/** 
 * Show Edit contact container and render the color and border.
 */
function renderPreviewContact(i) {
    let tablinks;

    changeColorOfThePreviewContactContainer();
    tablinks = document.getElementsByClassName("preview-contact-container");
    for (j = 0; j < tablinks.length; j++) {
        tablinks[j].style.backgroundColor = "";
    }
    changeColorBackOfThePreviewContactContainer(i);
    resetBgColor = i;
}

/**
 * This function render the color of the render prewiew container
 */
function changeColorOfThePreviewContactContainer(){
    document.getElementById(`contact-container${resetBgColor}`).style.backgroundColor = '#FFFFFF';
    document.getElementById(`first-last-name${resetBgColor}`).style.color = '#000000';
    document.getElementById(`border-circle${resetBgColor}`).style.border = '';
}

/**
 * This function render the color back of the render prewiew container
 */
function changeColorBackOfThePreviewContactContainer(i){
    document.getElementById(`contact-container${i}`).style.backgroundColor = '#2A3647';
    document.getElementById(`first-last-name${i}`).style.color = '#FFFFFF';
    document.getElementById(`border-circle${i}`).style.border = '2px solid #FFFFFF';
}

// Event-Listener für Resize-Events hinzufügen
window.addEventListener('resize', function() {
    console.log("Resize-Event erkannt, Bildschirmbreite:", window.innerWidth);
    handleScreenSizeChange();
});

// Initial bei DOM-Laden
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM geladen, initialer Check der Bildschirmbreite");
    handleScreenSizeChange();
});