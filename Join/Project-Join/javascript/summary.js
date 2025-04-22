/**
 * loads function that have to be loaded upFront.
 */
async function onload() {
  //await loadActualUser();
  initMobileGreeting();
  await loadContacts();
  await loadTasks();
  await initialsOf();
  renderSummary();
}

/**
 * Renders all html fields for the Site
 */
function renderSummary() {
  renderGreeting();
  renderNumberToDo();
  renderNumberDone();
  renderNumberUrgent();
  renderUpcomingDueDate();
  renderNumberTaksInBoard();
  renderNumberInProgress();
  renderNumberAwaitingFeedback();
}

/**
 * Renders the Greeting Area, consisting of Daytime and the Username, if a User
 * is logged in.
 */
function renderGreeting() {
  renderDaytime("greetingname");
  renderUserName("username");
}

/**
 * Renders the Daytime for the greeting and
 * chosing the right punctuation, in case there is a personal
 * greeting for a logged in user
 */
function renderDaytime(divId) {
  let daytime = actualHour();
  let greeting = getGreeting(daytime);
  let field = document.getElementById(divId);
  let username = localStorage.getItem('username');
  if (username) {
    //Condition that a User is logged in
    field.innerHTML = greeting + ",";
  } else {
    field.innerHTML = greeting + "!";
  }
}

/**
 * this function is given the hour of the day and  returns
 * an apropiate Greeting text
 * @param {Number} daytime
 * @returns {String} apropiate Greeting text
 */

function getGreeting(daytime) {
  switch (true) {
    case daytime >= 22 && daytime < 24:
      return "It is nighttime";

    case daytime >= 0 && daytime < 5:
      return "It is nighttime";

    case daytime >= 5 && daytime < 12:
      return "Good morning";

    case daytime >= 12 && daytime < 14:
      return "Lunchtime";

    case daytime >= 14 && daytime < 18:
      return "Good afternoon";

    case daytime >= 18 && daytime < 22:
      return "Good evening";
  }
}

/**
 * functions renders the Username for a loggedIn User
 * or returns an empty string if no user is logged in
 */
function renderUserName(divID) {
  let user;
  let username = localStorage.getItem('username');
  field = document.getElementById(divID);

  if (username) {
    user = username;
    field.innerHTML = user;
  } else {
    field.innerHTML = "";
  }
}

/**
 * function renders the amount of tasks with the progress
 * "to Do"
 */
function renderNumberToDo() {
  let field = document.getElementById("number-to-do");
  let number = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].currentProgress == 0) {
      number++;
    }
  }
  field.innerHTML = number;
}

/**
 * function renders the amount of tasks with the progress
 * "done"
 */

function renderNumberDone() {
  let field = document.getElementById("number-done");
  let number = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].currentProgress == 3) {
      number++;
    }
  }
  field.innerHTML = number;
}

/**
 * function renders the amount of tasks with the priority
 * "urgent"
 */
function renderNumberUrgent() {
  let field = document.getElementById("number-urgent");
  let number = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].priority == "urgent") {
      number++;
    }
  }
  field.innerHTML = number;
}

/**
 * functions renders the amount of tasks in the whole board
 */
function renderNumberTaksInBoard() {
  let field = document.getElementById("numberTasksinboard");
  field.innerHTML = tasks.length;
}

/**
 *  funtion renders the amount of tasks with the progress
 * "in progress"
 */
function renderNumberInProgress() {
  let field = document.getElementById("number-tasksinprogress");
  let number = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].currentProgress == 1) {
      number++;
    }
  }
  field.innerHTML = number;
}

/**
 * function renders the earlist upcoming duedate and
 * triggers an alarm if need be
 */
function renderUpcomingDueDate() {
  let field = document.getElementById("deadlineDate");
  let date = getEarliestDateOfNotDone();
  let danger = isDateEarlierThanTomorrow(date);
  let holdTaskId = "";
  if (danger) {
    //Mach URGENT Farbe und BLINKI BLINKI
    alarm();
  }
  if (date != 0) {
    date = convertDate(date);
    field.innerHTML = date;
  } else {
    field.innerHTML = "no Date";
  }
}

