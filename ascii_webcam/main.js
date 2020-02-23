$(function() {
    $(".canvas").css('opacity', '1');

    $(".controls-button").click(function(){
        window.location.href = "http://chrisdalke.com";

    });

    $(".back-button").click(function(){
        window.location.href = "http://chrisdalke.com/projects";

    });




});

var width = 800;
var height = 600;

var scale = " .'`^\",:;Il!i><~+_-?][}{1)(|\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

var tileSize = 20;
var texWidth = width / tileSize;
var texHeight = height / tileSize;

var video;
var videoRawSprite;
var bitmapImage;
var bitmapMain;
var bitmapSprite;
var textStyle = { font: "65px Arial", fill: "#fffff", align: "center" };



var game = new Phaser.Game(width, height, Phaser.AUTO, 'canvas-holder', { preload: preload, create: create, update: update });


function preload() {

    //game.load.video('cubes', 'teapot.mp4');
}

function create() {

    var text = game.add.text(100,100, "Hello World", textStyle);

    text.anchor.set(0.5);

    video = game.add.video();

    video.onAccess.add(camAllowed, this);
    video.onError.add(camBlocked, this);
    video.startMediaStream();

    //camAllowed(video);
    //video.play(true);

    game.time.events.loop(10, updateBuffer, this);
}

function updateBuffer() {
    if (bitmapImage){
        bitmapImage.draw(videoRawSprite,0,0,texWidth,texHeight);
        bitmapImage.update();
        console.log("Updating bitmap image...");
    }
}



function camAllowed(video) {

    videoRawSprite = game.make.sprite(0, 0, 'video');
    video.add(videoRawSprite);

    bitmapImage = game.make.bitmapData(texWidth,texHeight);

    bitmapMain = game.make.bitmapData(width,height);
    bitmapSprite = bitmapMain.addToWorld();
}

function camBlocked(video, error) {
    $("#canvas-holder").text("Please allow this page to access the camera!");
    $("#canvas-holder").addClass("canvas-error");
}

function update() {
    if (videoRawSprite){

        //Now, we loop through our bitmapImage which has samples of the video stream
        //and use that to build the pixels of the ASCII image
        //bitmapMain.draw(bitmapImage,0,0);
        bitmapMain.fill(0,32,66);

        for (x = 0; x < texWidth; x++){
            for (y = 0; y < texHeight; y++){
		        var color = bitmapImage.getPixelRGB(x, y);
                //var brightness = (color.r + color.g + color.b)/3;
                var greyColor = (color.r + color.g + color.b)/3;
                //bitmapMain.rect(x*tileSize,y*tileSize,tileSize,tileSize,greyColor);

                var greyStepped = Math.round(convertRange(greyColor,[0, 255],[0,scale.length-1]));
                var greyColorOpac = "rgba(255,255,255,"+greyStepped/scale.length+")";

                var textSize = (greyStepped/scale.length) * tileSize;

                bitmapMain.text(scale[greyStepped],(x*tileSize) + (tileSize/2),(y*tileSize) + (tileSize/2),textSize+"px Courier",greyColorOpac,false);
            }
        }


    }
}

function convertRange( value, r1, r2 ) {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}
