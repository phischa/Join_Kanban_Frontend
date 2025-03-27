/**
* The heart of Lightbox -> this function is needet to open a new Lightbox
*/
function showBlackBox(){
    let lightbox = document.getElementById("lightbox");
    let blackbox = document.getElementById("blackbox");
    blackbox.classList.remove("disable");
    blackbox.classList.add("enable");
    lightbox.classList.remove("slide-out-right");
    lightbox.classList.add("slide-in-right");
    setBlur(true);
}


/**
* The heart of Lightbox -> need this function to close a lightbox again.
*/
function hideBlackbox(){
    let lightbox = document.getElementById("lightbox");
    let blackbox = document.getElementById("blackbox");
    lightbox.classList.remove("slide-in-right");
    lightbox.classList.add("slide-out-right");
    setTimeout(() =>{
        blackbox.classList.remove("enable");
        disableBlackbox();
        setBlur(false);
    }, 150);
}


/**
* After an animation and some delay this function disable the current lightbox
*/
function disableBlackbox(){
    let blackbox = document.getElementById("blackbox");
    setTimeout(() =>{
        blackbox.classList.add("disable");
    }, 250);
}


/**
* looks for attribute called 'can-Blur' in all elements and blur them by open a lightbox
*/
function setBlur(turnOn = true){
    let elements = document.querySelectorAll("[can-Blur]");
    for (let i = 0; i < elements.length; i++){
        if(turnOn){
        elements[i].classList.add("addBlur");
        } else{
        elements[i].classList.remove("addBlur");
        }
    }
}


/**
* is needed to click inside a lightbox without closing it.
*/
function ignorclick(event){
    event.stopPropagation();
}