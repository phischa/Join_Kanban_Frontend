/** 
 *  Render the HTML Code on the desktop and mobile version.
 */
function renderContact(i, phoneNumber) {
    let content = document.getElementById('person-card');
    let contentMobile = document.getElementById('person-card-mobile');

    content.innerHTML = contentMobile.innerHTML = `
    <div class="person-card-headline d_flexdirection_r_c">
    <div class="circle d_flex_c_c" style="background-color: ${sortedContactsByName[i]["color"]};">
      <div class="circle-initial" id="initial">${sortedContactsByName[i]["initials"]}</div>
    </div>
    <div class="mobile-name" id="mobile-name">${sortedContactsByName[i]["name"]}</div>
    <div class="name-container d_flex_column_sb">
      <div class="distance-name"></div>
      <div class="name" id="name">${sortedContactsByName[i]["name"]}</div>
      <div class="d_flexdirection_r_c">
        <div class="edit-delete-container d_flexdirection_r">
          <div class="edit-container d_flexdirection_r" onclick="openEditContact(${i})">
            <img class="edit-icon" src="../img/icons/edit-contact-icon.svg"></img>
            <div class="edit">Edit</div>
          </div>
          <div class="delete-container d_flexdirection_r" onclick="deleteContactOfContactPage(${i})">
            <img class="delete-icon" src="../img/icons/delete-contact-icon.svg"></img>
            <div class="edit">Delete</div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div class="contact-information">
        <div class="text d_flex_c">Contact Information</div>
        <div class="address d_flex_column_sb">
            <div class="email-container d_flex_column_sb">
                <h2>Email</h2>
                <h3 id="email">${sortedContactsByName[i]["email"]}</h3>
            </div>
            <div class="phone-container d_flex_column_sb">
                <h2>Phone</h2>
                <h4 id="telephonenumber">${phoneNumber}</h4>
            </div>
        </div>
    </div>
    `;
}

/** 
*  This function makes spaces in the phone number.
*/
function spaceInPhoneNumber(string) {
    if(string){     
        let phone = [string.slice(0, 2), " ", string.slice(2, 6), " ", string.slice(6, 8), " ", string.slice(8, 11), " ", string.slice(11, 13), " "].join('');
        return phone;
    } else {
        let phone = '';
        return phone;
    }
}

/** 
*  This function makes a slide effect.
*/
function animationPersonCard() {
    let content = document.getElementById('person-card');
    content.style.animationName = "none";

    requestAnimationFrame(() => {
        content.style.animationName = "";
    });
}

let myStatus = false;
/**
 *  This function checks the validity of input name, e-mail and phone. If it is correct, the function createContact() opens. 
 */
function checkValidityNameEmailPhone(){
    let statusValidationName = document.getElementById('ltitlename');
    let statusValidationEmail = document.getElementById('ltitleemail');
    let statusValidationPhone = document.getElementById('ltitlephone');
    let email = document.getElementById('ltitleemail').value;
    let isAvailable = isThisEmailAvailable(email);

    if(isAvailable){
        ifEmailAvailableBorderRed();
    } else {
        ifEmailNotAvailableBorderRed();
    if(statusValidationName.checkValidity() && statusValidationEmail.checkValidity() && statusValidationPhone.checkValidity()){
        enableCreateContactButton();
        createTheContact();
    } else {
        disableCreateContactButton();
    }
  }
}

/**
 *  This function created once the edit contact
 */
function createTheContact(){
    let eventButton = document.getElementById('button-createcontact');

    eventButton.addEventListener("click", function () {
        if (!myStatus) {
            createContactOnContactPage();
            myStatus = true;
        }
    });
}

/**
 * This function enable the create contact button and change the color.
 */
function enableCreateContactButton(){
    document.getElementById('button-createcontact').disabled = false;
    document.getElementById('button-createcontact').style.backgroundColor='#2A3647';
    document.getElementById('button-createcontact').style.cursor = "pointer";
}

/**
 * This function enable the create contact button and change the color.
 */
