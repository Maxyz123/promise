/**
 * this file contains the functions to control the drawing on the canvas
 */
let room;
let userId;
let imgURL
let color = 'red', thickness = 4;

/**
 * it inits the image canvas to draw on. It sets up the events to respond to (click, mouse on, etc.)
 * it is also the place where the data should be sent  via socket.io
 * @param sckt the open socket to register events on
 * @param imageUrl teh image url to download
 */
function initCanvas(sckt, imageUrl, id) {
    socket = sckt;
    room=document.getElementById('roomNo').value;
    userId=document.getElementById('name').value;
    imgURL=imageUrl;
    let flag = false,
        prevX, prevY, currX, currY = 0;
    let canvas = $('#canvas');
    let cvx = document.getElementById('canvas');
    let img = document.getElementById('image');
    let ctx = cvx.getContext('2d');
    img.src = imageUrl;


    canvas.on('mousemove mousedown mouseup mouseout', function (e) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.position().left;
        currY = e.clientY - canvas.position().top;
        if (e.type === 'mousedown') {
            flag = true;
        }
        if (e.type === 'mouseup' || e.type === 'mouseout') {
            flag = false;
        }
        // if the flag is up, the movement of the mouse draws on the canvas
        if (e.type === 'mousemove') {
            if (flag) {

                socket.emit('draw', room, userId, canvas.width, canvas.height, prevX, prevY, currX, currY, color, thickness, imageUrl)

            }
        }
    });


    $('.canvas-clear').on('click', function (e) {
        socket.emit('clearCanvas', room, userId);
    });


    img.addEventListener('load', () => {
        // it takes time before the image size is computed and made available
        // here we wait until the height is set, then we resize the canvas based on the size of the image

        let poll = setInterval(function () {
            if (img.naturalHeight) {
                clearInterval(poll);
                img.style.display='block';
                // resize the canvas
                let ratioX=1;
                let ratioY=1;
                // if the screen is smaller than the img size we have to reduce the image to fit
                if (img.clientWidth>window.innerWidth)
                    ratioX=window.innerWidth/img.clientWidth;
                if (img.clientHeight> window.innerHeight)
                    ratioY= img.clientHeight/window.innerHeight;
                let ratio= Math.min(ratioX, ratioY);
                // resize the canvas to fit the screen and the image
                cvx.width = canvas.width = img.clientWidth*ratio;
                cvx.height = canvas.height = img.clientHeight*ratio;
                // draw the image onto the canvas

                if (id===userId){
                    drawImageScaled(img, cvx, ctx);
                    GetDataByIndex(userId, imgURL)
                        .then(response => console.log('inserting worked!!'))
                        .catch(error => console.log("error  inserting: "+ JSON.stringify(error)))
                }
                else {
                    drawImageScaled(img, cvx, ctx);
                }
                // hide the image element as it is not needed
                img.style.display = 'none';
            }
        }, 10);
    });

}

/**
 * called when it is required to draw the image on the canvas. We have resized the canvas to the same image size
 * so ti is simpler to draw later
 * @param img
 * @param canvas
 * @param ctx
 */
function drawImageScaled(img, canvas, ctx) {
    // get the scale
    let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = (canvas.width / 2) - (img.width / 2) * scale;
    let y = (canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);


}


/**
 * this is called when we want to display what we (or any other connected via socket.io) draws on the canvas
 * note that as the remote provider can have a different canvas size (e.g. their browser window is larger)
 * we have to know what their canvas size is so to map the coordinates
 * @param ctx the canvas context
 * @param canvasWidth the originating canvas width
 * @param canvasHeight the originating canvas height
 * @param prevX the starting X coordinate
 * @param prevY the starting Y coordinate
 * @param currX the ending X coordinate
 * @param currY the ending Y coordinate
 * @param color of the line
 * @param thickness of the line
 */
function drawOnCanvas(ctx, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness) {
    //get the ration between the current canvas and the one it has been used to draw on the other comuter
    let ratioX= 1;
    let ratioY= 1;
    // update the value of the points to draw
    prevX*=ratioX;
    prevY*=ratioY;
    currX*=ratioX;
    currY*=ratioY;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
    ctx.closePath();
}



