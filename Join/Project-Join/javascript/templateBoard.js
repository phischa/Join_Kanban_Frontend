function templateRefreshCard(columnNumber, id){
  return `
  <div isCard card-in-column="${columnNumber}" class="card" id="ColumnID-${columnNumber}_Task-${id}">
    <div class="category">${generateCategory(columnNumber, id)}</div>
    <div class="headline">${list[columnNumber][id]["title"]}</div>
    <div class="content">${setText(columnNumber, id)}</div>
      ${isSubtask(columnNumber, id)}
    <div class="footer-of-card">
      <div class="submit-user-area">
          ${generateAssignedTo(columnNumber, id, true, 5)}
      </div>
      <div class="priority">
        <img src="${setPriorityImage(columnNumber, id)}">
      </div>
    </div>
</div>
  `
}


function templateCard(columnNumber, id){
  return `<div id="ColumnNumb-${columnNumber}_Id-${id}" draggable="true" onclick="showBlackBox(), openLightboxCard(${columnNumber}, ${id})" ontouchstart="onPressTouchDown(${columnNumber}, ${id})", ontouchend="isTouchUp()" ondragstart="startDragFrom(${columnNumber}, ${id}, false)" ondragend="endDrag(${columnNumber}, true)">
            ${templateRefreshCard(columnNumber, id)}   
          </div>`;
}


function templateLightboxCards(columnNumber, id){
  return `
  <div class="LightboxCards">
    <div class="frow facenter fs-between padding-top"><div class="category">${generateCategory(columnNumber, id)}</div><div class="exit_button-edit-task" onclick='hideBlackbox()'><img src="../img/icons/close-icon-addtask_dark.svg"></div></div>
    <h1>${list[columnNumber][id]["title"]}</h1>
    <p class="LightboxContent-P">${list[columnNumber][id]["description"]}</p>
    <p class="LightboxContent-P"><span>Due date:</span><span>${setDateFormat(columnNumber, id)}</span></p>
    <p class="LightboxContent-P"><span>Priority:</span><span></span>${setPriorityName(columnNumber, id)} <img src="${setPriorityImage(columnNumber, id)}"></span></p>
    <h6>Assign To:</h6>
    <div class="LightboxUserBorder">
    <ol id="cardLightboxUser">
      ${generateAssignedTo(columnNumber, id, false)}
    </ol>
    </div>
    <h6>Subtasks:</h6>
    <ol id="cardLightboxSubtask" class="selectabale magrinForList">
          ${generateListOfSubtask(columnNumber, id)}
    </ol>
    <nav class="lightboxNav">
      <ul>
          <li onclick ="deleteCurrentTask(${columnNumber},${id})">Delete<img src="../img/icons/delete.svg"></li>
          <hr>
          <li onclick ="openEditableMode(${columnNumber},${id})">Edit<img src="../img/icons/edit-black.svg"></li>
      </ul>
    </nav>
  </div>
`
}


function templateLightboxEditTask(columnNumber, id){
  return `
  <div class="lightboxHeader">
  <div class="exit_button-edit-task" onclick='hideBlackbox()'>
      <img src="../img/icons/close-icon-addtask_dark.svg">
  </div>
</div>
<div class="lightboxBuffer"></div>

  <!--#####################################################
      ############             Title         ############## 
      #####################################################-->

  <div class="frow editbox"><h6>Title</h6><div class=required>*</div></div>
  <div class="LightboxTextTitle"><input id="lightboxEditTitle" placeholder="Your Title" value="${list[columnNumber][id]["title"]}"></div>

  <!--#####################################################
      #########           Description           ########### 
      #####################################################-->

  <div class="frow editbox"><h6>Description</h6></div>
  <textarea id="lightboxEditText" class="LightboxTextArea">${list[columnNumber][id]["description"]}</textarea>
  

  <!--#####################################################   
      #########              Due date           ########### 
      #####################################################-->

  <div class="due-date-container d_flex_column">
    <div class="frow editbox"><h6>Due date</h6><div class=required>*</div></div>
      <div class="LightboxTextTitle">
        <input type="date" lang="en" id="ldatename" class="datafield" name="ldatename" value="${list[columnNumber][id]["dueDate"]}"/>
      </div>
  </div>

  <!--#####################################################   
      #########              Priority           ########### 
      #####################################################-->

  <div>
  <h6>Priority</h6>
    <div class="priorityRow">
      <div priorityButton class="priorityButton buttonRed clearColor buttonhover"  id="urgentButton" onclick="setOfValuePrio(0)">Urgent
        <img class="" id="urgentButtonImage"src="../img/icons/urgent-icon.svg"></img>
      </div>                     
      <div priorityButton class="priorityButton buttonYellow clearColor buttonhover"  id="mediumButton" onclick="setOfValuePrio(1)">Medium
        <img class="" id="mediumButtonImage" src="../img/icons/medium-icon.svg"></img>
      </div>
      <div priorityButton class="priorityButton buttonGreen clearColor buttonhover"  id="lowButton" onclick="setOfValuePrio(2)">Low
        <img class="" id="lowButtonImage" src="../img/icons/low-icon.svg"></img>
      </div>
    </div>  
  </div>

  <!--#####################################################
      #########             Assign to           ########### 
      #####################################################-->

      <div class="frow editbox"><h6>Assign to</h6></div>
      
      <div class="selectInputWrapper">
        <div class="selectInput">
          <div boarder="selectBoarder_1" id="selectBoarder_1" class="selectInputBoarder">
              <div id="selectInputArea" class="selectInputArea">
                  <input id="selectInput_1" onkeyup="searchInAssignTo()" placeholder="Search for Contacts" class="selectInputSearchBar searchDisable">
              </div>
              <div onclick="toggleSelectWindows(1)" id="selectOverlay_1" class="selectInputText overlayshow">Select Contacts to assign</div>
              <div class="selectSafeSpace selectAreaSelectorFadeBackgound">
                  <div onclick="toggleSelectWindows(1)" id="selectInputButton_1" class="selectInputIcon"></div>
              </div>
          </div>
        </div>

        <div id="selectArea_1" class="selectArea">

          </div>
      </div>

      <div id="selectInputRenderIcons">
      </div>

  <!--#####################################################
      #########           Edit SubTask          ########### 
      #####################################################-->

      <div class="frow editbox"><h6>Subtasks</h6></div>
  
      <div id ="selectAddInput_1" class="selectInputWrapper selectInputBoarder">

          <div class="selectInput">
                <div onclick="toggleAddWindows(1, true)" id="selectOverlay_1" class="selectInputText overlayshow">Add a new Subtask</div>
                <div class="selectSafeSpace selectAreaSelectorFadeBackgound">
                    <div onclick="toggleAddWindows(1, true)" class="selectInputIcon plusIcon"></div>
                </div>
          </div>

      </div>
  <div class="substaskWindows">
  <ol id="cardLightboxEditSubtask" class="cardLightboxEditSubtask">

  </ol>
  </div>
  <!--#####################################################
      #########           Save Button           ########### 
      #####################################################-->
<nav class="buttonMenu">
  <div id ="savebutton" onclick="checkAndSave(${columnNumber}, ${id})", showBlackBox() class="saveButton">
      <p>OK</p><img src="../img/icons/check-mark.svg">
  </div>
</nav>
`
}


