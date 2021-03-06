/* http://www.subsonic.org/pages/api.jsp */

function getAlbumList(size = 10, offset = 0) {
  var params = {
    'size': size,
    'offset': offset
  };
  // ottengo la lista degli album
  console.log('ottengo la lista '+settings.type);
  JQSubSonic.getAlbumList(settings.type, params, function(err, res) {
    if (err) {
      console.warn("err", err, err.error, typeof err.error);
      return 0;
    } else {
      //console.log(res);
      var dischi = res.albumList.album.length;
      for (var i = 0; i < dischi; i++) {
        //albumList.push(res.albumList.album[i]);
        var cover = JQSubSonic.getCoverArtURL(res.albumList.album[i].coverArt, 250);
        var id = res.albumList.album[i].id;
        albumList[res.albumList.album[i].id] = {
          album: res.albumList.album[i],
          cover: cover
        };
        $('div#list').append(
          "<div class='album' id='a_"+id+"' ref='"+id+"'>\n"+
            "<div class='front'>\n"+
              "<img class='cover' src='"+cover+"' />\n"+
              "<div class='title'>"+res.albumList.album[i].title+"</div>\n"+
              "<div class='artist'>"+res.albumList.album[i].artist+"</div>\n"+
            "</div>\n"+
            "<div class='back'>\n"+
              "<img class='cover' src='"+cover+"' />\n"+
            "</div>\n"+
          "</div>"
        );
      }
    }
  });
}
function getDetails(id) {
  // carico l'elenco delle canzoni
  JQSubSonic.getMusicDirectory(id, function(err, res) {
    if(err) {
      console.warn("err", err, err.error, typeof err.error);
      return;
    } else {
      $('div#detail div.modal-content').html('').append(
        "<div class='left'>\n"+
          "<img class='cover' src='"+albumList[id].cover+"' /><br />\n"+
          "<div class='title'>"+albumList[id].album.title+"</div>\n"+
          "<div class='artist'>"+albumList[id].album.artist+"</div>\n"+
          "<a href='javascript:void(0)' class='button' id='playAll' ref='"+id+"'>\n"+
            "<span class='icon'>play3</span> Play \n"+
          "</a>\n"+
          "<a href='javascript:void(0)' class='button' id='playRadio' ref='"+id+"'>\n"+
            "<span class='icon'>lastfm</span> Radio \n"+
          "</a>\n"+
        "</div>\n"+
        "<div class='right'></div>\n"
      );
      //console.log('canzoni: '+res.directory.child.length);
      for (var i = 0; i < res.directory.child.length; i++) {
        //console.log(res.directory.child[i]);
        $('div#detail div.modal-content div.right').append(
          "<div class='track' ref='"+res.directory.child[i].id+"'>"+
            res.directory.child[i].track+". "+
            res.directory.child[i].title+
          "</div>\n"
        );
      }
    }
  });
}
function jukeGet() { // ottiene lo stato del player e la canzone in riproduzione
  JQSubSonic.jukeboxControl('get', null, function(err, res) {
    if(err) {
      console.warn("err", err, err.error, typeof err.error);
      return;
    } else {
      console.log(res);
      playlist = res.jukeboxPlaylist.entry;
      currentSong = res.jukeboxPlaylist.currentIndex;
      if(res.jukeboxPlaylist.playing) {
        var song = playlist[currentSong];
        $('span#nowPlaying').text(song.artist+" - "+song.title+" - "+song.album);
      } else {
        console.log('jukebox fermo');
        if(playlist) {
        	$('span#nowPlaying').text('Player paused');
    	} else {
    		$('span#nowPlaying').text('Player stopped');
    	}
        clearInterval(playingInt);
      }
    }
  });
}
function jukePlay() {
	jukeGain(1); // imposto il volume al massimo
	JQSubSonic.jukeboxControl('start', null, function(err, res) {
		if(err) {
			console.warn("err", err, err.error, typeof err.error);
			return;
		} else {
			console.log(res);
			jukeGet();
			if(res.jukeboxStatus.playing) playingWatch();
	    }
	});
}
function jukeStop() {
	JQSubSonic.jukeboxControl('clear', null, function(err, res) {
    	if(err) {
			console.warn("err", err, err.error, typeof err.error);
			return;
		} else {
			console.log(res);
			if(!res.jukeboxStatus.playing) clearInterval(playingInt);
			jukeGet();
		}
	});
}
function jukePause() {
	JQSubSonic.jukeboxControl('stop', null, function(err, res) {
    	if(err) {
			console.warn("err", err, err.error, typeof err.error);
			return;
		} else {
			console.log(res);
			if(!res.jukeboxStatus.playing) clearInterval(playingInt);
			jukeGet();
		}
	});
}
function jukeSkip(index) {
	console.log('index: '+index);
	if(!index) index = currentSong+1;
	params = {
        index: index
    };
	JQSubSonic.jukeboxControl('skip', params, function(err, res) {
    	if(err) {
			console.warn("err", err, err.error, typeof err.error);
			return;
		} else {
			console.log(res);
			if(!res.jukeboxStatus.playing) clearInterval(playingInt);
			jukeGet();
		}
	});
}
function jukeGain(gain) {
	JQSubSonic.jukeboxControl('setGain', {'gain': gain}, function(err, res) {
		if(err) {
			console.warn("err", err, err.error, typeof err.error);
			return;
		} else {
			console.log(res);
		}
	});
}