socket.on('draw',function (room, userId, width, height, prevX, prevY, currX, currY, color, thickness, imgUrl){

    let canvas = $('#canvas');
    let cvx = document.getElementById('canvas');
    //let img = document.getElementById('image');
    let ctx = cvx.getContext('2d');

    canvas.width=width;
    canvas.height=height;

    drawOnCanvas(ctx, canvas.width, canvas.height, prevX, prevY, currX, currY, color, thickness);

    //Store to IndexDB
    storeDrawnData({room: room, userId: userId,width: canvas.width, height: canvas.height, prevX: prevX, prevY: prevY, currX: currX, currY: currY, color: color, thickness: thickness, imgUrl: imgUrl})
        .then(response => console.log('inserting worked!!'))
        .catch(error => console.log("error  inserting: "+ JSON.stringify(error)))

});

socket.on('drawPanel',function (room, userId, width, height, prevX, prevY, currX, currY, color, thickness){


    let canvas = $('#resultCanvas');
    let cvx = document.getElementById('resultCanvas');
    //let img = document.getElementById('image');
    let ctx = cvx.getContext('2d');

    canvas.width=width;
    canvas.height=height;

    drawOnCanvas(ctx, canvas.width, canvas.height, prevX, prevY, currX, currY, color, thickness);
});

socket.on('clearCanvas',function (room, userId){

    let canvas = $('#canvas');
    let cvx = document.getElementById('canvas');
    let ctx = cvx.getContext('2d');
    let c_width = canvas.width();
    let c_height = canvas.height();
    console.log(c_width,c_height)
    ctx.clearRect(0, 0, c_width, c_height);

    writeOnHistory('<b>' + userId + '</b> '+' Deleted the Picture!');

});





function initResultCanvas(sckt, imageUrl) {

    socket = sckt;
    room=document.getElementById('roomNo').value;
    userId=document.getElementById('name').value
    let flag = false,
        prevX, prevY, currX, currY = 0;
    let canvas = $('#resultCanvas');
    let cvx = document.getElementById('resultCanvas');
    let img = document.getElementById('resultImg');
    let ctx = cvx.getContext('2d');
    img.src = imageUrl;


    canvas.on('mousemove mousedown mouseup mouseout', function (e) {

        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.position().left;
        currY = e.clientY - canvas.position().top;

        if (e.type === 'mousedown') {
            flag = true;
        }
        if (e.type === 'mouseup' || e.type === 'mouseout') {
            flag = false;
        }
        // if the flag is up, the movement of the mouse draws on the canvas
        if (e.type === 'mousemove') {
            if (flag) {

                socket.emit('drawOnPanel', room, userId, canvas.width, canvas.height, prevX, prevY, currX, currY, color, thickness)

            }
        }
    });

    // this is code left in case you need to  provide a button clearing the canvas (it is suggested that you implement it)
    $('.canvas-clear').on('click', function (e) {
        let c_width = canvas.width();
        let c_height = canvas.height();
        ctx.clearRect(0, 0, c_width, c_height);


    });


    img.addEventListener('load', () => {
        // it takes time before the image size is computed and made available
        // here we wait until the height is set, then we resize the canvas based on the size of the image

        let poll = setInterval(function () {
            if (img.naturalHeight) {
                clearInterval(poll);
                img.style.display='block';
                // resize the canvas
                let ratioX=1;
                let ratioY=1;
                // if the screen is smaller than the img size we have to reduce the image to fit
                if (img.clientWidth>window.innerWidth)
                    ratioX=window.innerWidth/img.clientWidth;
                if (img.clientHeight> window.innerHeight)
                    ratioY= img.clientHeight/window.innerHeight;
                let ratio= Math.min(ratioX, ratioY);
                // resize the canvas to fit the screen and the image
                cvx.width = canvas.width = img.clientWidth*ratio;
                cvx.height = canvas.height = img.clientHeight*ratio;
                // draw the image onto the canvas
                drawImageScaled(img, cvx, ctx);
                // hide the image element as it is not needed
                //img.style.display = 'none';
            }
        }, 10);
    });

}
