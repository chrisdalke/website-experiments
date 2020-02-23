
var ruleset = "gameOfLifeRule";

$(function() {
    $(".canvas").css('opacity', '1');

    $("#side-menu-show-button").click(function(){
        $("#side-menu").toggleClass("closed");
    });

    $("#pause").click(function(event){
        event.preventDefault();
        togglePaused();
    });
    $("#load-random").click(function(event){
        event.preventDefault();
        loadRandom();
    });
    $("#load-clear").click(function(event){
        event.preventDefault();
        loadClear();
    });


    $("#ruleset").change(function(){
        ruleset = $("#ruleset").val();
    });

});

/*
$(window).resize(function() {
    resizeGame();
});
*/

var width = "100%";
var height = "100%";

var worldSizeX = 100;
var worldSizeY = 100;
var newArray = createArray(worldSizeX,worldSizeY);
var oldArray = createArray(worldSizeX,worldSizeY);
var isPaused = false;

var tileSize = 5;
var bitmap;
var bitmapSprite;
var bitmapWidth = worldSizeX * tileSize;
var bitmapHeight = worldSizeY * tileSize;

var fillOn = "#000000";
var fillOff = "#FFFFFF";

var oldScreenWidth = 0;
var oldScreenHeight = 0;

var bitmapSpriteArrayX = Math.ceil(oldScreenWidth / bitmapWidth);
var bitmapSpriteArrayY = Math.ceil(oldScreenHeight / bitmapHeight);
var bitmapSpriteArray = createArray(bitmapSpriteArrayX,bitmapSpriteArrayY);

var textStyle = { font: "16px Courier New", fill: "#fffff", align: "left" };

var lineOverlay;


var game = new Phaser.Game(width, height, Phaser.CANVAS, 'canvas-holder', { preload: preload, create: create, update: update, render: render });


function preload() {

  game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  game.scale.setResizeCallback(function() {
    game.scale.setMaximum();
  });
}

function create() {
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }


    game.stage.backgroundColor = "#FFFFFF";

    bitmap = game.make.bitmapData(bitmapWidth,bitmapHeight);

    loadRandom();
    //var text = game.add.text(100,100, "Hello World", textStyle);


    pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    pauseKey.onDown.add(togglePaused, this);

    lineOverlay = game.add.graphics(0, 0);


    game.time.events.loop(5, updateBuffer, this);
}

function updateBitmapSpriteArray(){
    if (oldScreenWidth != window.innerWidth | oldScreenHeight != window.innerHeight){
        //Readd sprites to make the world seem endless
        oldScreenWidth = window.innerWidth;
        oldScreenHeight = window.innerHeight;

        //Remove old sprites if they exist
        for (var x = 0; x < bitmapSpriteArrayX; x++){
            for (var y = 0; y < bitmapSpriteArrayY; y++){
                bitmapSpriteArray[x][y].destroy();
            }
        }

        bitmapSpriteArrayX = Math.ceil(oldScreenWidth / bitmapWidth);
        bitmapSpriteArrayY = Math.ceil(oldScreenHeight / bitmapHeight);
        //console.log("Generating new bmp sprite array of size "+bitmapSpriteArrayX+" "+bitmapSpriteArrayY);
        bitmapSpriteArray = createArray(bitmapSpriteArrayX,bitmapSpriteArrayY);

        for (var x = 0; x < bitmapSpriteArrayX; x++){
            for (var y = 0; y < bitmapSpriteArrayY; y++){
                bitmapSpriteArray[x][y] = bitmap.addToWorld();
                bitmapSpriteArray[x][y].x = x * bitmapWidth;
                bitmapSpriteArray[x][y].y = y * bitmapHeight;
            }
        }
    }
}


