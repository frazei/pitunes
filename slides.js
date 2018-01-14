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
  $('div#slides-pagination').html((current+1)+"/"+slides.length);
  $('div#slide_'+current).css('opacity', 1).css('background-image','url('+slides[current][0]+')');
  $('div#slide_'+next).css('background-image','url('+slides[next][0]+')');
  $('div#slide_'+prev).css('background-image','url('+slides[prev][0]+')');
}
function transitionend() {
  timer = setTimeout(function() {
    slideshow();
  }, 5000);
}
function slideshow() {
  if($('div#slides').hasClass('auto')) {
    $('div.slides').removeClass('transition');
    var next = (current+1 >= slides.length) ? 0 : current+1;
    console.log("current="+current+" | next="+next);
    if(next == 0) {
      $('div#slide_'+next).addClass('transition').css('opacity', 1); // la prima compare subito
    }
    else {
      $('div#slide_'+next).css('opacity', 1); // quella sotto ha opacità 1 ma è coperta
      $('div#slide_'+current).addClass('transition').css('opacity', 0); // faccio scomparire quella sopra
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
  }, 15000);
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
	$('div#slides, div#slides-close, div.slides-navigation, div#slides-pagination').css('display', 'block');
	$('body').css('overflow', 'hidden');
	timer = setTimeout(function() {
    	autoPlay();
  	}, 15000);
}
function hideSlides() {
  stopAuto();
  $('div#slides, div#slides-close, div.slides-navigation, div#slides-pagination').css('display', 'none');
  $('body').css('overflow', 'auto');
}

$(function() {
    $.getJSON( "Pictures/config.json", function( data ) {
    slides = shuffleArray(data['slides']);
    //slides = data['slides'];
    $(slides).each(function(i,v) {
      $('div#slides').append("<div id='slide_"+i+"' class='slides'></div>");
      $('div#slide_'+i).css('z-index', (i*-1)).css('background-size', v[1]).css('background-position', v[2]);
    });

    // si esce dal fullscreen
    $('div#slides-close').click(hideSlides);

    loadSlides();
  });

  // avanti e indietro manuale
  $('div.slides-navigation#next').click(function() {
    var next = (current+1 >= slides.length) ? 0 : current+1;
    slideTo(next);
  });
  $('div.slides-navigation#prev').click(function() {
    var prev = (current-1 < 0) ? slides.length-1 : current-1;
    slideTo(prev);
  });
});
