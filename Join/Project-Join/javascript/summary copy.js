async function onload() {
    await loadContacts();
    await loadTasks();
    //await loadActualUser();
    renderSummary();
} //asynchrones führt zu leichten verzögerungen.
//Tasks sollten beim finalProduct einmal beim Einloggen geladen werden
//und sind dann die ganze Benuzung verfügbar, anstatt
//auf jeder Seite einzeln geladen werden zu müssen

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

function renderGreeting() {
    renderDaytime();
    renderUserName();
}

function renderDaytime() {
    let daytime = actualHour();
    let greeting = getGreeting(daytime);
    let field = document.getElementById('greetingname');
    if (true) { //Bedingung das User eingloggt ist
        field.innerHTML = greeting + ',';
    } else {
        field.innerHTML = greeting + '!';
    }
}

function getGreeting(daytime) {


    switch (true) {
        case daytime >= 22 && daytime < 24:
            return 'It is nighttime';

        case daytime >= 0 && daytime < 5:
            return 'It is nighttime'

        case daytime >= 5 && daytime < 12:
            return 'Good morning';

        case daytime >= 12 && daytime < 14:
            return 'Lunchtime';

        case daytime >= 14 && daytime < 18:
            return 'Good afternoon';

        case daytime >= 18 && daytime < 22:
            return 'Good evening';

    }
}

function renderUserName() {
    let user;
    try { user = actualUser.name; }
    catch {
        user = "Standardname";
    }
    field = document.getElementById('username');
    field.innerHTML = user;
}

function renderNumberToDo() {
    let field = document.getElementById('number-to-do');
    let number = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].currentProgress == 0) {
            number++;
        }
    }

    field.innerHTML = number;

}

function renderNumberDone() {
    let field = document.getElementById('number-done');
    let number = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].currentProgress == 3) {
            number++;
        }
    }

    field.innerHTML = number;
}

function renderNumberUrgent() {
    let field = document.getElementById('number-urgent');
    let number = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].priority == 'urgent') {
            number++;
        }
    }

    field.innerHTML = number;
}

function renderNumberTaksInBoard() {
    let field = document.getElementById('numberTasksinboard');
    field.innerHTML = tasks.length;

}

function renderNumberInProgress() {
    let field = document.getElementById('number-tasksinprogress');
    let number = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].currentProgress == 1) {
            number++;
        }
    }

    field.innerHTML = number;
}

function renderUpcomingDueDate() {

    let field = document.getElementById('deadlineDate');
    let date = getEarliestDateOfNotDone();
    let danger = isDateEarlierThanTomorrow(date);

    if (danger) {
        //Mach URGENT Farbe und BLINKI BLINKI

        alarm('containerDeadLine', '#FF3D00');
    }
    if (date != 0) {
        date = konvertiereDatum(date);
        field.innerHTML = date;
    } else { field.innerHTML = "no Date" }
}

function renderNumberAwaitingFeedback() {
    let field = document.getElementById('number-awaitingfeedback');
    let number = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].currentProgress == 2) {
            number++;
        }
    }

    field.innerHTML = number;
}

function getEarliestDateOfNotDone() {

    let earliestDate = 0;
    if (tasks.length > 0) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].currentProgress < 3 && tasks[i].dueDate != '') {
                if (earliestDate == 0) {
                    earliestDate = tasks[i].dueDate;
                } else if (earliestDate > tasks[i].dueDate) {
                    earliestDate = tasks[i].dueDate;
                }
            }
        }
    }


    return earliestDate;
}


function getEarliestDateOfUrgent() {

    let earliestDate = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].priority == 'urgent') {
            if (earliestDate == 0) {
                earliestDate = tasks[i].dueDate;
            } else if (earliestDate > tasks[i].dueDate) {
                earliestDate = tasks[i].dueDate;
            }
        }
    }



    return earliestDate;
}



function konvertiereDatum(datumString) {
    // Datum parsen
    let datumTeile = datumString.split('-');
    let jahr = parseInt(datumTeile[0]);
    let monat = parseInt(datumTeile[1]);
    let tag = parseInt(datumTeile[2]);

    // Monatsnamen-Array
    let monatsNamen = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Monatsnamen erhalten
    let monatsName = monatsNamen[monat - 1];

    // Formatieren und zurückgeben
    let formatiertesDatum = monatsName + ' ' + tag + ', ' + jahr;
    return formatiertesDatum;
}


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


function alarm(divId, hexFarbe) {
    let divElement = document.getElementById(divId);
    let interval1 = setInterval(blinken, 1000); // Intervall von 1 Sekunde
    let interval2;


    surroundDivElement = document.getElementById('prioContent');

    surroundDivElement.addEventListener('mouseover', function () {
        divElement.style.backgroundColor = '#2A3647';
        divElement.style.transition = 'background-color 0.3s ease-in-out';
        clearInterval(interval1);
        interval2 = setInterval(blinkenMouseover, 1000); // Intervall von 1 Sekunde

    });

    surroundDivElement.addEventListener('mouseout', function () {
        divElement.style.backgroundColor = '#FFFFFF';
        divElement.style.transition = 'background-color 0.0s ease-in-out';
        interval1 = setInterval(blinken, 1000);
        clearInterval(interval2); // Intervall von 1 Sekunde
    });



    function blinken() {
        let aktuelleFarbe = divElement.style.backgroundColor;
        let neueFarbe;


        if (aktuelleFarbe == '') {
            neueFarbe = hexFarbe;
            divElement.style.backgroundColor = neueFarbe;
        } else if (aktuelleFarbe == hexToRgb(hexFarbe)) {

            neueFarbe = '#FFFFFF';
            divElement.style.backgroundColor = neueFarbe;


        } else if (aktuelleFarbe == hexToRgb('#FFFFFF')) {
            neueFarbe = hexFarbe;
            divElement.style.backgroundColor = neueFarbe;
        }

    }


    function blinkenMouseover() {

        let aktuelleFarbe = divElement.style.backgroundColor;
        let neueFarbe;


        if (aktuelleFarbe == '#FFFFFF') {
            neueFarbe = '#2A3647';
            divElement.style.backgroundColor = neueFarbe;
        } else if (aktuelleFarbe == hexToRgb(hexFarbe)) {

            neueFarbe = '#2A3647';
            divElement.style.backgroundColor = neueFarbe;



        } else if (aktuelleFarbe == hexToRgb('#2A3647')) {
            neueFarbe = hexFarbe;
            divElement.style.backgroundColor = neueFarbe;


        }





    }
}

function hexToRgb(hex) {
    // Entferne das #, falls vorhanden
    hex = hex.replace('#', '');

    // Teile den Hexadezimalwert in rote, grüne und blaue Werte auf
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);

    // Konvertiere die RGB-Werte in das RGB-Format
    var rgb = 'rgb(' + r + ', ' + g + ', ' + b + ')';

    return rgb;
}









function getActualDate() {
    var jetzt = new Date();
    var jahr = jetzt.getFullYear();
    var monat = ('0' + (jetzt.getMonth() + 1)).slice(-2); // Monat (von 0 bis 11) auf 1-basiert ändern und führende Nullen hinzufügen
    var tag = ('0' + jetzt.getDate()).slice(-2); // Tag mit führenden Nullen hinzufügen

    return jahr + '-' + monat + '-' + tag;
}

function actualHour() {
    let now = new Date();
    let hour = now.getHours();
    return hour;
}



function goToBoard() {
    window.location.href = './board.html'
}