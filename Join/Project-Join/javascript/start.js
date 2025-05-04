let remember = '';

/**
 * This function gets executed on load to start the script.
 */
async function initLogin() {
    isLocalRemember();
    await loadRememberMe();
    removeRedMail();
    setupFormListener();
}

/**
 * Sets up the event listener for the login form
 */
function setupFormListener() {
    setupFormSubmitPrevention();
    setupLoginButtonHandler();
}

/**
 * Prevents the form from being submitted normally
 */
function setupFormSubmitPrevention() {
    const form = document.getElementById('form');
    if (form) {
        form.onsubmit = function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        };
    }
}

/**
 * Sets up the login button click handler
 */
function setupLoginButtonHandler() {
    const loginBtn = document.getElementById('login-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            handleManualLogin();
        });
    }
}

/**
 * This function checks onload if the rememberMe-feature was clicked before and is therefore saved in the local storage.
 * Based on this info it changes the checkbox icon.  
 */
function isLocalRemember() {
    let rememberStorage = localStorage.getItem('rememberMe');
    let check = document.getElementById('remember-me')
    if (rememberStorage) {
        check.src = '../img/icons/checkbox-checked.svg';
        remember = true;
    } else {
        check.src = '../img/icons/checkbox-default.svg';
        remember = false;
    }
}

/**
 * Handles login when button is clicked
 */
async function handleManualLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    handleRememberMe(email, password);
    removeRedMail();
    await login(email, password);
}

/**
 * Handles remember me functionality
 */
function handleRememberMe(email, password) {
    if (remember) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
    }
}

/**
 * Legacy function for compatibility
 */
async function onsubmitLogin() {
    await handleManualLogin();
    return false;
}

/**
 * This function sends a login request to the backend
 */
async function login(email, password) {
    try {
        const result = await authenticateUser(email, password);
        handleLoginResult(result);
    } catch (error) {
        console.error('Login error:', error);
        colorRedMail();
        wrongMailText();
    }
}

/**
 * Handles login result
 */
function handleLoginResult(result) {
    if (result.status === "success") {
        storeActualUser(result.user);
        window.location.href = 'summary.html';
    } else {
        handleLoginError(result.message);
    }
}

/**
 * Handles login errors
 */
function handleLoginError(errorMessage) {
    const errorMsg = errorMessage.toLowerCase();
    if (isEmailRelatedError(errorMsg)) {
        colorRedMail();
        wrongMailText();
    } else {
        colorRedPassword();
        wrongPasswordText();
    }
}

/**
 * Checks if error is related to email/username
 */
function isEmailRelatedError(errorMsg) {
    return errorMsg.includes('user') ||
        errorMsg.includes('username') ||
        errorMsg.includes('email');
}

/**
 * This function checks email format and displays appropriate error
 */
function loginCheck(email) {
    // Check if email has valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        colorRedMail();
        wrongMailText();
    } else {
        colorRedPassword();
        wrongPasswordText();
    }
}

// Lokaler Fallback wie vorher beschrieben
function useLocalGuestMode() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.setItem('guestMode', 'true');
    
    const guestUser = {
        name: "Guest User (Offline)", 
        email: "guest@example.com"
    };
    saveToLocalStorage('actualUser', guestUser);
    window.location.href = 'summary.html';
}

/**
 * This function switches the status (true/false) of the global variable "remember" based on the remember me checkbox.
 */
function setRememberMe() {
    if (!remember) {
        remember = true;
        localStorage.setItem('rememberMe', 'true')
    } else {
        remember = false;
        localStorage.setItem('rememberMe', '')
    }
    rememberMe();
}

/**
 * This function loads any remembered credentials and autofills the login form
 */
async function loadRememberMe() {
    let rememberLocal = localStorage.getItem('rememberMe');
    if (rememberLocal) {
        remember = true;

        let rememberedEmail = localStorage.getItem('rememberedEmail');
        let rememberedPassword = localStorage.getItem('rememberedPassword');

        if (rememberedEmail && rememberedPassword) {
            document.getElementById("email").value = rememberedEmail;
            document.getElementById("password").value = rememberedPassword;

            // Optional: Auto-login with remembered credentials
            if (remember) {
                await login(rememberedEmail, rememberedPassword);
            }
        }
    } else {
        remember = false;
    }
}

/**
 * This function checks if the "remember me" checkbox is checked and changes the icon based on that info.
 */
function rememberMe() {
    let check = document.getElementById('remember-me');
    if (check.src.includes('checkbox-default.svg')) {
        check.src = '../img/icons/checkbox-checked.svg';
    } else {
        check.src = '../img/icons/checkbox-default.svg';
    }
}

/**
 * This function changes the icon in the password input from "lock" to "crossed eye".
 */
function changeIconToVisibilityOff() {
    document.getElementById('password-icon').src = '../img/icons/visibility_off.svg';
    document.getElementById('input-field').classList.remove('border-red');
    document.getElementById('wrong-password').classList.add('d-none');
}

/**
 * This function removes the red border and the text from the mail input
 */
function removeRedMail() {
    document.getElementById('input-mail').classList.remove('border-red');
    document.getElementById('wrong-mail').classList.add('d-none');
}

/**
 * This function changes the type of the password input from "password" to "text" to make the password visible. It also changes the icon based on the input type.
 */
function changeInputType() {
    let icon = document.getElementById('password-icon');
    if (icon.src.includes('visibility_off.svg')) {
        icon.src = '../img/icons/visibility_on.svg';
        document.getElementById('password').type = 'text';
        addBorderColorBlue();
    } else {
        icon.src = '../img/icons/visibility_off.svg';
        document.getElementById('password').type = 'password';
        removeBorderColorBlue();
    }
}

/**
 * This funktion adds the blue border colour to the password input field.
 */
function addBorderColorBlue() {
    document.getElementById('input-field').classList.add('border-blue');
}

/**
 * This funktion removes the blue border colour to the password input field.
 */
function removeBorderColorBlue() {
    document.getElementById('input-field').classList.remove('border-blue');
}

/**
 * This function gets the element by id and adds a class to color the border red.
 */
function colorRedPassword() {
    document.getElementById('input-field').classList.add('border-red');
}

/**
 * This function gets the element by id and adds a class to color the border red.
 */
function colorRedMail() {
    document.getElementById('input-mail').classList.add('border-red');
}

/**
 * This function gets the element by id and adds a class to show the wrong password text. 
 */
function wrongPasswordText() {
    document.getElementById('wrong-password').classList.remove('d-none');
}
/**
 * This function gets the element by id and adds a class to show the wrong mail text. 
 */
function wrongMailText() {
    document.getElementById('wrong-mail').classList.remove('d-none');
}