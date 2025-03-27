/**
 * This function uses the "w3 include method" to include HTML templates.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    }
  }
  hideSidebar();
  searchAndHideElements();
  await initialsOf();
}

/**
 * This function hides parts of the header on the legal and privacy pages.
 */
async function searchAndHideElements() {
  let isToHide = document.querySelectorAll("[isToHide]")
  if (isToHide.length > 0) {
    let elements = document.querySelectorAll("[toHideElement]")
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add("hideElement");
    }
  }
}

/**
 * This function hides parts of the sidebar on legalResticted.html and privacyRestricted.html.
 */
async function hideSidebar() {
  let hideSidebar = document.querySelectorAll("[hideSidebar]")
  if (hideSidebar.length > 0) {
    let sidebar = document.querySelectorAll("[toHideSidebar]")
    for (let i = 0; i < sidebar.length; i++) {
      sidebar[i].classList.add("hideElement");
    }
  }
}

/**
 * This function switches the navbar on or out if the user clicks on the circle in the top corner.
 */
function openNavbar() {
  document.getElementById('navbar').classList.toggle('d-none');
}

/**
 * This function hides the navbar if the user clicks on the main container.
 */
function closeNavbar() {
  document.getElementById('navbar').classList.add('d-none');
}

/**
 * function gets the initials of the name of the user which is logged in and gives them to the next function.
 */
async function initialsOf() {
  if (actualUser && actualUser["name"]) {
    let words = actualUser["name"].split(" ");
    let initials = "";
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      initials += word.charAt(0).toUpperCase();
    }
    addInitialsToHeader(initials);
  } else {
    addLetterGToHeader();
  }
}
/**
 * function inserts the initials into the div with the id='initialname'
 * @param {string} initials
 */
function addInitialsToHeader(initials) {
  let insert = document.getElementById("initialname");
  insert.innerHTML = "";
  insert.innerHTML = `${initials}`;
}

/**
 * function adds letter G for guest into the div with the id='initialname'
 */
function addLetterGToHeader() {
  let insert = document.getElementById("initialname");
  insert.innerHTML = "";
  insert.innerHTML = "G";
}

function capitalizeName(name) {
  let names = name.split(' ');
  let capitalizedNames = [];
  for (let i = 0; i < names.length; i++) {
      let capitalizedWord = names[i].charAt(0).toUpperCase() + names[i].slice(1).toLowerCase();
      capitalizedNames.push(capitalizedWord);
  }
  let formattedName = capitalizedNames.join(' ');
  return formattedName;
}

/**
 * function creates a random color. Used in creating contacts.
 * @returns {String} colorhexCode
 */
function createContactColor() {
  let color;
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  color =
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0");
  return color;
}

/**
 * function is given a canvas, a text and a color. It then draws on given Canvas a circle
 * with the given color and puts the Text (Initials of a Contact) into it.
 * @param {String} colorCode
 * @param {String} text
 * @param {String} canvasID
 */
function drawColoredCircle(colorCode, text, canvasID) {
  let canvas = document.getElementById(canvasID);
  let ctx = canvas.getContext("2d");
  let centerX = canvas.width / 2;
  let centerY = canvas.height / 2;
  let radius = canvas.height / 2 - 2;

  ctx.imageSmoothingEnabled = false;
  ctx.imageSmoothingQuality = "high";
  // Circle Background
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = colorCode;
  ctx.fill();
  // Brightness
  let brightness = calculateBrightness(colorCode);
  // TExtcolor white or black depending on britghntess of color
  let textColor = brightness > 128 ? "#000000" : "#ffffff";
  // text specifications
  ctx.font = "1rem Inter";
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // finally drawing the circle
  ctx.fillText(text, centerX, centerY);
}

/**
 * function calculates Brightness of a given color.
 *
 * @param {String} hexColor
 * @returns {number} - brightness
 */
function calculateBrightness(hexColor) {
  //get rgb values
  let r = parseInt(hexColor.substring(1, 3), 16);
  let g = parseInt(hexColor.substring(3, 5), 16);
  let b = parseInt(hexColor.substring(5, 7), 16);
  // calculate brightness
  let brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness;
}
