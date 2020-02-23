$(function() {
    $(".clock").css('opacity', '1');
    
    updateClock();
});

var intervalID = setInterval(function(){
    updateClock();
    
}, 1000);

function updateClock(){
    var date = new Date();
    var hour = date.getHours() % 12;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var isPast = 0;
    
    console.log("Current time: H:"+hour+", M:"+minute);
    
    
    for (var x = 0; x < 10; x++){
        for (var y = 0; y < 10; y++){
            disable(x,y);
        }
    }
    
    enable(0,0);
    enable(1,0);
    enable(3,0);
    enable(4,0);
    
    isPast = 0;
    //Do minute
    if (minute < 3){
        minute = 0;
    } else if (minute < 7){
        minute = 5;
    } else if (minute < 13){
        minute = 10;
    } else if (minute < 23){
        minute = 15;
    } else if (minute < 37){
        minute = 30
    } else if (minute < 47){
        minute = 15
        isPast = 1;
        hour += 1;
    } else if (minute < 53){
        minute = 10
        isPast = 1;
        hour += 1;
    } else if (minute < 57){
        minute = 5;
        isPast = 1;
        hour += 1;
    } else {
        minute = 0;
        hour += 1;   
    }
    
    hour = hour % 12;
    
    //Display hour
    switch (hour){
    case 1:
        enable(0,8);
        enable(1,8);
        enable(2,8);
        break;
    case 2:
        enable(7,3);
        enable(8,3);
        enable(9,3);
        break
    case 3:
        enable(5,4);
        enable(6,4);
        enable(7,4);
        enable(8,4);
        enable(9,4);
        break;
    case 4:
        enable(0,4);
        enable(1,4);
        enable(2,4);
        enable(3,4);
        break;
    case 5:
        enable(0,7);
        enable(1,7);
        enable(2,7);
        enable(3,7);
        break;
    case 6:
        enable(0,6);
        enable(1,6);
        enable(2,6);
        break;
    case 7:
        enable(0,5);
        enable(1,5);
        enable(2,5);
        enable(3,5);
        enable(4,5);
        break;
    case 8:
        enable(3,6);
        enable(4,6);
        enable(5,6);
        enable(6,6);
        enable(7,6);
        break;
    case 9:
        enable(4,5);
        enable(5,5);
        enable(6,5);
        enable(7,5);
        break;
    case 10:
        enable(7,6);
        enable(8,6);
        enable(9,6);
        break;
    case 11:
        enable(2,8);
        enable(3,8);
        enable(4,8);
        enable(5,8);
        enable(6,8);
        enable(7,8);
        break;
    case 0:
        enable(4,7);
        enable(5,7);
        enable(6,7);
        enable(7,7);
        enable(8,7);
        enable(9,7);
        break;
    }
    
    //Display past or to
    if (isPast) {
        enable(3,3);
        enable(4,3);
    } else if (minute != 0){
        enable(0,3);
        enable(1,3);
        enable(2,3);
        enable(3,3);
    }
    
    //Display minute
    
    if (minute == 5){
        enable(6,0);
        enable(7,0);
        enable(8,0);
        enable(9,0);
    } else if (minute == 10){
        enable(0,1);
        enable(1,1);
        enable(2,1);
        
    } else if (minute == 15){
        enable(3,1);
        enable(4,1);
        enable(5,1);
        enable(6,1);
        enable(7,1);
        enable(8,1);
        enable(9,1);
        
    } else if (minute == 20){
        enable(4,2);
        enable(5,2);
        enable(6,2);
        enable(7,2);
        enable(8,2);
        enable(9,2);
         
    } else if (minute == 30){
        enable(0,2);
        enable(1,2);
        enable(2,2);
        enable(3,2);
        
    }
    
}

function enable(x,y){
    $("#"+x+"_"+y).removeClass("off").addClass("on");
}

function disable(x,y){
    $("#"+x+"_"+y).removeClass("on").addClass("off");
}