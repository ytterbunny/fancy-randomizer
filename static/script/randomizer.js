var delay = 1200;
var soloDelay = 350;
var glowDelay = 800;
var numPosition = null;
var numPointerTop = null;
var numPointerLeft = null;

function appendNumToResult(i, num) {
    if (i == 0) {
        $("#randomResult").text(num);
    }
    else {
        $("#randomResult").append(num);
    }
}

function appendResultList(result) {

    var firstResult = ($("#resultList").text() == "");

    $("#resultList").append(
        '<div class="record">' +
            '<span style="font-size: medium;">◇</span>' +
            '<span>' + result + '</span>' +
            '<span style="font-size: medium;">◇</span>' +
        '</div>');
    $("#resultList").scrollTop($("#resultList").get(0).scrollHeight);

    if (firstResult) {
        // show bookmark
        $("#resultListOuter").animate({top: "+=100px"}, delay, "swing");
    }
}

function setPointerAnimation(status) {
    $(".followBody").css("animation-play-state", status);
    $(".arm").css("animation-play-state", status);
    $(".followBody.face .inner").css("animation-play-state", status);
    $(".followBody.face .inner .mouth").css("animation-play-state", status);
    $(".followBody.face .inner .ears").css("animation-play-state", status);
}

function glowTheNumber(num) {
    var id = numPosition[num].id;
    $(id).css("animation-name", "glow");
    $(id).css("animation-duration", glowDelay.toString() + "ms");
    $(id).css("animation-delay", "0ms");

    requestAnimationFrame((time) => {
        requestAnimationFrame((time) => {
          document.querySelector(id).className = id + " changing";
        });
      });
    setTimeout(function() {
        $(id).css("animation-name", "none");
        $(id).css("animation-duration", "none");
        $(id).css("animation-delay", "none");
    }, glowDelay)
}

function glowTheResult() {
    $("#randomResult").css("animation-name", "glow");
    $("#randomResult").css("animation-duration", glowDelay.toString() + "ms");
    $("#randomResult").css("animation-delay", "0ms");

    requestAnimationFrame((time) => {
        requestAnimationFrame((time) => {
          document.querySelector("#randomResult").className = "randomResult changing";
        });
      });
    setTimeout(function() {
        $("#randomResult").css("animation-name", "none");
        $("#randomResult").css("animation-duration", "none");
        $("#randomResult").css("animation-delay", "none");
    }, glowDelay)
}

function trackMouseMove() {
    $(document).on('mousemove', (event) => {
        $('.followBody').css({
            left: event.clientX,
            top: event.clientY,
        },);

    });
}

function disableInput() {
    $("#randomButton").prop("disabled", true);
    $("#randomForm > input").prop("disabled", true);
}

function enableInput() {
    $("#randomButton").prop("disabled", false);
    $("#randomForm > input").prop("disabled", false);
}

$(document).ready(function(){

    var windowHeight = $( window ).height();
    $("#numListOuter").css("top", windowHeight*0.45 - $("#numListOuter").height());
    $("#rippleNumsOuter").css("top", windowHeight*0.40 - $("#rippleNums").height());

    $("#randomButton").click(function(){

        if (numPosition == null) {
            var windowWidth = $( window ).width();
            numPointerTop = -$("#numPointer").height();
            numPointerLeft = windowWidth*0.5 - $("#numPointer").width()
            $("#numPointer").css("top", numPointerTop);
            $("#numPointer").css("left", numPointerLeft);

            numPosition = {
                0: {id:"#num0", position:$("#num0").offset()},
                1: {id:"#num1", position:$("#num1").offset()},
                2: {id:"#num2", position:$("#num2").offset()},
                3: {id:"#num3", position:$("#num3").offset()},
                4: {id:"#num4", position:$("#num4").offset()},
                5: {id:"#num5", position:$("#num5").offset()},
                6: {id:"#num6", position:$("#num6").offset()},
                7: {id:"#num7", position:$("#num7").offset()},
                8: {id:"#num8", position:$("#num8").offset()},
                9: {id:"#num9", position:$("#num9").offset()}
            };

            for (var i = 0; i < 10; i++) {
                numPosition[i].position.left = numPosition[i].position.left-10;
                numPosition[i].position.top = numPosition[i].position.top+250;
            }
        }

        // clear random number
        $("#randomResult").html('<span style="font-family: ShineDemo; font-size: 20px">+++</span>');
        disableInput();

        // calculate random
        var min = Math.ceil($("#fromNum").val())
        var max = Math.floor($("#toNum").val())

        var randomNum = Math.floor(Math.random() * (max - min + 1) + min);

        console.log(randomNum);

        if ($("#skip").prop("checked")) {
            setTimeout(function() {
                glowTheResult();
                $("#randomResult").text(randomNum);
                appendResultList(randomNum);
                enableInput();
            }, 500);
        }

        if (!$("#skip").prop("checked")) {

            setPointerAnimation("paused");
            $(document).off('mousemove');
            $(".followBody").animate({top: "-=500px"}, delay, "swing", function() {
                var randomNumStr = randomNum.toString();
                var i = 0;
                moveTo(randomNumStr, i, delay);
            });
        }
    });

});

function moveTo(randomNumStr, i) {

    if (i == randomNumStr.length) {
        // end
        $("#numPointer").animate({left: numPointerLeft, top: numPointerTop}, delay, "swing", function() {
            appendResultList(randomNumStr);
            enableInput();
            setPointerAnimation("running");
            trackMouseMove();
        });
        return;
    }

    var num = randomNumStr.charAt(i);
    var id = numPosition[num].id;
    var position = numPosition[num].position;

    // middle
    if (randomNumStr.charAt(i-1) != num && i != 0) {
        // get distance
        var distance = Math.abs(parseInt(num) - parseInt(randomNumStr.charAt(i-1)));
        var distanceOffset = ((distance < 3) ? 1 : ((distance < 6) ? 0.8 : 0.5));

        $("#numPointer").animate(position, distance*soloDelay*distanceOffset, "swing", function() {
            glowTheNumber(num);
            glowTheResult();
            setTimeout(function() {
                appendNumToResult(i, num);
            }, glowDelay*0.45)
            setTimeout(function() {
                moveTo(randomNumStr, i+1, soloDelay);
            }, glowDelay)
        });
    }
    // first
    else if (randomNumStr.charAt(i-1) != num && i == 0) {
        // get distance
        $("#numPointer").animate(position, delay, "swing", function() {
            glowTheNumber(num);
            glowTheResult();
            setTimeout(function() {
                appendNumToResult(i, num);
            }, glowDelay*0.45)
            setTimeout(function() {
                moveTo(randomNumStr, i+1, soloDelay);
            }, glowDelay)
        });
    }
    // middle but same number
    else {
        $("#numPointer").animate({top: "-=50px"}, soloDelay, "swing",function() {
            $("#numPointer").animate({top: "+=50px"}, soloDelay, "swing", function() {
                glowTheNumber(num);
                glowTheResult();
                setTimeout(function() {
                    appendNumToResult(i, num);
                }, glowDelay*0.45)
                setTimeout(function() {
                    moveTo(randomNumStr, i+1, soloDelay);
                }, glowDelay)
            });
        });
    }
}



