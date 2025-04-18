/**
* after clicking on a card it opens a lightbox which contains the content of the current selected task.
*/
function openLightboxCard(columnNumber, id){
    let content = document.getElementById("cardLightboxContent");
    delteEventListener();
    content.innerHTML = templateLightboxCards(columnNumber, id);
}


/**
* set the image in lightbox to symbolize a task is already done. 
*/
function setSubtaskImage(columnNumber, id, i){
    let imagePath = "../img/icons/check-button-mobile-uncheck.svg";
    isTaskDone = list[columnNumber][id]["subtasks"][i]["done"];
    if (isTaskDone){
        imagePath = "../img/icons/check-button-mobile-check.svg";
    }
    return imagePath;
}


/**
* Sometimes a task doesn't include Subtasks. In this Case the Task-Card gets a hr to separate the elemnts inside of it. 
* Just a visual effect in the Task- Element/Card.
*/
function setDateFormat(columnNumber, id){
    let currentDate = list[columnNumber][id]["dueDate"].split("-");
    let newDateFormat = currentDate[2] + "/" + currentDate[1] + "/" + currentDate[0]
    return newDateFormat
}


/**
* Set and returns the current priority of a task.
*/
function setPriorityName(columnNumber, id){
    let currentPriority = list[columnNumber][id]["priority"];
    currentPriority = toTitleWord(currentPriority);
    return currentPriority
}


/**
* is used for priority to title up the current Word.
* in case there is no priority selected it returns 'Aktuell keine Prio'.
* @param {string} - just your word, which you want to title.
*/
function toTitleWord(string){
    let newString = null;
    if(string){
    let firstLetter = string[0];
    firstLetter = firstLetter.toUpperCase();
    string = string.substr(1).toLowerCase();
    newString = firstLetter + string;
    } else{
        newString = "Aktuell keine Prio"
    }
    return newString
}


/**
* Switch the Status of a Subtask in done/unfinished by clicking on.
* @param {number} subtaskId - index of the current subtask in task.
*/
function changeStatusSubtask(columnNumber, id, subtaskId){
    let substaskStatus = list[columnNumber][id]["subtasks"][subtaskId]["done"];
    if (substaskStatus){
        list[columnNumber][id]["subtasks"][subtaskId]["done"] = false;
    } else{
        list[columnNumber][id]["subtasks"][subtaskId]["done"] = true;
    }
    resetLightboxAndCard(columnNumber, id, "cardLightboxSubtask");
    saveCurrentTask(columnNumber, id);
}


/**
* by uncheck/check a Subtask the Subtask-Area needs to get refreshed
* @param {number} subtaskId - index of the current subtask in task.
*/
function resetLightboxAndCard(columnNumber, id, elementId){
    let lightbox = document.getElementById("cardLightboxContent");
    let card = document.getElementById(`ColumnNumb-${columnNumber}_Id-${id}`);
    if(elementId){
        lightbox = document.getElementById(elementId);
        lightbox.innerHTML = generateListOfSubtask(columnNumber, id)
    } else {
        lightbox.innerHTML = templateLightboxCards(columnNumber, id);
    }
    card.innerHTML = templateRefreshCard(columnNumber, id);
}


/**
* checks the task if it contains any subtasks and render it inside of lightbox otherwise it will rendering 'Keine Subtasks vorhanden!'.
*/
function generateListOfSubtask(columnNumber, id){
    let currentHTMLCode = "";
    let HTMLCode = "";
    for (let i = 0;  i < list[columnNumber][id]["subtasks"].length;i++){
        currentHTMLCode = `<li onclick="changeStatusSubtask(${columnNumber}, ${id}, ${i})"><img src="${setSubtaskImage(columnNumber, id, i)}"><p>${setText(false, false, ortext = list[columnNumber][id]["subtasks"][i]["subTaskName"], maxLength = 245)}</p></li>`;
        HTMLCode += currentHTMLCode;
    }
    if(list[columnNumber][id]["subtasks"].length <=0){
        HTMLCode = `<div>Keine Subtasks vorhanden!</div>`
    }
    return HTMLCode;
}


