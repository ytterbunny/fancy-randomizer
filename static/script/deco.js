
$("#starWheelOuter3").on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
    $("#randomButton").prop("disabled", false);
});

$("#bookmark").click(function() {

    if (!$("#resultListOuter").hasClass("openBookMark")) {
        $("#resultListOuter").addClass("openBookMark");
        $("#resultListOuter").css("animation", "openBookMark 1200ms ease-in");

        setTimeout(function() {
            $("#resultListOuter").css("top", "-20px");
            $("#resultListOuter").css("animation-name", "none");
            $("#resultListOuter").css("animation-duration", "none");
        }, 1200)
    }
    else {
        $("#resultListOuter").removeClass("openBookMark");
        $("#resultListOuter").css("animation", "closeBookMark 1200ms ease-in");

        setTimeout(function() {
            $("#resultListOuter").css("top", "-370px");
            $("#resultListOuter").css("animation-name", "none");
            $("#resultListOuter").css("animation-duration", "none");
        }, 1200)
    }


});
