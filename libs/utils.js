/*globals unescape*/ /*jshint -W083 */
Number.prototype.toHHMMSS = function(includeHour) {
  var seconds = Math.floor(this),
    hours = Math.floor(seconds / 3600);
  if (includeHour) seconds -= hours * 3600;
  var minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10 && includeHour) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var rv = "";
  if (includeHour) rv += hours + ':';
  return rv + minutes + ':' + seconds;
};

// modified from http://stackoverflow.com/questions/2167602/optimum-way-to-compare-strings-in-javascript
function strcmp(a, b)
{
    a = a ? a.toLowerCase() : "";
    b = b ? b.toLowerCase() : "";
    return (a<b?-1:(a>b?1:0));
}

// from http://snipplr.com/view.php?codeview&id=30964
String.prototype.hexDecode = function() {
  var r = '';
  for (var i = 0; i < this.length; i += 2) {
    r += unescape('%' + this.substr(i, 2));
  }
  return r;
};

String.prototype.hexEncode = function() {
  var r = '';
  var i = 0;
  var h;
  while (i < this.length) {
    h = this.charCodeAt(i++).toString(16);
    while (h.length < 2) { /* h = h ? */ }
    r += h;
  }
  return r;
};

String.prototype.stripLinks = function() {
  var txt = this;
  txt = txt.replace(/<a\b[^>]*>/ig, "");
  txt = txt.replace(/<\/a>/ig, "");
  return txt;
};

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}

String.prototype.format = String.prototype.f = function() {
  var s = this,
    i = arguments.length;

  while (i--) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
  }
  return s;
};

String.prototype.f = String.prototype.format;

String.prototype.sentences = function() {
  var str = this || "";
  // from http://stackoverflow.com/questions/18914629/split-string-into-sentences-in-javascript
  var rv1 = str.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
  var rv2 = [];
  // abreviations can f this up, so clean it a bit.
  for (var i = 0; i < rv1.length; ++i) {
    var s = "";
    while (s.length < 20 && i < rv1.length) {
      s += rv1[i];
      if (s.length < 20) ++i;
    }
    s.replace(". .", ".");
    s = s.trim();
    if (s.length) rv2.push(s);
  }
  return rv2;
};

Array.prototype.remove = function(item) {
  var index = this.indexOf(item);
  if (index >= 0) this.splice(index, 1);
  return this;
};

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

//window.getOrientation = jQuery.event.special.orientationchange.orientation;

var cssPath = function(el) {
  if (!(el instanceof Element)) return;
  var path = [];
  while (el.nodeType === Node.ELEMENT_NODE) {
    var selector = el.nodeName.toLowerCase();
    if (el.id) {
      selector += '#' + el.id;
      path.unshift(selector);
      break;
    } else {
      var sib = el,
        nth = 1;
      while (!!(sib = sib.previousElementSibling)) {
        if (sib.nodeName.toLowerCase() == selector) nth++;
      }
      if (nth != 1) selector += ":nth-of-type(" + nth + ")";
    }
    path.unshift(selector);
    el = el.parentNode;
  }
  return path.join(" > ");
};

var fixUnindexedListItemCSS = function(css) {
  return css.replace(' li ', ' li:first-child ');
};

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// option 1
var preloadPictures = function(pictureUrls, cb) {
  if (window.isChromeApp && pictureUrls[0]) {
    chromeAppFetchImage(pictureUrls[0], null, cb);
    return;
  }

  var i, j, loaded = 0;

  for (i = 0, j = pictureUrls.length; i < j; i++) {
    (function(img, src) {
      img.onload = function() {
        if (++loaded === pictureUrls.length && cb) {
          cb(null, img.src);
        }
      };

      // Use the following callback methods to debug
      // in case of an unexpected behavior.
      img.onerror = function() {};
      img.onabort = function() {};

      img.src = src;
    }(new Image(), pictureUrls[i]));
  }
};

var resizeViewPort = function(width, height) {
  if (window.outerWidth) {
    window.resizeTo(
      width + (window.outerWidth - window.innerWidth),
      height + (window.outerHeight - window.innerHeight)
    );
  } else {
    window.resizeTo(500, 500);
    window.resizeTo(
      width + (500 - document.body.offsetWidth),
      height + (500 - document.body.offsetHeight)
    );
  }
};

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function versionCompare(v1, v2, options) {
  var lexicographical = options && options.lexicographical,
    zeroExtend = options && options.zeroExtend,
    v1parts = v1.split('.'),
    v2parts = v2.split('.');

  function isValidPart(x) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) v1parts.push("0");
    while (v2parts.length < v1parts.length) v2parts.push("0");
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  for (var i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }

    if (v1parts[i] == v2parts[i]) {
      continue;
    } else if (v1parts[i] > v2parts[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (v1parts.length != v2parts.length) {
    return -1;
  }

  return 0;
}

var chromeAppWindowCache = {};

var trimImageUrlEssentials = function(url) {
  url = $.url(url);
  var key = url.attr('host') + url.attr('port') + url.param('id') + url.param('size');
  return key;
};

var chromeAppFetchImage = function(url, img, cb) {
  if (!url) return;
  var urlKey;
  if (url.startsWith('chrome') || url.indexOf(':') === -1) {
    chromeAppWindowCache[url] = url;
    if (img) $(img).attr('src', url);
    if (cb) cb(null, url);
    return;
  } else {
    urlKey = trimImageUrlEssentials(url);
  }
  var cachedUrl = url.startsWith('blob') ? url : chromeAppWindowCache[urlKey];
  if (cachedUrl && cachedUrl.startsWith('blob')) {
    if (img) $(img).attr('src', cachedUrl);
    if (cb) cb(null, cachedUrl);
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {
    var src = window.URL.createObjectURL(this.response);
    chromeAppWindowCache[urlKey] = src;
    if (img) $(img).attr('src', src);
    if (cb) cb(null, src);
  };
  xhr.send();
};

var replaceImagesForChromeApp = function() {
  if (!window.isChromeApp) return;
  $('img').each(function(i1, i2) {
    var src = i2.src;
    if (src.startsWith('htt')) {
      chromeAppFetchImage(src, i2);
    }
  });
};

var defaultSaveCallback = function(e, r) {
  if (e) console.error(e);
  // console.log("defaultSaveCallback", e, r);
};

Array.prototype.flatten = function() {
  var arr = this;
  return arr.reduce(function(flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? toFlatten.flatten() : toFlatten);
  }, []);
};

Array.prototype.unique = function(stripEmpty) {
  var a = [];
  for (var i = 0, l = this.length; i < l; i++) {
    if (stripEmpty && (this[i] === null || this[i] === undefined)) continue;
    if (a.indexOf(this[i]) === -1) {
      a.push(this[i]);
    }
  }
  return a;
};

function loadjscssfile(filename, filetype) {
  var fileref;
  if (filetype == "js") { //if filename is a external JavaScript file
    fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
  } else if (filetype == "css") { //if filename is an external CSS file
    fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
  }
  if (typeof fileref != "undefined") {
    console.log("appending", fileref);
    document.getElementsByTagName("head")[0].appendChild(fileref);
  }
}