function disableCreateContactButton(){
    document.getElementById('button-createcontact').disabled = true;
    document.getElementById('button-createcontact').style.backgroundColor='#E5E5E5';
    document.getElementById('button-createcontact').style.cursor = "default";
}  

/**
 *  This function checks the validity of input name, e-mail and phone. If the mouse is above the button and if the validation isn't correct, 
 *  the border of the elements ltitlename, ltitleemail, ltitlephone and text "This field is required" will be red.
*/
function validityFalseAboveButtonRedBorder(){
    let statusValidationName = document.getElementById('ltitlename');
    let statusValidationEmail = document.getElementById('ltitleemail');
    let statusValidationPhone = document.getElementById('ltitlephone');

    removesFocusFromInputField();
    changeBackColorFromButtonAddContactPage();
    checkValidationByTrueBorderRed(statusValidationName,statusValidationEmail,statusValidationPhone);
}

/**
 *  This function check the Validation from input field and if it true, the color of border will be red.
 */
function checkValidationByTrueBorderRed(statusValidationName,statusValidationEmail,statusValidationPhone){
    if(!statusValidationName.checkValidity() || !statusValidationEmail.checkValidity() || !statusValidationPhone.checkValidity()){
        document.getElementById('requiredtext').style.border = '2px solid red';
    }
    if(!statusValidationName.checkValidity()){
        checkedNameAndGivesMessage();
    }
    if(!statusValidationEmail.checkValidity()){
        checkedEmailAndGivesMessage();
    }
    if(!statusValidationPhone.checkValidity()){
        checkedPhoneAndGivesMessage();
    }
}

/**
 * This function test the validation of the name and return an statement 
 */
function checkedNameAndGivesMessage(){
    if(screen.width < 1000){
        requiredTextBetweenInputFieldInTheMobileVersion('name');
        document.getElementById('required-name').innerHTML = "* Fill in your whole name";
    } else {
        requiredTextBetweenInputFieldInTheDesktopVersion('name');
        document.getElementById('required-name').innerHTML = "* Fill in your whole name";
    }
}

/**
 * This function test the validation of the email and return an statement 
 */
function checkedEmailAndGivesMessage(){
    if(screen.width < 1000){
        requiredTextBetweenInputFieldInTheMobileVersion('email');
        document.getElementById('required-email').innerHTML = "* The email must be a valid email-address";
    } else {
        requiredTextBetweenInputFieldInTheDesktopVersion('email');
        document.getElementById('required-email').innerHTML = "* The email must be a valid email-address";
    }
}

/**
 * This function test the validation of the phone-number and return an statement 
 */
function checkedPhoneAndGivesMessage(){
    if(screen.width < 1000){
        requiredTextBetweenInputFieldInTheMobileVersion('phone');
        document.getElementById('required-phone').innerHTML = "* Number has to be betw. 9 and 15 digits";
    } else {
        requiredTextBetweenInputFieldInTheDesktopVersion('phone');
        document.getElementById('required-phone').innerHTML = "* Number has to be betw. 9 and 15 digits";
    }
}

/**
 * This function show required text between the gap of the input fields in the mobile version
 */
function requiredTextBetweenInputFieldInTheMobileVersion(choice){
    document.getElementById(`required-${choice}`).style.display = "block";
    document.getElementById(`required-${choice}`).style.margin = "0.3rem 0 0 0.625rem";
    document.getElementById(`required-${choice}`).style.height = "1.5rem";
    document.getElementById(`ltitle${choice}`).style.outline = '2px solid red'; 
}

/**
 * This function show required text between the gap of the input fields in the desktop version
 */
function requiredTextBetweenInputFieldInTheDesktopVersion(choice){
    document.getElementById(`required-${choice}`).style.display = "block";
    document.getElementById(`required-${choice}`).style.margin = "0.5rem 0 0 0.5rem";
    document.getElementById(`required-${choice}`).style.minHeight = "1.932rem";
    document.getElementById(`ltitle${choice}`).style.outline = '2px solid red'; 
}