function updateBuffer() {
    bitmap.fill(255,0,0);

    //Update cells
    if (!isPaused){

        //Copy current to old cells

        for (var x = 0; x < worldSizeX; x++){
            for (var y = 0; y < worldSizeY; y++){
                oldArray[x][y] = newArray[x][y];
            }
        }

        //Based on rules, generate new array
        for (var x = 0; x < worldSizeX; x++){
            for (var y = 0; y < worldSizeY; y++){
                newArray[x][y] = window[ruleset](oldArray,x,y);//ruleStringRule(oldArray,x,y,[3],[2,3]);
            }
        }
    }

    //Render cells
    for (var x = 0; x < worldSizeX; x++){
        for (var y = 0; y < worldSizeY; y++){
            bitmap.rect(x*tileSize,y*tileSize,tileSize,tileSize,newArray[x][y] ? fillOn : fillOff);
        }
    }
}


function gameOfLifeRule(arrayInput,x,y){
    var numNeighbors = getNumNeighbors(arrayInput,x,y);
    var returnValue = false;
    if (arrayInput[x][y] == true){
        returnValue = true;
        if (numNeighbors < 2){ returnValue = false; }
        if (numNeighbors > 3){ returnValue = false; }
    } else {
        if (numNeighbors == 3){ returnValue = true; }
    }
    return returnValue;
}

function virusRule(arrayInput,x,y){
    var numNeighbors = getNumNeighbors(arrayInput,x,y);
    var returnValue = false;
    if (arrayInput[x][y] == true){
        returnValue = true;
        if (numNeighbors < 3){ returnValue = false; }
        if (numNeighbors > 5){ returnValue = false; }
    } else {
        if (numNeighbors == 3){ returnValue = true; }
    }
    return returnValue;
}

function highLifeRule(arrayInput,x,y){
    var numNeighbors = getNumNeighbors(arrayInput,x,y);
    var returnValue = false;
    if (arrayInput[x][y] == true){
        returnValue = false;
        if (numNeighbors == 2){ returnValue = true; }
        if (numNeighbors == 3){ returnValue = true; }
    } else {
        if (numNeighbors == 3){ returnValue = true; }
        if (numNeighbors == 6){ returnValue = true; }
    }
    return returnValue;
}


function flockRule(arrayInput,x,y){
    var numNeighbors = getNumNeighbors(arrayInput,x,y);
    var returnValue = false;
    if (arrayInput[x][y] == true){
        returnValue = false;
        if (numNeighbors == 1){ returnValue = true; }
        if (numNeighbors == 2){ returnValue = true; }
    } else {
        if (numNeighbors == 3){ returnValue = true; }
    }
    return returnValue;
}
function mazeRule(arrayInput,x,y){
    var numNeighbors = getNumNeighbors(arrayInput,x,y);
    var returnValue = false;
    if (arrayInput[x][y] == true){
        returnValue = false;
        if (numNeighbors == 1){ returnValue = true; }
        if (numNeighbors == 2){ returnValue = true; }
        if (numNeighbors == 3){ returnValue = true; }
        if (numNeighbors == 4){ returnValue = true; }
        //if (numNeighbors == 5){ returnValue = true; }
    } else {
        if (numNeighbors == 3){ returnValue = true; }
    }
    return returnValue;
}
function lifeWithoutDeathRule(arrayInput,x,y){
    var numNeighbors = getNumNeighbors(arrayInput,x,y);
    var returnValue = false;
    if (arrayInput[x][y] == true){
        returnValue = false;
        if (numNeighbors == 0){ returnValue = true; }
        if (numNeighbors == 1){ returnValue = true; }
        if (numNeighbors == 2){ returnValue = true; }
        if (numNeighbors == 3){ returnValue = true; }
        if (numNeighbors == 4){ returnValue = true; }
        if (numNeighbors == 5){ returnValue = true; }
        if (numNeighbors == 6){ returnValue = true; }
        if (numNeighbors == 7){ returnValue = true; }
        if (numNeighbors == 8){ returnValue = true; }
        //if (numNeighbors == 5){ returnValue = true; }
    } else {
        if (numNeighbors == 3){ returnValue = true; }
    }
    return returnValue;
}

function mazeRule2(arrayInput,x,y){
    var numNeighbors = getNumNeighbors(arrayInput,x,y);
    var returnValue = false;
    if (arrayInput[x][y] == true){
        returnValue = false;
        if (numNeighbors == 1){ returnValue = true; }
        if (numNeighbors == 2){ returnValue = true; }
        if (numNeighbors == 3){ returnValue = true; }
        //if (numNeighbors == 4){ returnValue = true; }
        if (numNeighbors == 5){ returnValue = true; }
    } else {
        if (numNeighbors == 3){ returnValue = true; }
    }
    return returnValue;
}

