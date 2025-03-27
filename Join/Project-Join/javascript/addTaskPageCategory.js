//----------- UI Handling --------------

/**
 * sets the optical focus on the artificial cateogry field
 */
function focusCategory() {
  document.getElementById("lcategoryname").style.border = "2px solid #25C0D4";
}

/**
 * removes the optical focus of the artificial categroy field
 */
function blurCategory() {
  document.getElementById("lcategoryname").style.border =
    "0.063rem solid #D1D1D1";
}

/**
 * changes the image of the arrow in the category select field depending on 
 * whether the selectfield is expanded or not.
 */
function changeSelectArrow() {
  let select = document.getElementById("lcategoryname");
  let arrowImage;

  if (select.classList.contains("opened")) {
    arrowImage = "arrow_drop_downaa.svg";
  } else {
    arrowImage = "arrow_drop_up.svg";
  }

  select.classList.toggle("opened");

  select.style.backgroundImage = "url('..//img/icons/" + arrowImage + "')";
}

/**
 * Function gets an event (mouseclick on addTaskpage) and 
 * closes the selectmenu with the according arrowchange, when the
 * click was outside of the select menu. 
 * @param {targetElement} targetElement - a mouseclick on the addTaskPage  
 */
function checkCategoryEventArea(targetElement) {
  let selectCategory = document.getElementById("lcategoryname");

  if (!selectCategory.contains(targetElement)) {
    selectCategory.style.backgroundImage =
      "url('..//img/icons/arrow_drop_downaa.svg')";
    selectCategory.classList.remove("opened");
    blurCategory();
  }
}
