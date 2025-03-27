/**
 * controls the blinking effect of the duedate on the prio urgent task field.
 * the blinking needs to be adjusted in relation to the fact that the prio urgent
 * field has a hovering effect.
 *  *
 */
function alarm() {
  let divElement = document.getElementById("containerDeadLine");
  let interval2;
  let hexFarbe = "#FF3D00";

  //sets the intervall for blinking without hovering
  let interval1 = setInterval(blinken, 1000); // Intervall von 1 Sekunde

  surroundDivElement = document.getElementById("prioContent");

  //sets the intervall when mouse is hovering over
  surroundDivElement.addEventListener("mouseover", function () {
    divElement.style.backgroundColor = "#2A3647";
    divElement.style.transition = "background-color 0.3s ease-in-out";
    clearInterval(interval1);
    interval2 = setInterval(blinkenMouseover, 1000); // Intervall von 1 Sekunde
  });

  //sets the intervall back when mouse is not hovering anymore
  surroundDivElement.addEventListener("mouseout", function () {
    divElement.style.backgroundColor = "#FFFFFF";
    divElement.style.transition = "background-color 0.0s ease-in-out";
    interval1 = setInterval(blinken, 1000);
    clearInterval(interval2); // Intervall von 1 Sekunde
  });
}

/**
 *  function for blinking effect of element which is not hovered over
 * because background color of not hovered div
 */
function blinken() {
  let divElement = document.getElementById("containerDeadLine");
  let aktuelleFarbe = divElement.style.backgroundColor;
  let neueFarbe;
  let hexFarbe = "#FF3D00";

  if (aktuelleFarbe == "") {
    neueFarbe = hexFarbe;
    divElement.style.backgroundColor = neueFarbe;
  } else if (aktuelleFarbe == hexToRgb(hexFarbe)) {
    neueFarbe = "#FFFFFF";
    divElement.style.backgroundColor = neueFarbe;
  } else if (aktuelleFarbe == hexToRgb("#FFFFFF")) {
    neueFarbe = hexFarbe;
    divElement.style.backgroundColor = neueFarbe;
  }
}

/**
 * function for blinking effect of element which is hovered over
 * becasue background color of hovered div
 */
function blinkenMouseover() {
  let divElement = document.getElementById("containerDeadLine");
  let aktuelleFarbe = divElement.style.backgroundColor;
  let neueFarbe;
  let hexFarbe = "#FF3D00";

  if (aktuelleFarbe == "#FFFFFF") {
    neueFarbe = "#2A3647";
    divElement.style.backgroundColor = neueFarbe;
  } else if (aktuelleFarbe == hexToRgb(hexFarbe)) {
    neueFarbe = "#2A3647";
    divElement.style.backgroundColor = neueFarbe;
  } else if (aktuelleFarbe == hexToRgb("#2A3647")) {
    neueFarbe = hexFarbe;
    divElement.style.backgroundColor = neueFarbe;
  }
}

/**
 * functions converts a hex color to a rgb color
 * @param {String} hex
 * @returns {String}
 */
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  let rgb = "rgb(" + r + ", " + g + ", " + b + ")";
  return rgb;
}