/**
* generateAssignedTo() generates small Icons of any User which in involved inside the current task.
* @param {boolean} isForCard - is needet to render it right for card or lightbox.
* @param {number} maxCounter - set a max-amount of rendering icons in your element to prevent overvlow.
*/
function generateAssignedTo(columnNumber, id, isForCard, maxCounter = 5){
    let assignedTo = list[columnNumber][id]["assignedTo"] || [];
    if (!Array.isArray(assignedTo)) assignedTo = [];
    
    console.log("AssignedTo for task:", assignedTo); // Debugging
    
    let currentHTMLCode = "";
    let HTMLCode = "";
    
    for (let i = 0; i < assignedTo.length; i++){
        // Hole den vollständigen Kontakt aus der globalen Kontaktliste
        const contactId = assignedTo[i].contactID;
        const contact = contactsOfAddPage.find(c => c.contactID == contactId) || {
            color: "#6e6ee5",
            initials: "??",
            name: "Unknown"
        };
        
        console.log("Found contact:", contact); // Debugging
        
        if(i < maxCounter && isForCard){
            currentHTMLCode = `<div style="background-color: ${contact.color}" class="avatar">${contact.initials}</div>`;
        } else if (i >= maxCounter && isForCard){
            currentHTMLCode = `<div class="assignToNumber"><div class="numberOfAssignTo">+${assignedTo.length - maxCounter}</div></div>`;
            HTMLCode += currentHTMLCode;
            break;
        } else if(!isForCard){
            currentHTMLCode = `<li><div style="background-color: ${contact.color}" class="circle">${contact.initials}</div><p>${contact.name}</p></li>`;
        }
        HTMLCode += currentHTMLCode;
    } 
    return HTMLCode;
}


/**
* generateTeaserText() is able to trim after specific amount of characters (maxLength) but it will never cut a word. So it cause a offest of a max-length.
* @param {string} taskDescription - the raw text, which you want to trim.
* @param {number} maxLength - the max-length which you want to receive.
*/
function generateTeaserText(taskDescription, maxLength = 32){
    let splitWord = taskDescription.split(" ");
    let cutedText = "";
    for (let i = 0; cutedText.length < maxLength; i++){
        cutedText += splitWord[i] + " ";
    }
    cutedText = cutedText.split(0, -1);
    cutedText += "...";
    return cutedText;
}


/**
* Checks for the current length of a text without any Spaces. It decides and returns if a text is to long.
* @param {sting} taskDescription - raw Text - received by generateTeaserText()
* @param {number} maxLength - received by generateTeaserText()
*/
function checkForMaxLength(text, maxLength = 32){
    let withoutSpace = "";
    let isTextLong = false;
    let splitWord = text.split(" ");
    for(let i = 0; i < splitWord.length; i++){
        withoutSpace += splitWord[i];
    }
    if (withoutSpace.length > maxLength){
        isTextLong = true;
    }
    return isTextLong
}


/**
* Just checks the input - is the input already a text or need to looking for task-description.
* @param {string} text - just raw text.
*/
function receivedTaskOrText(text, columnNumber, id){
    let inputText = "";
    if(text.length > 0){
        inputText = text;
    } else{
        inputText = list[columnNumber][id]["description"];
    }
    return inputText;
}

/**
* To provend overflow in some elements caused by text is just to long. So sometimes the text need to get trimmed down.
* @param {string} ortext - in case you only got a text (if there is no option to fetch it from a task).
* @param {number} maxLength - set a max amount of characters (no Spaces includet!) to cut your text.
*/
function setText(columnId = 0, id = 0, ortext = "", maxLength = 36){
    let taskDescription = receivedTaskOrText(ortext, columnId, id);
    let isTextLong = checkForMaxLength(taskDescription, maxLength);
    let cutedText = "";
    if (isTextLong){
        cutedText = generateTeaserText(taskDescription, maxLength);
    } else {
        cutedText = taskDescription;
        return cutedText;
    }
    return cutedText;
}


/**
* Sometimes a task doesn't include Subtasks. In this Case the Task-Card gets a hr to separate the elemnts inside of it. 
* Just a visual effect in the Task- Element/Card
*/
function isSubtask(columnNumber, id){
    let subtasks = list[columnNumber][id]["subtasks"];
    if (subtasks.length > 0){
        return templateSubTask(columnNumber, id)
    } else{
        return `<hr>`
    }
}