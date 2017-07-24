var current = 0,
  timer,
  slides;

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}
function loadSlides() {
  var prev = (current-1 < 0) ? slides.length-1 : current-1;
  var pprev = (current-2 < 0) ? slides.length-1 : current-2;
  var next = (current+1 >= slides.length) ? 0 : current+1;
  var nnext = (current+2 >= slides.length) ? 0 : current+2;

  $('div#slide_'+nnext+', div#slide_'+pprev).css('background-image','');
  $('nav#slides-pagination').html((current+1)+"/"+slides.length);
  $('div#slide_'+current).css('opacity', 1).css('background-image','url('+slides[current]+')');
  $('div#slide_'+next).css('background-image','url('+slides[next]+')');
  $('div#slide_'+prev).css('background-image','url('+slides[prev]+')');
}
function transitionend() {
  timer = setTimeout(function() {
    slideshow();
  }, 5000);
}
function slideshow() {
  if($('div#slides').hasClass('auto')) {
    var next = (current+1 >= slides.length) ? 0 : current+1;
    console.log("current="+current+" | next="+next);
    if(next == 0) $('div#slide_'+next).css('opacity', 1);
    else {
      $('div#slide_'+next).removeClass('transition').css('opacity', 1);
      $('div#slide_'+current).addClass('transition').css('opacity', 0);
    }
    current = next;
    loadSlides();
  } else return false;
}
function slideTo(next) {
  console.log('slideTo '+next);
  stopAuto();
  $('div#slides').removeClass('auto');
  $('div.slides').removeClass('transition');
  $('div#slide_'+next).css('opacity', 1);
  $('div#slide_'+current).css('opacity', 0);
  current = next;
  loadSlides();
  timer = setTimeout(function() {
    autoPlay();
  }, 10000);
}
function autoPlay() {
  console.log('autoPlay');
  // questo è quello che lo fa girare in automatico
  $('div#slides div').on('transitionend', transitionend);
  $('div#slides').addClass('auto');
  slideshow();
}
function stopAuto() {
  clearTimeout(timer);
  // questo è quello che lo fa girare in automatico
  $('div#slides div').off('transitionend', transitionend);
  $('div#slides').removeClass('auto');
}
function showSlides() {
  $('div#slides, nav#slides-navigation, nav#slides-pagination').css('display', 'block');
  timer = setTimeout(function() {
    autoPlay();
  }, 10000);
}
function hideSlides() {
  stopAuto();
  $('div#slides, nav#slides-navigation, nav#slides-pagination').css('display', 'none');
}

$(function() {
  $('div#slides')
    .css('width', $(document).width())
    .css('height', $(document).height());

  $.getJSON( "config.json", function( data ) {
    slides = shuffleArray(data['slides']);
    $(slides).each(function(i,v) {
      $('div#slides').append("<div id='slide_"+i+"' class='slides'></div>");
      $('div#slide_'+i).css('z-index', (i*-1));
    });

    // si esce dal fullscreen cliccando su una foto
    $('div.slides').click(hideSlides);

    loadSlides();
  });

  // avanti e indietro manuale
  $('nav#slides-navigation span#next').click(function() {
    var next = (current+1 >= slides.length) ? 0 : current+1;
    slideTo(next);
  });
  $('nav#slides-navigation span#prev').click(function() {
    var prev = (current-1 < 0) ? slides.length-1 : current-1;
    slideTo(prev);
  });
});
