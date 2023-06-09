// ------------------------------------------------------------------------------------------------
// config
// ------------------------------------------------------------------------------------------------
var delay = 1200;
var soloDelay = 350;
var glowDelay = 800;
var idleTime = 60;
var drinkTime = 75;
var readTime = 90;
var perfumeTime = 105;
var cultTime = 120;
var toSleepDuration = 31;
var toDrinkEmptyDuration = 20;
var toBookDuration = 20;


// ------------------------------------------------------------------------------------------------
// global var
// ------------------------------------------------------------------------------------------------
var numPosition = null;
var numPointerTop = null;
var numPointerLeft = null;
var currSeconds = 0;
var prevSeconds = 0;
var onIdle = false;
var randomClickWhenIdle = false;
var animationClasses = new Set();
var setTimeoutList = new Array();


// ------------------------------------------------------------------------------------------------
// timer
// ------------------------------------------------------------------------------------------------
function resetTimer() {
    currSeconds = 0;
}

function timerIncrement() {

//    console.log("time: " + currSeconds);

    /* Main tako */
    if (currSeconds == idleTime) {
        // start main idle animation
        startIdleAnimation();
    }
    if (currSeconds == (idleTime + toSleepDuration)) {
        putMainTakoToSleep();
    }

    /* Drinking tako */
    if (currSeconds == drinkTime) {
        startDrinkTako();
    }
    if (currSeconds == (drinkTime + toDrinkEmptyDuration)) {
        putEmptyBottles();
    }

    /* Reading tako */
    if (currSeconds == readTime) {
        startReadTako();
    }
    if (currSeconds == (readTime + toBookDuration)) {
        putBooks();
    }

    /* Perfume tako */
    if (currSeconds == perfumeTime) {
        startPerfumeTako();
    }

    /* Cult tako */
    if (currSeconds == cultTime) {
        startCultTako();
    }

    /* Stop Idle */
    if (prevSeconds > currSeconds && prevSeconds >= idleTime) {
        // come back, stop idle animation
        stopIdleAnimation();
    }

    /* Set the timer text to the new value */
    prevSeconds = currSeconds;
    currSeconds = currSeconds + 1;
}


// ------------------------------------------------------------------------------------------------
// randomization
// ------------------------------------------------------------------------------------------------
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

function saveNumPositions() {
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
}


