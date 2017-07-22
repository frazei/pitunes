var slides = [
  "http://loremflickr.com/800/480/iceland?random=1",
  "http://loremflickr.com/800/480/iceland?random=2",
  "http://loremflickr.com/800/480/iceland?random=3",
  "http://loremflickr.com/800/480/iceland?random=4",
  "http://loremflickr.com/800/480/iceland?random=5"
];
var current = 0,
  timer;

function slideshow() {
  var next = (current+1 >= slides.length) ? 0 : current+1;
  console.log("current="+current+" | next="+next);
  if(next == 0) $('div#slide_'+next).css('opacity', 1);
  else {
    $('div#slide_'+next).removeClass('transition').css('opacity', 1);
    $('div#slide_'+current).addClass('transition').css('opacity', 0);
  }
  current = next;
}
function slideTo(next) {
  console.log('slideTo '+next);
  stopAuto();
  $('div#slides').removeClass('auto');
  $('div.slides').removeClass('transition');
  $('div#slide_'+next).css('opacity', 1);
  $('div#slide_'+current).css('opacity', 0);
  current = next;
  timer = setTimeout(function() {
    playAuto();
  }, 10000);
}
function playAuto() {
  $('div#slides').addClass('auto');
  timer = setTimeout(function() {
    slideshow();
  }, 1000);
}
function stopAuto() {
  clearTimeout(timer);
  $('div#slides').removeClass('auto');
}
function showSlides() {
  $('div#slides, nav#slides-navigation').css('display', 'block');
  timer = setTimeout(function() {
    playAuto();
  }, 10000);
}
function hideSlides() {
  stopAuto();
  $('div#slides, nav#slides-navigation').css('display', 'none');
}

$(function() {
  $(slides).each(function(i,v) {
    $('div#slides').append("<div id='slide_"+i+"' class='slides'></div>");
    $('div#slide_'+i).css('z-index', (i*-1)).css('background-image','url('+v+')');
  });
  $('div#slides')
    .css('width', $(document).width())
    .css('height', $(document).height());

  // la prima slide appare subito
  $('div#slide_'+current).css('opacity', 1);

  // questo è quello che lo fa girare in automatico
  $('div#slides div').on('transitionend webkitTransitionEnd', function() {
    console.log('transition end');
    if($('div#slides').hasClass('auto')) slideshow();
  });

  // si esce dal fullscreen cliccando su una foto
  $('div.slides').click(hideSlides);

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
/*var myTimer,
  screenSaverTime = 6000,
  screenSaverActive = false;

function resetTimer() {
  clearTimeout(myTimer);
  screenSaverActive = false;
  myTimer = setTimeout(function() { startScreenSaver(); }, screenSaverTime);
}
function startScreenSaver() {
  if(!screenSaverActive) {
    screenSaverActive = true;
  }
}

$(function() {
  myTimer = setTimeout(function() { startScreenSaver(); }, screenSaverTime);

  $(document).bind('click', function() {
    resetTimer();
  }).mousemove(function() {
    resetTimer();
  });
});*/
