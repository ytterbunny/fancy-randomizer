$(document).on('mousemove', (event) => {
  $('.followBody').css({
    left: event.clientX,
    top: event.clientY,
  },);

});