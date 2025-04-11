let currenOnDrag = "";
isMobil = checkIsMobil();


/**
* If the User change the size of his windows. This function will check if it needet to switch to mobil-view.
*/
addEventListener("resize", (event) => {
    isMobil = checkIsMobil();
    showDropZone(0, true, false)   
})


/**
* @returns {boolean} isMobil - the gobal isMobil will set to true or false
*/
function checkIsMobil(){
    let isMobil = false;
    let screenwith = window.innerWidth;
    if (screenwith < 1920){
        isMobil = true;
    }
    return isMobil
}


/**
* initialize Dragzone inot board
*/
function show_dragzone(){
    let dragZone = document.querySelectorAll("[drag-zone]");
    for (let i = 0; i < dragZone.length; i++){
        dragZone[i].classList.add("class_show");
    }
    showNoCard(true);
}


/**
*  insert needet elements for each columns for the first time after rerender/load the columns. 
*/
function initDropZone(){
    let columns = document.querySelectorAll("[is-Column]");
    let columnsName = [0,1,2,3]
    showNoCard(false);
    for(let i = 0 ; i < columns.length; i++){
        columns[i].innerHTML += `<div drag-zone class="show_dragzone class_show" ondrop="moveTo(${columnsName[i]})" ondragover="allowDrop(event)"></div>`;
        columns[i].parentElement.innerHTML += `<div drag-zone-mobil class="mobil_dragzon" ondrop="moveTo(${columnsName[i]})" ondragover="allowDrop(event)">Drop Card here</div>`
    }
}


/**
*  just allow to drop your Task in your Element
*/
function allowDrop(ev) {
    ev.preventDefault();
}


/**
*  @param {boolean} visible - to disable/enable the NoTaskCard 
*/
function showNoCard(visible = true){
    let noCardElement = document.querySelectorAll("[is-No-card]");
    for (let i = 0; i < noCardElement.length; i++){
        if(visible){
            noCardElement[i].classList.add("class_show");
        } else{
            noCardElement[i].classList.remove("class_show");
        }
    }
}


/** checks in which view the user is and decide which Drop-Zone is to needed to use
* @param {boolean} atAll - if yes, every element will gets hide/show.
* @param {boolean} visible - if yes, it will shows the selected element otherwise it will be hidden.
*/
function showDropZone(columnId, atAll, visible){
    let isCurrentmobil = checkIsMobil();
    let dragZoneElement = selectViewerQuery()
    loopThoughColumns(dragZoneElement, columnId, atAll, visible);
    if (isCurrentmobil && !visible){
        blurCard(0, true);
    } else if(isCurrentmobil && visible){
        blurCard(columnId)
    }
    if (!visible){
        showNoCard(true);
    } else if(visible){
        showNoCard(false);
    }
}


/**
* @returns {element} element - just select in which view the user actuell is.
*/
function selectViewerQuery(){
    let isCurrentmobil = checkIsMobil();
    let element = ""
    if(isCurrentmobil){
        element = document.querySelectorAll("[drag-zone-mobil]");
    } else if (!isCurrentmobil){
        element = document.querySelectorAll("[drag-zone]");
    }
    return element;
}


/** checks in which view the user is and decide which Drop-Zone is to needed to use
* @param {boolean} dragZoneElement - received from showDropZone -> contains the element go attach hide/show css class
* @param {boolean} atAll - if yes, every element will gets hide/show.
* @param {boolean} visible - if yes, it will shows the selected element otherwise it will be hidden.
*/
function loopThoughColumns(dragZoneElement, columnId, atAll, visible){
    for (let i = 0; i < dragZoneElement.length; i++){
        if(columnId != i && !visible){
            dragZoneElement[i].classList.remove("class_show");
        } else if (columnId != i && visible){
            dragZoneElement[i].classList.add("class_show");
        }
        if (atAll && !visible) {
            dragZoneElement[i].classList.remove("class_show");
        } else if (atAll && visible){
            dragZoneElement[i].classList.add("class_show");
        }
    }
}


/** to blur a element/Card
* @param {boolean} removeAll - set it on to affect all Task.
*/
function blurCard(columnId, removeAll = false){
    let currentAttribute = 0;
    let allElement = document.querySelectorAll("[isCard]");
    for(let i = 0; i < allElement.length; i++){
        if(!removeAll){
            currentAttribute = allElement[i].getAttribute("card-in-column");
            if  (currentAttribute != columnId){
                allElement[i].classList.toggle("addBlur");
            }
        } else {
            allElement[i].classList.remove("addBlur");
        }
    }
}


/** will happen by draggin a card
* @param {boolean} atAllboolean - set it on to affect all Task.
*/
function startDragFrom(columnId, id, atAllboolean = false){
    showDropZone(columnId, atAllboolean, true);
    currenOnDrag = [columnId, id];
}


/**
 * Updates a task's progress in memory
 * @param {string} taskId - ID of the task to update
 * @param {number} newProgress - New progress/category value
 * @returns {Object|null} - Updated task object or null if not found
 */
function updateTaskProgress(taskId, newProgress) {
    const taskIndex = taskObjects.findIndex(t => t.taskID == taskId);
    if (taskIndex !== -1) {
        taskObjects[taskIndex].currentProgress = newProgress;
        return taskObjects[taskIndex];
    }
    return null;
}

/**
 * Saves a task to the backend and refreshes the board
 * @param {Object} task - Task object to save
 * @returns {Promise<void>}
 */
async function saveTaskAndRefresh(task) {
    try {
        await storeTask(task);
        refreshColumnRender();
    } catch (error) {
        console.error("Error saving task:", error);
        refreshColumnRender();
    }
}

/**
 * Will happen when dropping a card in a Drop-Zone. It will move to this column.
 * @param {number} category - a number to switch the column
 */
async function moveTo(category) {
    const taskId = list[currenOnDrag[0]][currenOnDrag[1]]["taskID"];
    list[currenOnDrag[0]][currenOnDrag[1]]["currentProgress"] = category;
    const updatedTask = updateTaskProgress(taskId, category);
    if (updatedTask) {
        await saveTaskAndRefresh(updatedTask);
    }
}


/** reset all settings after the drag event is over. 
* @param {boolean} atAllboolean - set it on to affect all Task.
*/
function endDrag(columnId, atAllboolean){
    showDropZone(columnId, atAllboolean, false);
}


/**
 * Add this function to handle task movement with proper backend communication
 * @param {String} taskId - ID of the task to update
 * @param {Number} newColumn - New column index/progress value
 * @returns {Promise<void>}
 */
async function updateTaskColumn(taskId, newColumn) {
    try {
        const task = taskObjects.find(task => task.taskID == taskId);
        if (!task) {
            console.error(`Task with ID ${taskId} not found`);
            return;
        }
        task.currentProgress = newColumn;
        refreshColumnRender();
    } catch (error) {
        console.error("Error updating task column:", error);
        localStorage.setItem('tasks', JSON.stringify(taskObjects));
        refreshColumnRender();
    }
}