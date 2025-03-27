/**
* to open and close the assign-to-area
* @param {number} id -to made it modular and add more selectboxes it need a id
*/
function toggleSelectWindows(id){
    let overlay = document.getElementById(`selectOverlay_${id}`);
    let input = document.getElementById(`selectInput_${id}`);
    let selectarea = document.getElementById(`selectArea_${id}`)
    let button = document.getElementById(`selectInputButton_${id}`)
    let boarder =  document.getElementById(`selectBoarder_${id}`);
    overlay.classList.toggle("overlayshow");
    input.classList.toggle("searchDisable");
    selectarea.classList.toggle("dshow");
    button.classList.toggle("arrowUpIcon");
    boarder.classList.toggle("boarderBlue");
}


/**
* to open and close the Subtask Area
* @param {number}  id - to made it modular and add more selectboxes it need a id.
* @param {boolean} turnOn - is element is already open or in closed state.
* @param {boolean} isToSave - for saveing a new Subtask.
*/
function toggleAddWindows(id, turnOn, isToSave = false){
    delerror();
    let checkIsSaved = true
    let content = document.getElementById(`selectAddInput_${id}`);
    if(isToSave){
        checkIsSaved = addNewSubTask(id);
    }
    if(turnOn || !checkIsSaved){
        content.innerHTML = renderAddInputFieldTurnOn(id);
    } else {
        content.innerHTML = renderAddInputFieldTurnOff(id);
    }
}


/** 
* create a new Element and set it after his original parent element
* is needed to create error Element
* @param {element} elementId  - send the whole parentelemnt as Variable
* @param {string} text - to create a error text. 
*/
function seterror(elementId, text){
    let textNode = document.createTextNode(`${text}`);
    let newNode = document.createElement("div");
    newNode.appendChild(textNode);
    newNode.setAttribute("class", "errorIsOn");
    newNode.setAttribute("error", "");
    elementId.setAttribute("data-error", "");
    elementId.classList.add("errorBoarder");
    elementId.insertAdjacentElement('afterend', newNode);
}


/*
* looking for all elements with an 'error' + 'data-error' Attriibute and delete them
*/
function delerror(){
    let allErrors = document.querySelectorAll("[error]");
    let allBorder = document.querySelectorAll("[data-error]");
    for(let i = 0; i < allErrors.length; i++){
        allErrors[i].remove();
    }
    for(let i = 0; i < allBorder.length; i++){
        allBorder[i].classList.remove("errorBoarder");
    }
}


/*
* template for Edit-Subtask-Area
*/
function renderAddInputFieldTurnOn(id){
    return `
    <div class="selectInput">
        <div id="selectInputArea" class="selectInputArea">
            <input id="selectAddInputField_${id}" placeholder="Add your Task here" class="selectInputSearchBar">
        </div>
        <div class="selectSafeSpace selectAreaSelectorFadeBackgound FadeBackgoundBigger">
            <div class="selectEditMenu">
                <div onclick="toggleAddWindows(${id}, false)" class="selectInputIcon undoIcon"></div>
                <hr>
                <div onclick="toggleAddWindows(${id}, false, true)" class="selectInputIcon checkIcon"></div>
            
        </div>
    </div>
    `
}


function renderAddInputFieldTurnOff(id){
    return `
    <div class="selectInput">
        <div onclick="toggleAddWindows(${id}, true)" id="selectOverlay_1" class="selectInputText overlayshow">Add a new Subtask</div>
        <div class="selectSafeSpace selectAreaSelectorFadeBackgound">
            <div onclick="toggleAddWindows(${id}, true)" class="selectInputIcon plusIcon"></div>
        </div>
    </div>
    `
}