/**
 * This function gets executed on load to start the script.
 */
async function initSignUp() {
  await loadUsers();
  loadContacts();
  deleteActualUser();
}

/**
 * This function gets the values of the inputs.
 */
function newUser() {
  let username = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let repeated_password = document.getElementById('repeat').value;
  unsuccessfulTextAway();
  unsuccessfulTextRemove();
  passwordConfirm(email, username, password, repeated_password);
}

/**
 * Überprüft ob die Passwörter übereinstimmen und sendet dann die 
 * Registrierungsdaten an das Backend oder zeigt einen Fehler an.
 * 
 * @param {string} email - E-Mail des neuen Nutzers
 * @param {string} username - Benutzername des neuen Nutzers
 * @param {string} password - Passwort des neuen Nutzers
 * @param {string} repeated_password - Passwortbestätigung
 */
async function passwordConfirm(email, username, password, repeated_password) {
  if (password === repeated_password) {
    const response = await sendRegistrationToBackend(email, username, password, repeated_password);
    handleRegistrationResponse(response);
  } else {
    showPasswordMismatchError();
  }
}

/**
 * Erstellt die Payload für die Registrierungsanfrage
 * 
 * @param {string} email - E-Mail des neuen Nutzers
 * @param {string} username - Benutzername 
 * @param {string} password - Passwort
 * @param {string} repeated_password - Passwortbestätigung
 * @returns {Object} Registrierungsdaten als JSON
 */
function createRegistrationPayload(email, username, password, repeated_password) {
  return {
    username: username,
    email: email,
    password: password,
    repeated_password: repeated_password
  };
}

/**
 * Sendet Registrierungsdaten an das Django-Backend
 * 
 * @param {string} email - E-Mail des neuen Nutzers
 * @param {string} username - Benutzername 
 * @param {string} password - Passwort
 * @param {string} repeated_password - Passwortbestätigung
 * @returns {Promise<Object>} Antwort vom Server
 */
async function sendRegistrationToBackend(email, username, password, repeated_password) {
  try {
    const payload = createRegistrationPayload(email, username, password, repeated_password);
    const response = await fetch('http://127.0.0.1:8000/user_auth/registration/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (!data.status) {
      data.status = response.ok ? 'success' : 'error';
    }
    
    return data;
  } catch (error) {
    console.error('Registrierungsanfrage fehlgeschlagen:', error);
    return { 
      status: 'error', 
      message: 'Verbindungsfehler zum Server',
      errors: { general: 'Verbindungsfehler zum Server' }
    };
  }
}

/**
 * Verarbeitet die Antwort vom Server nach dem Registrierungsversuch
 * 
 * @param {Object} data - Antwort vom Server
 */
function handleRegistrationResponse(data) {
  console.log('Verarbeite Registrierungsantwort:', data);
  
  if (data.status === 'success') {
    handleSuccessfulRegistration(data);
  } else {
    handleRegistrationError(data);
  }
}

/**
 * Verarbeitet erfolgreiche Registrierungen
 * 
 * @param {Object} data - Erfolgsdaten vom Server
 */
function handleSuccessfulRegistration(data) {
  storeUserData(data);
  successfulText();
  setTimeout(forwardToLoginSide, 2500);
}

/**
 * Speichert Nutzerdaten nach erfolgreicher Registrierung
 * 
 * @param {Object} data - Nutzerdaten vom Server
 */
function storeUserData(data) {
  const user = {
    userID: data.userID,
    name: data.username,
    email: data.email
  };
  localStorage.setItem('actualUser', JSON.stringify(user));
}

/**
 * Verarbeitet Fehler bei der Registrierung
 * 
 * @param {Object} data - Fehlerdaten vom Server
 */
function handleRegistrationError(data) {
  console.error('Registrierungsfehler:', data.errors || data.message);
  const errorSpan = document.querySelector('#popup-fail .button');
  
  if (data.errors && data.errors.email) {
    errorSpan.textContent = data.errors.email;
    showCustomError();
  } else if (data.errors && data.errors.username) {
    errorSpan.textContent = data.errors.username;
    showCustomError();
  } else if (data.errors && data.errors.password) {
    errorSpan.textContent = data.errors.password;
    showCustomError();
  } else {
    errorSpan.textContent = 'Fehler bei der Registrierung';
    showCustomError();
  }
}