function templateSubTask(columnNumber, id){
    return ` 
        <div class="subtask-bar">    
            <div class="bar">
             <div class="progress-bar" style="width:${returnProgressbar(columnNumber, id)}%;"></div>
            </div>
                ${checkSubtaskdone(columnNumber, id)}/${list[columnNumber][id]["subtasks"].length} Subtasks
            </div>
        `
    }


function refreshtemplateSubtaskInEdit(id){
  return `
  <div class="InEditMainContainer MainContainerHover ">
    <div class="inputBoarder">
      <textarea openEditInputField="${id}" class="SubtaskEditContentInput" id="subtask_${id}_input">${phantomTaskObject["subtasks"][id]["subTaskName"]}</textarea>
    </div>
      <div class="menuInEditSubtask">
        <div class="checkEditIcon smallerIcon" onclick="undoChagesSubtask(${id})"><img src="../img/icons/close-icon-addtask_dark.svg"></div>  
        <hr class="inEditHr">
        <div class="checkEditIcon margin-left-icon" onclick="saveChagesSubtask(${id})"><img src="../img/icons/check-mark.svg"></div>
      </div>
  </div>
  `
}


function templateSubtaskEdit(subtasks, id){
  return `<li class="relativ" id="subtask_${id}">${refreshtemplateSubtaskEdit(subtasks, id)}</li>`
}


function refreshtemplateSubtaskEdit(subtasks, id){
  return `
          <div class="InEditMainContainer">
            <div class="SubtaskEditContent" id="SubtaskEditContent_${id}">${setText(false, false, phantomTaskObject["subtasks"][id]["subTaskName"], 28)}</div>
            </div>
              <div class="menuEditSubtask">
                <div class="subtaskEditIcons editIcon" onclick="makeEditSubtask(${id})"><img src="../img/icons/edit-black.svg"></div>
                <hr>
                <div class="subtaskEditIcons deleteIcon" onclick="deleteSubtask(${id})"><img src="../img/icons/delete.svg"></div>
              </div>
            </div>
          </div>
        `
}


function templateProfilForAssignTo(id, contactId){
    return `
          <div onclick ="changeStatusAssignTo('${contactId}', '${id}')" class="selectAreaSelector">
            <div class="selectAreaValue">
              <div class="selectSafeSpace"><div class="circle red" style="background-color: ${boardContacts[id]["color"]}">${boardContacts[id]["initials"]}</div></div>
              <p>${boardContacts[id]["name"]}</p>
          </div>
            <div class="selectAreaSelectorFadeBackgound"><img src="${checkIsAssignedto(contactId)}"/></div>
          </div>    
          `
}

function templatePopUpMenu(columnId, id){
  return `
  <nav class="popUpMenu">
  <p><img src="../img/icons/gear-fill.svg">Move Card to...</p>
    <ul id="currentPopUpMenu">
    </ul>
    <div class="popUpMenuImg"><img src="../img/icons/gear-fill.svg"></div>
  </nav>
  `
}