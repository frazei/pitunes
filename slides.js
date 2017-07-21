var slides = [
  "http://loremflickr.com/800/480/iceland?random=1",
  "http://loremflickr.com/800/480/iceland?random=2",
  "http://loremflickr.com/800/480/iceland?random=3"
];
var current = 0,
  timer;

function bgfader() {
  var next = (current+1 >= slides.length) ? 0 : current+1;
  console.log("current="+current+" | next="+next);
  if(next == 0) $('div#slide_'+next).css('opacity', 1);
  else {
    $('div#slide_'+next).removeClass('transition').css('opacity', 1);
    $('div#slide_'+current).addClass('transition').css('opacity', 0);
  }
  current = next;
}
function showSlides() {
  $('div#slides').css('display', 'block');
  timer = setTimeout(function() {
    bgfader();
  }, 1000);
}
function hideSlides() {
  $('div#slides').css('display', 'none');
  clearTimeout(timer);
}

$(function() {
  $(slides).each(function(i,v) {
    $('div#slides').append("<div id='slide_"+i+"' class='slides'></div>");
    $('div#slide_'+i).css('z-index', (i*-1)).css('background-image','url('+v+')');
  });
  $('div#slides').css('width', $(document).width()).css('height', $(document).height());
  $('div#slide_'+current).css('opacity', 1);
  $('div#slides div').on('transitionend webkitTransitionEnd', function() {
    console.log('transition end');
    bgfader();
  });
  
  timer = setTimeout(function() {
    bgfader();
  }, 1000);
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