/**
 * Zeigt eine benutzerdefinierte Fehlermeldung an
 */
function showCustomError() {
  unsuccessfulText();
  setTimeout(unsuccessfulTextDown, 3500);
}

/**
 * Zeigt Fehlermeldung für nicht übereinstimmende Passwörter
 */
function showPasswordMismatchError() {
  wrongPasswordText();
  addBorderColorRed();
}

/**
 * This function gets the user to the login side. A Timeout start thsi function after 2,5 seconds.
 */
function forwardToLoginSide() {
  window.location.href = 'start.html';
}

/**
 * This function show a message, that indicates the successful signin. 
 */
function successfulText() {
  document.getElementById('popup').classList.remove('d-none');
}

function unsuccessfulText() {
  document.getElementById('popup-fail').classList.remove('d-none');
}

function unsuccessfulTextAway() {
  document.getElementById('popup-fail').classList.add('d-none');
}

function unsuccessfulTextRemove() {
  document.getElementById('popup-fail').classList.remove('popup-fail');
}

function unsuccessfulTextDown() {
  document.getElementById('popup-fail').classList.add('popup-fail');
}

/**
 * This function gets the element by id and adds a class to color the border red.
 */
function addBorderColorRed() {
  document.getElementById('input-field2').classList.add('border-red');
}

/**
 * This function gets the element by id and adds a class to show the wrong password text. 
 */
function wrongPasswordText() {
  document.getElementById('wrong-password').classList.remove('d-none');
}

/**
 * This function changes the custom icon of the checkbox based on clicking.
 */
function switchCheckbox() {
  let check = document.getElementById('checkbox');
  if (check.src.includes('checkbox-default.svg')) {
    check.src = '../img/icons/checkbox-checked.svg';
  } else {
    check.src = '../img/icons/checkbox-default.svg';
  }
}

/**
 * This function changes the type of the password input form password to text. Thus the user can see the typed password.
 */
function changeInputType1() {
  let icon = document.getElementById('password-icon1');
  if (icon.src.includes('visibility_off.svg')) {
    icon.src = '../img/icons/visibility_on.svg';
    let password = document.getElementById('password').type = 'text';
    addBorderColorBlue(password);
  } else {
    icon.src = '../img/icons/visibility_off.svg';
    document.getElementById('password').type = 'password';
    removeBorderColorBlue(password);
  }
}

/**
 * This function changes the type of the password input form password to text. Thus the user can see the typed password.
 */
function changeInputType2() {
  let icon = document.getElementById('password-icon2');
  if (icon.src.includes('visibility_off.svg')) {
    icon.src = '../img/icons/visibility_on.svg';
    let repeat = document.getElementById('repeat').type = 'text';
    addBorderColorBlue(repeat);
  } else {
    icon.src = '../img/icons/visibility_off.svg';
    document.getElementById('repeat').type = 'password';
    removeBorderColorBlue(repeat);
  }
}

/**
 * This function adds a blue border to the input fields of password or confirm password
 * 
 * @param {string} password 
 * @param {string} repeated_password
 */
function addBorderColorBlue(password, repeated_password) {
  password = document.getElementById('input-field1').classList.add('border-blue');
  repeated_password = document.getElementById('input-field2').classList.add('border-blue');
}

/**
 * This function adds a blue border to the input fields of password or confirm password
 * 
 * @param {string} password 
 * @param {string} repeated_password
 */
function removeBorderColorBlue(password, repeated_password) {
  password = document.getElementById('input-field1').classList.remove('border-blue');
  repeated_password = document.getElementById('input-field2').classList.remove('border-blue');
}

/**
 * This function changes the icon of the password input when the user starts typing.
 */
function changeIconToVisibilityOff1() {
  document.getElementById('password-icon1').src = '../img/icons/visibility_off.svg';
}

/**
 * This function changes the icon of the confirm input when the user starts typing.
 */
function changeIconToVisibilityOff2() {
  document.getElementById('password-icon2').src = '../img/icons/visibility_off.svg';
}
