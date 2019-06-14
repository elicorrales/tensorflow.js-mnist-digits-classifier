//const atPointXElem = document.getElementById('atPointX');
//const atPointYElem = document.getElementById('atPointY');

let loadedDataImageToDrawBlownUp;

let mouseIsPressed = false;
let mouseIsReleased = false;
let mouseIsDragged = false;

let prevMouseX;
let prevMouseY;
let prevPixels;

mousePressed = () => {
    //console.log('pressed');
    mouseIsPressed = true;
    prevMouseX = undefined;
    prevMouseY = undefined;
}


mouseReleased = () => {
    //console.log('released');
    mouseIsReleased = true;
}


mouseDragged = () => {
    //console.log('dragged');


    mouseIsDragged = true;

    strokeWeight(8);
    stroke(invertTrainingImagesAndCanvasColoring ? 0 : 255);
    if (!prevMouseX || !prevMouseY) {
        point(mouseX,mouseY);
        prevMouseX = mouseX; prevMouseY = mouseY;
    } else {
        line(prevMouseX,prevMouseY,mouseX,mouseY);
        prevMouseX = mouseX; prevMouseY = mouseY;
    }
}

mouseMoved = () => {
    //console.log('moved');
    if (mouseX>=0 && mouseX<=width && mouseY>=0 && mouseY<=height) {
//        atPointXElem.innerHTML = mouseX;
//        atPointYElem.innerHTML = mouseY;
    }
}

mouseClicked = () => {

    //console.log('clicked');
    
    let isDataImageSelected = false;
    if (!mouseIsDragged && modeShowTrainingTestImagesOnCanvas && mouseX>0 && mouseX<width && mouseY>0 && mouseY<height) {
        for (let y=0; y<height && !isDataImageSelected; y+=imgBitmapHeight) {
            for (let x=0; x<width && !isDataImageSelected; x+=imgBitmapWidth) {
                if (mouseX>x && mouseX<x+imgBitmapWidth && mouseY>y && mouseY<y+imgBitmapHeight) {
                    loadedDataImageToDrawBlownUp = get(x,y,imgBitmapWidth,imgBitmapHeight);
                    loadedDataImageToDrawBlownUp.resize(width,height);
                    loadedDataImageToDrawBlownUp.save();
                    isDataImageSelected = true;
                }
            }
        }
    }

    mouseIsDragged = false;
}
