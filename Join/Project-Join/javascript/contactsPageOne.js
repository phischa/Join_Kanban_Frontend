let sortedContactsByName, resetBgColor = 0, lastIndex, editIndex;

/**
 * Consistent method to check if the mobile view is currently active
 * @returns {boolean} True if mobile view (≤1200px), otherwise False
 */
function isMobileView() {
    return window.innerWidth <= 1200;
}

/** 
 * Logs the current screen width and visibility of the central element
 */
function logViewportStatus() {
    const personCardCentric = document.querySelector('.person-card-centric');
    const isMobile = isMobileView();
    const isHidden = personCardCentric ? personCardCentric.classList.contains('d-none') : 'Element not found';
}

/** 
 *  Loads functions that are needed upfront.
 */
async function onload() {
    forceMobileButtonVisibility() 
    try {
        if (typeof loadUserContactsOnInit === 'function') {
            await loadUserContactsOnInit();
        } else {
            await loadContacts();
        }
        renderContactList();
        handleScreenSizeChange();
        logViewportStatus();
        forceMobileButtonVisibility();
        
    } catch (error) {
        console.error("Error loading contacts:", error);
        await loadContacts();
        renderContactList();
        forceMobileButtonVisibility();
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
        content.innerHTML = ''; // Clear list before rebuilding

        for (let i = 0; i < allExistedFirstLetter.length; i++) {
            loadFirstLetterContainer(allExistedFirstLetter[i]);
            loadContactsContactPage(allExistedFirstLetter[i]);
        }
        handleScreenSizeChange();
        forceMobileButtonVisibility();
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
 * This function is called when switching to mobile view
 */
function ifScreenMobileDisplayNone() {
    document.getElementById('width-contact-container').classList.add('d-none');
    document.getElementById('mobile-contact-view').classList.remove('d-none');
    document.getElementById('person-card-mobile').classList.remove('d-none');
    
    // Explicitly hide the add contact button with all possible methods
    const mobileAddButton = document.getElementById('mobile-addcontact');
    mobileAddButton.classList.add('d-none');
    mobileAddButton.style.visibility = 'hidden';
    mobileAddButton.style.display = 'none';
    mobileAddButton.style.opacity = '0';
    
    // Explicitly show the options button with all possible methods
    const mobileOptionButton = document.getElementById('mobile-option');
    mobileOptionButton.classList.remove('d-none');
    mobileOptionButton.style.visibility = 'visible';
    mobileOptionButton.style.display = 'flex';
    mobileOptionButton.style.opacity = '1';
    
    // In mobile view, always hide person-card-centric
    const personCardCentric = document.querySelector('.person-card-centric');
    if (personCardCentric) {
        personCardCentric.style.display = 'none'; // Direct style manipulation
        personCardCentric.classList.add('d-none');
    }
}

/**
 * Central function for controlling visibility of .person-card-centric
 * and mobile buttons based on screen width
 */
function handleScreenSizeChange() {
    const personCardCentric = document.querySelector('.person-card-centric');
    const mobileAddButton = document.getElementById('mobile-addcontact');
    const mobileOptionButton = document.getElementById('mobile-option');
    
    if (!personCardCentric) {
        return;
    } 
    if (isMobileView()) {
        personCardCentric.style.display = 'none';
        personCardCentric.classList.add('d-none');
        if (mobileAddButton) {
            mobileAddButton.style.visibility = 'visible';
        }
        if (mobileOptionButton) {
            mobileOptionButton.style.visibility = 'visible';
        }
    } else {
        personCardCentric.style.display = 'block';
        personCardCentric.classList.remove('d-none');
        if (mobileAddButton) {
            mobileAddButton.style.visibility = 'hidden';
        }
        if (mobileOptionButton) {
            mobileOptionButton.style.visibility = 'hidden';
        }
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

/**
 * Ensure mobile button visibility can be called manually if needed
 */
function forceMobileButtonVisibility() {
    const mobileAddButton = document.getElementById('mobile-addcontact');
    if (mobileAddButton && isMobileView()) {
        mobileAddButton.classList.remove('d-none');
        mobileAddButton.style.visibility = 'visible';
        mobileAddButton.style.display = 'flex';
        mobileAddButton.style.opacity = '1';
    }
}

// Event-Listener for resize events
window.addEventListener('resize', function() {
    handleScreenSizeChange();
    forceMobileButtonVisibility();
});

// Initial at DOM loading
document.addEventListener('DOMContentLoaded', function() {
    handleScreenSizeChange();
    setTimeout(function() {
        handleScreenSizeChange();
        if (isMobileView()) {
            forceMobileButtonVisibility();
        }
        logViewportStatus();
    }, 300);
});