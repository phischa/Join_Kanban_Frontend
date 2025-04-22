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
 * Checks if the passwords match and then sends the
 * registration data to the backend or shows an error.
 * 
 * @param {string} email - Email of the new user
 * @param {string} username - Username of the new user
 * @param {string} password - Password of the new user
 * @param {string} repeated_password - Password confirmation
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
 * Creates the payload for the registration request
 * 
 * @param {string} email - Email of the new user
 * @param {string} username - Username
 * @param {string} password - Password
 * @param {string} repeated_password - Password confirmation
 * @returns {Object} Registration data as JSON
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
 * Sends registration data to the Django backend
 * 
 * @param {string} email - Email of the new user
 * @param {string} username - Username
 * @param {string} password - Password
 * @param {string} repeated_password - Password confirmation
 * @returns {Promise<Object>} Response from the server
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
    console.error('Registration request failed:', error);
    return { 
      status: 'error', 
      message: 'Connection error to server',
      errors: { general: 'Connection error to server' }
    };
  }
}

/**
 * Processes the response from the server after the registration attempt
 * 
 * @param {Object} data - Response from the server
 */
function handleRegistrationResponse(data) {
  console.log('Processing registration response:', data);
  
  if (data.status === 'success') {
    handleSuccessfulRegistration(data);
  } else {
    handleRegistrationError(data);
  }
}

/**
 * Processes successful registrations
 * 
 * @param {Object} data - Success data from the server
 */
function handleSuccessfulRegistration(data) {
  storeUserData(data);
  successfulText();
  setTimeout(forwardToLoginSide, 2500);
}

/**
 * Stores user data after successful registration
 * 
 * @param {Object} data - User data from the server
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
 * Processes errors during registration
 * 
 * @param {Object} data - Error data from the server
 */
function handleRegistrationError(data) {
  console.error('Registration error:', data.errors || data.message);
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
    errorSpan.textContent = 'Error during registration';
    showCustomError();
  }
}

/**
 * Shows a custom error message
 */
function showCustomError() {
  unsuccessfulText();
  setTimeout(unsuccessfulTextDown, 3500);
}

/**
 * Shows error message for non-matching passwords
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