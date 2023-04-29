// config ---------------------------------------------------------
var delay = 1200;
var soloDelay = 350;
var glowDelay = 800;
var idleTime = 60;
var sleepTime = 122;


// global var ---------------------------------------------------------
var numPosition = null;
var numPointerTop = null;
var numPointerLeft = null;
var currSeconds = 0;
var prevSeconds = 0;
var onIdle = false;
var randomClickWhenIdle = false;
var animationClasses = new Set();


// timer ---------------------------------------------------------
function resetTimer() {
    currSeconds = 0;
}

function timerIncrement() {

    /* Set the timer text to the new value */
//    console.log("time: " + currSeconds);

    if (currSeconds == idleTime) {
        // start idle animation
        startIdleAnimation();
    }

    if (currSeconds == sleepTime) {
        putMainTakoToSleep();
    }

    if (prevSeconds > currSeconds && prevSeconds >= idleTime) {
        // come back, stop idle animation
        stopIdleAnimation();
    }

    prevSeconds = currSeconds;
    currSeconds = currSeconds + 1;
}


// randomization ----------------------------------------------
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
    $(".followBody.face .arms .arm").css("animation-play-state", status);
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

// doc ready ------------------------------------------------------
$(document).ready(function(){


    /* Increment the idle time counter every second */
    $("#idleOuter").hide();
    $("#idleOuter").css("visibility", "visible");
    let idleInterval = setInterval(timerIncrement, 1000);

    /* Zero the idle timer on mouse movement */
    window.onload = resetTimer;
//    window.onmousemove = resetTimer;
//    window.onmousedown = resetTimer;
//    window.ontouchend = resetTimer;
    window.onclick = resetTimer;
    window.onkeypress = resetTimer;


    // randomization
    $("#randomButton").click(function(){

        if (onIdle) {
            randomClickWhenIdle = true;
        }

        if (numPosition == null) {

            numPointerTop = $("#numPointer").css("top");
            numPointerLeft = $("#numPointer").css("left");

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

        // get/default min/max
        var min = Math.ceil($("#fromNum").val())
        var max = Math.floor($("#toNum").val())
        if (min == null || min == "" || min < 0) {
            min = 1;
            $("#fromNum").val(min);
        }
        if (max == null || max == "" || max < 2) {
            max = 100;
            $("#toNum").val(max);
        }

        // clear random number
        $("#randomResult").html('<span style="font-family: ShineDemo; font-size: 20px">+++</span>');
        disableInput();
        resetTimer();

        var randomNum = Math.floor(Math.random() * (max - min + 1) + min);

        console.log(randomNum);

        if ($("#skip").prop("checked")) {
            setTimeout(function() {
                glowTheResult();
                $("#randomResult").text(randomNum);
                appendResultList(randomNum);
                enableInput();
                resetTimer();
            }, 500);
        }

        if (!$("#skip").prop("checked")) {

            setPointerAnimation("paused");
            $(document).off('mousemove');
            $(".followBody").animate({left: numPointerLeft, top: numPointerTop}, delay, "swing", function() {
                var randomNumStr = randomNum.toString();
                var i = 0;
                moveTo(randomNumStr, i, delay);
            });
        }
    });

});


// moving for randomization ----------------------------------------------
function moveTo(randomNumStr, i) {

    if (i == randomNumStr.length) {
        // end
        $("#numPointer").animate({left: numPointerLeft, top: numPointerTop}, delay, "swing", function() {
            appendResultList(randomNumStr);
            enableInput();
            setPointerAnimation("running");
            trackMouseMove();
            resetTimer();
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


// idle animation ----------------------------------------------

function stopIdleAnimation() {
    console.log("oh someone is back!");

    if (randomClickWhenIdle && !$("#skip").prop("checked")) {
        $("#idleOuter").fadeOut("fast");
        setTimeout(function() {
            $("#speedcapture").fadeIn()
        }, delay)
    }
    else {
        $("#idleOuter").fadeOut();
        $("#speedcapture").fadeIn()
        $(".followBody").css("left", "calc(50% - 30px)");
        $(".followBody").css("top", "calc(50% - 30px)");
    }

    setPointerAnimation("running");
    trackMouseMove();
    onIdle = false;

    /* reset any idle animate here */
    setTimeout(function() {
        resetIdleAnimation();
    }, 3000)
}

function resetIdleAnimation() {
    console.log(animationClasses);
    animationClasses.forEach (function(value) {
        $("." + value).removeClass(value);
    })

    animationClasses.clear();
}

function startIdleAnimation() {
    onIdle = true;
    randomClickWhenIdle = false;
    setPointerAnimation("paused");

    $(document).off('mousemove');
    $("#speedcapture").fadeOut();
    $("#idleOuter").fadeIn()

    /* start real idle animate here */
    startMainTako();
}

function startMainTako() {
    addAnimationClass(".idleMainBody.face .arms .arm2", "armSwayLeft");
    addAnimationClass(".idleMainBody.face .arms .arm3", "armSwayLeft");
    addAnimationClass(".idleMainBody.face .arms .arm4", "armSwayLeft");
    addAnimationClass(".idleMainBody.face .arms .arm5", "armSwayRight");
    addAnimationClass(".idleMainBody.face .inner .eyelid", "eyesBlink");
}

function putMainTakoToSleep() {
    $(".idleMainBody.face .inner .eyelid").removeClass("eyesBlink");
    addAnimationClass(".idleMainBody.face .inner .eyelid", "eyeSleep");
    setTimeout(function() {
        $(".idleMainBody.face .inner .eyelid").removeClass("eyeSleep");
        addAnimationClass(".idleMainBody.face .inner .eyelid", "lidSleeping");
        addAnimationClass(".idleMainBody.face .inner .mouth", "sleeping");
        addAnimationClass(".idleMainBody.face .inner .glasses", "sleeping");
        addAnimationClass(".idleMainBody.face .zzz", "zzzSleeping");
    }, 3000)
}

function addAnimationClass(selector, className) {
    $(selector).addClass(className);
    animationClasses.add(className);
}