function ruleStringRule(arrayInput,x,y,born,survive){
    var numNeighbors = getNumNeighbors(arrayInput,x,y);
    var returnValue = false;
    if (arrayInput[x][y] == true){
        //Check survival
        returnValue = false;
        if ($.inArray(numNeighbors, survive) == 0){ returnValue = true; }
    } else {
        //Check born
        if ($.inArray(numNeighbors, born) == 0){ returnValue = true; }
    }
    return returnValue; 
}

function getNumNeighbors(arrayInput,x,y){
    var neighbors = 0;
    var xL = x-1;
    var xR = x+1;
    var yL = y-1;
    var yR = y+1;

    if (xL < 0) { xL = worldSizeX-1; }
    if (xR >= worldSizeX) { xR = 0; }
    if (yL < 0) { yL = worldSizeY-1; }
    if (yR >= worldSizeY) { yR = 0; }

    if (xL >= 0 & xL < worldSizeX & yL >= 0 & yL < worldSizeY){if (arrayInput[xL][yL]){ neighbors++; };};
    if (x >= 0 & x < worldSizeX & yL >= 0 & yL < worldSizeY){if (arrayInput[x][yL]){ neighbors++; };};
    if (xR >= 0 & xR < worldSizeX & yL >= 0 & yL < worldSizeY){if (arrayInput[xR][yL]){ neighbors++; };};
    if (xL >= 0 & xL < worldSizeX & y >= 0 & y < worldSizeY){if (arrayInput[xL][y]){ neighbors++; };};
    if (xR >= 0 & xR < worldSizeX & y >= 0 & y < worldSizeY){if (arrayInput[xR][y]){ neighbors++; };};
    if (xL >= 0 & xL < worldSizeX & yR >= 0 & yR < worldSizeY){if (arrayInput[xL][yR]){ neighbors++; };};
    if (x >= 0 & x < worldSizeX & yR >= 0 & yR < worldSizeY){if (arrayInput[x][yR]){ neighbors++; };};
    if (xR >= 0 & xR < worldSizeX & yR >= 0 & yR < worldSizeY){if (arrayInput[xR][yR]){ neighbors++; };};
    return neighbors;
}


function update(){


    //Allow the user to draw on the screen
    if (game.input.mousePointer.rightButton.isDown){
        drawCell(false);
    }
    if (game.input.mousePointer.leftButton.isDown){
        drawCell(true);
    }

}

function drawCell(isOn){
    var mouseX = Math.round((game.input.mousePointer.x % bitmapWidth) / tileSize);
    var mouseY = Math.round((game.input.mousePointer.y % bitmapHeight) / tileSize);
    if (mouseX >= 0 & mouseX < worldSizeX){
        if (mouseY >= 0 & mouseY < worldSizeY){
            console.log("drawing "+isOn+" at position ("+mouseX+","+mouseY+")...");
            newArray[mouseX][mouseY] = isOn;
        }
    }

}

function setCell(){

}

function loadRandom(){

    for (var x = 0; x < worldSizeX; x++){
        for (var y = 0; y < worldSizeY; y++){
            newArray[x][y] = Math.random() >= 0.93;
        }
    }
}

function loadClear(){

    for (var x = 0; x < worldSizeX; x++){
        for (var y = 0; y < worldSizeY; y++){
            newArray[x][y] = false;
        }
    }
}

function togglePaused(){
    isPaused = !isPaused;
}

function render() {

    updateBitmapSpriteArray();

    if (isPaused){
        game.debug.geom(new Phaser.Rectangle(window.innerWidth - 210,window.innerHeight - 60,210,60),"#BBBBBB",true);
        game.debug.text("simulation paused",window.innerWidth - 195,window.innerHeight - 36,"#FFFFFF");
        game.debug.text("click to place cell",window.innerWidth - 195,window.innerHeight - 14,"#FFFFFF");
    }



}

function convertRange( value, r1, r2 ) {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}
