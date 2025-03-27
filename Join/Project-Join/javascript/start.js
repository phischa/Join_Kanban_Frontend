let remember = '';

/**
 * This function gets executed on load to start the script.
 */
async function initLogin() {
    isLocalRemember();
    await loadUsers();
    await loadRememberMe();
    deleteActualUser();
    await isRemember();
    removeRedMail();
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
    } else {
        check.src = '../img/icons/checkbox-default.svg';
    }
}

/**
 * This function get the input values and saves them in the local storage , if the remember me checkbox is checked.
 */
async function onsubmitLogin() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
    }
    removeRedMail();
    await login(email, password);
}

/**
 * This function checks if email and password match the ones in the database. If so it logs the user in, if not it show error.
 */
async function login(email, password) {
    user = users.find(u => u.email == email && u.password == password);
    if (user) {
        actualUser = user;
        await storeActualUser();
        window.location.href = 'summary.html';
    } else {
        loginCheck(email);
    }
}

function loginCheck(email) {
    email = users.find(u => u.email == email);
    if (!email) {
        colorRedMail();
        wrongMailText();
    } else {
        colorRedPassword();
        wrongPasswordText();
    }
}

/**
 * This function logs in a guest user. 
 */
async function guestLogin() {
    deleteActualUser();
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
 * Thsi function checks onload if global remember is true. Based on that it gets Mail and Password from the local storage and dierects to login().
 */
async function isRemember() {
    let rememberLocal = localStorage.getItem('rememberMe');
    if (rememberLocal) {
        remember = true;
    } else {
        remember = false;
    }
    if (remember) {
        let rememberedEmail = localStorage.getItem('rememberedEmail');
        let rememberedPassword = localStorage.getItem('rememberedPassword');
        await login(rememberedEmail, rememberedPassword);
    }
}

/**
 * This function checks iff the "remember me" checkbox is checked and changes the icon based on that info.
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
 * This function load the remembered email forim the database.
 */
async function loadRememberMe() {
    let rememberedEmail = localStorage.getItem('rememberedEmail');
    let rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail && rememberedPassword) {
        document.getElementById("email").value = rememberedEmail;
        document.getElementById("password").value = rememberedPassword;
        await login();
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