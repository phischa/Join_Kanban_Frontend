let latestTouchPressedTime = 0;
let holdingtime = 650;
let currentTimeOutId = "";
let currentElementId = []


/**
* The trick is to compare a time value, who gets set after starting a touch event 
* with the time after holdingtime is running though.
* So, is the the current value smaller than the lastest start value - which is only possible, if holdingtime is still running, the menu wont't pop up.
* But if the current time is bigger - the menu will open up by itself
*/


/**
*  To close the DropdownMenu by clicking anywhere else.
*/
function loadEventListenerForDropMenu(){
    document.addEventListener("click", closePopMenu)
}


/**
*  starts a timer to enable and compare the holding-touch-time.
*/
function onPressTouchDown(columnId, id){
    latestTouchPressedTime = Date.now();
    currentTimeOutId = setTimeout(isTimeOver, holdingtime);
    currentElementId = [columnId, id]
}


/**
*  checks if holdingtime is over and opens the menu.
*/
function isTimeOver(){
    let currentTime = Date.now();
    if(currentTime - holdingtime >= latestTouchPressedTime){
        createPopUpMenu(currentElementId[0],currentElementId[1]);
        document.getElementById(`ColumnNumb-${currentElementId[0]}_Id-${currentElementId[1]}`).addEventListener("click", function(event){event.preventDefault()})
    }
}


/**
*  resets the timer if user stops the Touch-Event to early.
*/
function isTouchUp(){
   clearTimeout(currentTimeOutId);
}


/**
*  function to open a menu
*/
function createPopUpMenu(){
    let elementId = document.getElementById(`ColumnID-${currentElementId[0]}_Task-${currentElementId[1]}`);
    let newNode = document.createElement("div");
    deletePopUpMenu();
    newNode.setAttribute("id", "newPopUpMenu");
    newNode.setAttribute("popUpMenu", "")
    newNode.setAttribute("ontouch", "preventClick(event)");
    newNode.setAttribute("onclick", "preventClick(event)");
    elementId.insertAdjacentElement('beforeend', newNode);
    renderPopMenu();
    renderOption(currentElementId[0]);
}


/**
*  function to delte a menu from html
*/
function deletePopUpMenu(){
    let elements = document.querySelectorAll(`[popUpMenu]`)
    for (let i = 0 ; i < elements.length; i++){
        elements[i].remove();
    }
}


/**
*  function to render menu to html
*/
function renderPopMenu(){
    let content = document.getElementById("newPopUpMenu");
    content.innerHTML = templatePopUpMenu(currentElementId[0],currentElementId[1]);
}


/**
* for clicking inside the menu without closing itself.
*/
function preventClick(event){
    event.stopPropagation();
}


/**
* will render all possible options to menu.
*/
function renderOption(columnId){
   let content = document.getElementById("currentPopUpMenu");
   let contentArray = [
    `<li onclick="moveCardTo(${currentElementId[0]}, ${currentElementId[1]}, 0)">To do</li>`,
    `<li onclick="moveCardTo(${currentElementId[0]}, ${currentElementId[1]}, 1)">In Progress</li>`,
    `<li onclick=" moveCardTo(${currentElementId[0]}, ${currentElementId[1]}, 2)">Await feedback</li>`,
    `<li onclick="moveCardTo(${currentElementId[0]}, ${currentElementId[1]}, 3)">Done</li>`,
   ];
   content.innerHTML = "";
   for (let i = 0; i < 4; i++){
        if (i != columnId){
            content.innerHTML += contentArray[i];
        }
    }
}


/**
* switch card to new location/column and save it to storage
*/
async function moveCardTo(columnId, id, newColumnId){
    let content = document.getElementById("newPopUpMenu");
    list[columnId][id]["currentProgress"] = newColumnId;
    content.innerHTML = "<div playAnimation class='savePopMenuChange PopMenuAnimation'>Position of your<br>Card has changed.<div class='PopMenuImg'><img src='../img/icons/check-mark.svg'></div></div>";
    setTimeout(closePopMenu, 1250);
    await saveCurrentTask(columnId, id, false);
    setTimeout(playAnimation, 50);
}


/**
* to remove the Animation-Class and to start an animation.
*/
function playAnimation(){
    let elements =  document.querySelectorAll("[playAnimation]");
    for(let i = 0; i < elements.length; i++){
        elements[i].classList.remove("PopMenuAnimation");
    }
}

/**
* to close menu and reset all columns.
*/
function closePopMenu(){
    deletePopUpMenu()
    refreshColumnRender();
}