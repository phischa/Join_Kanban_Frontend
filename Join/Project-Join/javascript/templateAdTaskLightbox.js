function templateAddTaskLightbox(){
    return `
    <div class="lightboxHeader">
    <div class="exit_button-edit-task" onclick='delteEventListener(), hideBlackbox()'>
        <img src="../img/icons/close-icon-addtask_dark.svg">
    </div>
</div>
<div class="lightboxBuffer"></div>
<section onclick="CheckforUnclosedWindows(), checkAssignedEventArea()" class="main-container-atBoard">
<div id="content"class="content-wrapper-addTask whiteBackground"> 
  <h1>Add Task</h1>
  <div id="content-box"class="">
    <div class="title-description-container">
      <form autocomplete="off">
        <div class="d_flex_column">
          <div class="container-title-inputfield d_flex_column">
            <label for="ltitlename">Title<span class="letter-star">*</span></label> 
            <input id="ltitlename" lang="en" name="ltitlename" type="text" placeholder="Enter a title" required />
          </div>
        <div class="container-description-inputfield d_flex_column">
          <label for="ldescriptionname">Description</label> 
          <textarea id="ldescriptionname" name="ldescriptionname" placeholder="Enter a Description"></textarea>
        </div>  
          <div class="container-assigned-optionfield d_flex_column">
            <p class="p-headline">Assigned to</p>
            
            <div class="multiselect" id="multiSelectContact">
              <div class="selectBox" id="selectBox" onchange="checkCreateTask()" onclick="showCheckboxes()" onkeyup="processInputForFilter()">
                  <div id="selectfield" >
                      Select an option
                      <img id="selectImage" src="../img/icons/arrow_drop_downaa.svg">
                  </div>
                  <div id="searchfield">
                  <input type="text" id="inputfeld" onfocus="multiselectFocus()" onblur="multiselectBlur()" placeholder="Search Contacts"/>
                  <img id="searchImage" src="../img/icons/arrow_drop_up.svg">
                  </div>        
  
                  <div class="overSelect"></div>
              </div>
  
  
  
              <div id="checkboxes">
  
                  <label class="optionRow" for="one">
                      <canvas class="dropdownMenuCanvas" width="48" height="48" id="ctx1"></canvas>
                      <div class="boxNameAndSelect">
                          First checkbox
                          <img src="../img/icons/check-button-mobile-uncheck.svg" id="four" />
                      </div>
                  </label>
                  
                  <label class="optionRow" for="two">
                      
                    <canvas class="dropdownMenuCanvas" width="48" height="48" id="ctx2"></canvas>
                    <div class="boxNameAndSelect">
                          Second checkbox
                          <img src="../img/icons/check-button-mobile-uncheck.svg" id="four" />
                    </div>
                  </label>
                  
                  <label class="optionRow" for="three">
                    <canvas class="dropdownMenuCanvas" width="48" height="48" id="ctx3"></canvas>
                      <div class="boxNameAndSelect">
                        Third checkbox
                        <img src="../img/icons/check-button-mobile-uncheck.svg" id="four" />
                      </div>
                      
                  </label>
            
                  <label class="optionRow" for="four">
                    <canvas class="dropdownMenuCanvas" width="48" height="48" id="ctx4"></canvas>
                      <div class="boxNameAndSelect">
                        Fourth Checkbox
                        <img src="../img/icons/check-button-mobile-uncheck.svg" id="four" />
                      </div> 
                  </label>
              </div>
          </div>
   </div>
        </div>
        <div id="assignedContactsRenderArea"> </div>
    </div>
    <div class="line"></div>
    <div class="date-prio-container">
      <div class="d_flex_column" >
        <div class="due-date-container d_flex_column">
          <label for="ldatename">Due date<span class="letter-star">*</span></label> 
          <input onchange="checkRequirementsDuetate(), checkCreateTask()" type="date" lang="en" id="ldatename" name="ldatename" placeholder="Datum"/>
        </div>
        <div class="prio-container d_flex_column">
          <p class="p-headline">Prio</p>
          <div class="d_flexdirection_r d_flex_c_sb extraGap">
            <div class="prio-button d_flex_c_c " id="urgentButton" onclick="pressUrgentButton()">Urgent
              <img class="dimension-prio-icon" id="urgentButtonImage"src="../img/icons/urgent-icon.svg"></img>
            </div>                     
            <div class="prio-button d_flex_c_c" id="mediumButton" onclick="pressMediumButton()">Medium
              <img class="dimension-prio-icon" id="mediumButtonImage" src="../img/icons/medium-icon.svg"></img>
            </div>
            <div class="prio-button d_flex_c_c" id="lowButton" onclick="pressLowButton()">Low
              <img class="dimension-prio-icon" id="lowButtonImage" src="../img/icons/low-icon.svg"></img>
            </div>
          </div>  
        </div>
        <div class="category-container d_flex_column">
          <label for="lcategoryname">Category<span class="letter-star">*</span></label>          
          <select id="lcategoryname" onchange="checkCreateTask()" onfocus="focusCategory()" onblur="blurCategory()"  onclick="changeSelectArrow()">
            <option value="Select task category" disabled selected>Select task category</option>
            <option value="technicalTask">Technical Task</option>
            <option value="userStory">User Story</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="refactor">Refactor</option>
            <option value="documentation">Documentation</option>
            <option value="Testing">Testing QA</option>
            <option value="Analysis">Analysis/Research</option>
            <option value="Design">Design</option>
          </select>
        </div>

        <div class="subtask-container d_flex_column">
          <label for="lsubtaskname">Subtask</label> 

          <div class="subTaskWrapper">
          <div id="subTaskInputField" onclick="decideAddSubTaskEditClick()">  
              <input  type="text"  id="lsubtaskname" name="ltextname" placeholder="Add new subtask" onfocus="focusSubtaskInput()" onblur="blurSubtaskInput()" onclick="pressAddSubtaskButton()"  />
              <div id="subTaskInputFieldButtonArea">
                  <div  id="addButton"><img id="addButtonIcon"src="../img/icons/SubtasksIconAdd.svg" onclick="pressAddSubtaskButton()"></div>
                  <div class="noDisplay" id="CancelAndOkButtonArea">
                      <div id="cancelButton" class="noDisplay"><img onclick="pressCancelSubtaskButton(), setBorderAtSubtask()" class="noDisplay" id="cancelIcon" src="../img/icons/close-icon-addtask.svg"></div>
                      <div id="okButton" class = "noDisplay"><img onclick="pressConfirmSubtaskButton(), setBorderAtSubtask()" class ="noDisplay" id="checkIcon" src="../img/icons/check-icon-adTask_black.svg"></div>
                  </div>
              </div>
              
          </div> 
          <div isOnBoard id="subtaskRenderAreaList"></div>
        </div>
          
        </div>     
      </div>  
      
      
      
        </div>
      

    </div>   
    
    <div class="d_flexdirection_r" id="renderArea">

        

          
    
    </div>

    <div class="button-container">
    <div class="textfield" >
      
      <div id="requiredText">
      <span class="letter-star">*</span>
      This field is required
      </div>
      
    </div>
    <div class="distance-buttons">
      <button class="button-clear d_flex_c_c"  type="reset" onclick="clearForm()"><span class="clear">Clear</span>
        <img class="dimension-close-icon" src="../img/icons/close-icon-addtask.svg"></img>
      </button>
      <button id="createTaskButton" type="submit" class="d_flex_c_c" disabled onsubmit="" onmouseover="checkCreateTask()" onclick="submitTaskOnBoard()" ><span class="createtask">Create Task</span>
        <img class="dimension-createtask-icon" src="../img/icons/check-icon-addtask.svg"></img>
      </button>
    </div>               
  </div>
    </form>
</div>          
</section>




<div id="modalConfirmTaskCreated">
<div id="modalContent">
<div id="modalContentText">Task added to board</div>
<div id="modalContentImage"><img id="addedTaskImg" src="../img/icons/addedToBoard-white.svg"></div>
</div>

</div>
`
}