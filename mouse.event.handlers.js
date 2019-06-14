'use strict';

let prevMouseX;
let prevMouseY;
let mouseIsPressed = false;
let mouseIsReleased = false;
let mouseIsDragged = false;

function mousePressed() {
    //console.log('pressed');
    prevMouseX = mouseX; prevMouseY = mouseY;
}


function mouseReleased() {
    //console.log('released');
    /*
    if (mouseIsDragged) {
        prevMouseX = mouseX; prevMouseY = mouseY;
        mouseIsDragged = false;
    }
    */
}



function mouseDragged() {

    //console.log('dragged');
    mouseIsDragged = true;

    strokeWeight(10);
    //stroke(invertTrainingImagesAndCanvasColoring ? 0 : 255);
    stroke(255);
    if (!prevMouseX || !prevMouseY) {
        point(mouseX,mouseY);
    } else {
        line(prevMouseX,prevMouseY,mouseX,mouseY);
    }

    prevMouseX = mouseX; prevMouseY = mouseY;
}

function mouseMoved() {

}

function mouseClicked() {

    //console.log('clicked');

}