/**
 * function renders amount of tasks with progress
 * "await feedback"
 */
function renderNumberAwaitingFeedback() {
  let field = document.getElementById("number-awaitingfeedback");
  let number = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].currentProgress == 2) {
      number++;
    }
  }

  field.innerHTML = number;
}

/**
 * function delivers earliest date of all tasks with the progess "not done" and
 * then remembers what task exactly had the earliest date of them all.
 * @returns {number}
 */
function getEarliestDateOfNotDone() {
  let earliestDate = 0;
  if (tasks.length > 0) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].currentProgress < 3 && tasks[i].dueDate != "") {
        if (earliestDate == 0 || earliestDate > tasks[i].dueDate) {
          earliestDate = tasks[i].dueDate;
          holdTaskId = tasks[i]["taskID"];
        }
      }
    }
  }
  return earliestDate;
}

/**
 * functon converts a DateString from format yyyy-mm-dd to format month-dd-yyyy
 * @param {String} datumString
 * @returns {String}
 */

function convertDate(dateString) {
  // Datum parsen
  let dateParts = dateString.split("-");
  let year = parseInt(dateParts[0]);
  let month = parseInt(dateParts[1]);
  let day = parseInt(dateParts[2]);

  // Monatsnamen-Array
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Monatsnamen erhalten
  let monthsName = monthNames[month - 1];

  // Formatieren und zurückgeben
  let formattedDate = monthsName + " " + day + ", " + year;
  return formattedDate;
}

/**
 * functions checks if a given date is earlier than the date of tomorrow
 *
 * @param {date} date
 * @returns {boolean}
 */
function isDateEarlierThanTomorrow(date) {
  let danger = false;
  let actualDate = getActualDate();

  if (date <= actualDate) {
    danger = true;
  } else {
    danger = false;
  }

  return danger;
}

/**
 * function returns the actual date in format yyyy-mm-dd
 * @returns {String}
 */
function getActualDate() {
  let now = new Date();
  let year = now.getFullYear();
  var month = ("0" + (now.getMonth() + 1)).slice(-2); 
  var day = ("0" + now.getDate()).slice(-2); 

  return year + "-" + month + "-" + day;
}

/**
 * function returns the actual hour of the day
 * @returns {Number}
 */
function actualHour() {
  let now = new Date();
  let hour = now.getHours();
  return hour;
}

/**
 * function goes to the board and at the same time searches for the task
 * which id is stored
 */
function goToBoard() {
  window.location.href =
    "./board.html?findtaskbyid=" + encodeURIComponent(holdTaskId);
}

/**functions goes to Board */
function goToBoardUsual(mark) {
  window.location.href = `./board.html#${mark}`;
}

/**
 * controls the greeting with a modal when the page is in responsive mode
 * the delay of fadeout and hide has to be adjusted to the length of the
 * fadeout animation and the time the user is shown the modal
 */
function initMobileGreeting() {
  disableScroll();
  renderMobileModal();
  setTimeout(faddeoutModal, 800);
  setTimeout(hideModal, 1200);
}

/**
 * hide the responsive greeting modal after a given time
 */
function hideModal() {
  let greetingModal = document.getElementById("modalMobileGreeting");
  greetingModal.style.display = "none";
  enableScroll();
}

/**
 * fades aout the modal, the time needed for that is written in the CSS
 * for #modalMobileGreeting
 */
function faddeoutModal() {
  let greetingModal = document.getElementById("modalMobileGreeting");
  greetingModal.style.opacity = 0;
}

/**
 * renders the mobile Greeting Modal
 */
function renderMobileModal() {
  renderDaytime("greetingname2");
  renderUserName("username2");
}

/**
 * function is called when Mobile greeting is active to
 * prevent user from scrolling when the modal is shown
 *
 */
function disableScroll() {
  document.body.style.overflow = "hidden";
}

/**
 * function is called when mobile greeting is over to let
 * the user scroll again
 */
function enableScroll() {
  document.body.style.overflow = ""; // Setzt den Overflow-Stil zurück, um das Scrollen zu aktivieren
}