// ------------------------------------------------------------------------------------------------
// doc ready
// ------------------------------------------------------------------------------------------------
$(document).ready(function(){


    /* Increment the idle time counter every second */
    $(".idleOuter").hide();
    $(".idleOuter").css("visibility", "visible");
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

        saveNumPositions();

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


// ------------------------------------------------------------------------------------------------
// moving for randomization
// ------------------------------------------------------------------------------------------------
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


// ------------------------------------------------------------------------------------------------
// Share idle animation
// ------------------------------------------------------------------------------------------------

function stopIdleAnimation() {
    console.log("oh someone is back!");

    if (randomClickWhenIdle && !$("#skip").prop("checked")) {
        $(".idleOuter").fadeOut("fast");
        setTimeout(function() {
            $("#speedcapture").fadeIn()
        }, delay)
    }
    else {
        $(".idleOuter").fadeOut();
        $("#speedcapture").fadeIn()
        $(".followBody").css("left", "calc(50% - 30px)");
        $(".followBody").css("top", "calc(50% - 30px)");
    }

    setOpacityAndBlur(1, 0);
    setPointerAnimation("running");
    trackMouseMove();
    onIdle = false;

    /* reset any idle animate here */
    setTimeout(function() {
        resetIdleAnimation();
    }, 3000)
}

function startIdleAnimation() {
    onIdle = true;
    randomClickWhenIdle = false;
    setPointerAnimation("paused");

    $(document).off('mousemove');
    $("#speedcapture").fadeOut();
    $("#idleMainOuter").fadeIn()
    $(".miniTakoOuter").hide();
    $(".miniTakoOuter").css("visibility", "visible");
    setOpacityAndBlur(0.3, 2)

    /* start real idle animate here */
    startMainTako();
}

function resetIdleAnimation() {
    animationClasses.forEach (function(value) {
        $("." + value).removeClass(value);
    });
    animationClasses.clear();

    setTimeoutList.forEach (function(value) {
        clearTimeout(value);
    });
    setTimeoutList = new Array();

    $("#letterStack1").fadeOut();
    $("#letterStack2").fadeOut();
    $("#letterStack3").fadeOut();
    $("#letterStack4").fadeOut();
}

function addAnimationClass(selector, className) {
    $(selector).addClass(className);
    animationClasses.add(className);
}

function setOpacityAndBlur(opaValue, blur) {
    $("#resultLabel").css("opacity", opaValue);
    $("#numListOuter").css("opacity", opaValue);
    $("#starWheelOuter").css("opacity", opaValue);

    var blurStr = "blur(" + blur + "px)";
    $("#resultLabel").css("filter", blurStr);
    $("#numListOuter").css("filter", blurStr);
    $("#starWheelOuter").css("filter", blurStr);
}


// ------------------------------------------------------------------------------------------------
// Main idle animation
// ------------------------------------------------------------------------------------------------

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

    setTimeoutList.push(setTimeout(function() {
        $(".idleMainBody.face .inner .eyelid").removeClass("eyeSleep");
        addAnimationClass(".idleMainBody.face .inner .eyelid", "lidSleeping");
        addAnimationClass(".idleMainBody.face .inner .mouth", "sleeping");
        addAnimationClass(".idleMainBody.face .inner .glasses", "sleeping");
        addAnimationClass(".idleMainBody.face .zzz", "zzzSleeping");
    }, 3000))
    setTimeoutList.push(setTimeout(function() {
        console.log("maruayyyy");
        $("#maruayOuterBody").fadeIn();
        addAnimationClass("#maruayBody", "sleeping");
    }, 12000))
}


// ------------------------------------------------------------------------------------------------
// Drink idle animation
// ------------------------------------------------------------------------------------------------
function startDrinkTako() {
    $(".emptyBottles").text("");
    $("#idleDrinkOuter").fadeIn();
    addAnimationClass(".idleDrinkBody.face .arms .arm1", "drinkArmSwayRight");
    addAnimationClass(".idleDrinkBody.face .arms .arm2", "drinkArmSwayRight");
    addAnimationClass(".idleDrinkBody.face .arms .arm3", "drinkArmSwayRight");
    addAnimationClass(".idleDrinkBody.face .arms .arm4", "drinkArmSwayRight");
    addAnimationClass(".idleDrinkBody.face .arms .arm5", "drinkArmSwayRight");
    addAnimationClass(".idleDrinkBody.face .inner .eyelid", "eyesBlink");
    addAnimationClass(".idleDrinkBody.face .whiskyGlass", "glassCheer");
    addAnimationClass(".idleDrinkBody.face .arms .arm6", "drinkArmCheer");
    addAnimationClass(".idleDrinkBody.face .blushes", "faceBlushing");

    console.log("chaeyoungggg");
    $("#chaeyoungOuterBody").fadeIn();
    addAnimationClass("#chaeyoungOuterBody", "sleeping");
}

function putEmptyBottles() {
    var baseTop = -24;
    var baseRight = -62;

    putEmptyBottlesRecursive(baseTop, baseRight, 0)
}

function getBottleHtml(top, right, i) {
    var text = "HANDSOME♥";
    var bottleHtml =
        '<div style="top: ' + top + 'px; right: ' + right + 'px">' +
            "<span>" + text.charAt(i) +"</span>" +
        "</div>";
    return bottleHtml;
}

function putEmptyBottlesRecursive(top, right, i) {
    if (i >= "HANDSOME♥".length) {
        return;
    }

    var bottle = getBottleHtml(top, right, i);
    $(".emptyBottles").append(bottle);
    setTimeoutList.push(setTimeout(function() {
        putEmptyBottlesRecursive(top, right-20, i+1)
    }, toDrinkEmptyDuration*1000))
}


// ------------------------------------------------------------------------------------------------
// Read idle animation
// ------------------------------------------------------------------------------------------------
function startReadTako() {
    $(".documentStack").text("");
    $(".loveLetter").hide();
    $("#idleReadOuter").fadeIn();
    addAnimationClass(".idleReadBody.face .arms .arm1", "drinkArmSwayRight");
    addAnimationClass(".idleReadBody.face .arms .arm2", "drinkArmSwayRight");
    addAnimationClass(".idleReadBody.face .arms .arm3", "drinkArmSwayRight");
    addAnimationClass(".idleReadBody.face .arms .arm4", "drinkArmSwayRight");
    addAnimationClass(".idleReadBody.face .arms .arm5", "drinkArmSwayRight");
    addAnimationClass(".idleReadBody.face .inner .eyelid", "eyesBlink");

    console.log("pierreeeee");
    $("#pierreOuterBody").fadeIn();
    addAnimationClass("#pierreOuterBody", "floating");
}

function putBooks() {
    var baseTop = -17;
    var baseRight = -53;

    putBookRecursive(baseTop, baseRight, 0);
}

function getBookHtml(top, right, i) {
    var text = "ROHL";
    var colors = ["#5734b8", "#845dd3", "#9d4cca", "#952399"];
    var bookHtml =
        '<div style="top: ' + top + 'px; right: ' + right + 'px; background-color: ' + colors[i] + ';">' +
            "<span>" + text.charAt(i) +"</span>" +
        "</div>";
    return bookHtml;
}

function putBookRecursive(top, right, i) {
    if (i >= "LHOR".length) {
        putLoveLetters();
        return;
    }

    var book = getBookHtml(top, right, i);
    $(".documentStack").append(book);
    setTimeoutList.push(setTimeout(function() {
        putBookRecursive(top-15, right, i+1)
    }, toBookDuration*1000))
}

function putLoveLetters() {
    console.log("lillyyyyyy");
    $(".loveLetter").fadeIn();
    $("#lillyOuterBody").fadeIn();
    addAnimationClass("#lillyOuterBody", "sleeping");

    setTimeoutList.push(setTimeout(function() {
        $("#letterStack1").fadeIn();
    }, toBookDuration*1000))
    setTimeoutList.push(setTimeout(function() {
        $("#letterStack2").fadeIn();
    }, toBookDuration*1000*2))
    setTimeoutList.push(setTimeout(function() {
        $("#letterStack3").fadeIn();
    }, toBookDuration*1000*3))
    setTimeoutList.push(setTimeout(function() {
        $("#letterStack4").fadeIn();
    }, toBookDuration*1000*4))
}


// ------------------------------------------------------------------------------------------------
// Perfume idle animation
// ------------------------------------------------------------------------------------------------
function startPerfumeTako() {
    $("#idlePerfumeOuter").fadeIn();
    addAnimationClass(".idlePerfumeBody.face .arms .arm2", "armSwayLeft");
    addAnimationClass(".idlePerfumeBody.face .arms .arm3", "armSwayLeft");
    addAnimationClass(".idlePerfumeBody.face .arms .arm4", "armSwayLeft");
    addAnimationClass(".idlePerfumeBody.face .arms .arm5", "armSwayRight");
    addAnimationClass(".idlePerfumeBody.face .arms .arm6", "armSwayRightWithSomsri");
    addAnimationClass(".idlePerfumeBody.face .inner .eyelid", "eyesBlink");

    console.log("somsriiii");
    $("#somsriOuterBody").fadeIn();
    addAnimationClass("#somsriOuterBody", "somsriSway");

    console.log("susann <3");
    $("#susanOuterBody").fadeIn();
    addAnimationClass("#susanOuterBody", "floating");
    addAnimationClass(".perfumeSpray", "perfumeSpraying");

    console.log("cookieee");
    $("#cookieOuterBody").fadeIn();
    addAnimationClass("#cookieOuterBody", "sleeping");

    console.log("elizabethhh");
    $("#elizabethOuterBody").fadeIn();
    addAnimationClass("#elizabethOuterBody", "runningAround");
    addAnimationClass(".wink", "winking");
}


// ------------------------------------------------------------------------------------------------
// Cult idle animation
// ------------------------------------------------------------------------------------------------
function startCultTako() {
    $(".logo img").attr("src", "static/img/logo-small.PNG");
    $("#idleCultOuter").fadeIn();
    addAnimationClass(".idleCultBody", "cultFloatUp");
    addAnimationClass(".idleCultBody.face .arms .arm1", "cultFloatLeft1");
    addAnimationClass(".idleCultBody.face .arms .arm2", "cultFloatLeft2");
    addAnimationClass(".idleCultBody.face .arms .arm3", "cultFloatLeft3");
    addAnimationClass(".idleCultBody.face .arms .arm4", "cultFloatRight3");
    addAnimationClass(".idleCultBody.face .arms .arm5", "cultFloatRight2");
    addAnimationClass(".idleCultBody.face .arms .arm6", "cultFloatRight1");

    addAnimationClass(".backArmsLeft1", "cultFloatLeft1");
    addAnimationClass(".backArmsLeft2", "cultFloatLeft2");
    addAnimationClass(".backArmsLeft", "cultFloatLeft3");
    addAnimationClass(".backArmsRight3", "cultFloatRight3");
    addAnimationClass(".backArmsRight2", "cultFloatRight2");
    addAnimationClass(".backArmsRight1", "cultFloatRight1");

    addAnimationClass(".logo", "logoPump");
    addAnimationClass(".logoEye", "logoEyeMove");
    addAnimationClass(".circle", "cultCircleSpin");
    addAnimationClass(".eyeGlow", "eyeGlowing");
}

