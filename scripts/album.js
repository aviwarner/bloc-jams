var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + ' <td class="song-item-title">' + songName + '</td>'
  + ' <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
  + '</tr>'
  ;

  var $row = $(template);

  var clickHandler = function(songNumber) {
    var songNumber = parseInt($(this).attr('data-song-number'));
    if (currentlyPlayingSongNumber === null) {
      $('.player-bar').css('bottom','0');
      setSong(songNumber);
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
      $(this).html(pauseButtonTemplate);
      $playButton.html(playerBarPauseButton);

      var $fillBar = $(".volume .fill");
      $fillBar.width(currentVolume + '%');
      var $fillThumb = $(".volume .thumb");
      $fillThumb.css("left", currentVolume + '%');

    } else if (currentlyPlayingSongNumber === songNumber) {
      if (currentSoundFile.isPaused()) {
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
        $(this).html(pauseButtonTemplate);
        $playButton.html(playerBarPauseButton);
      } else {
        currentSoundFile.pause();
        $(this).html(playButtonTemplate);
        $playButton.html(playerBarPlayButton);
      }
    } else {
      var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
      $(this).html(pauseButtonTemplate);
      $playButton.html(playerBarPauseButton);
      setSong(songNumber);
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
    }
  };

  var onHover = function(event){
    var songNumberElement = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberElement.attr('data-song-number'));
    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberElement.html(playButtonTemplate);
    }
  };

  var offHover = function(event){
    var songNumberElement = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberElement.attr('data-song-number'));
    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberElement.html(songNumber);
    }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
}

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var nextSong = function() {
  var wasPlayingNumber = trackIndex(currentAlbum, currentSongFromAlbum);
  var nowPlayingNumber = wasPlayingNumber + 1;
  if (nowPlayingNumber === currentAlbum.songs.length) {
    nowPlayingNumber = 0;
  }

  var wasPlayingElement = getSongNumberCell(wasPlayingNumber + 1);
  wasPlayingElement.text(wasPlayingNumber + 1);
  var nowPlayingElement = getSongNumberCell(nowPlayingNumber + 1);
  nowPlayingElement.html(pauseButtonTemplate);

  setSong(nowPlayingNumber + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
};

var previousSong = function() {
  var wasPlayingNumber = trackIndex(currentAlbum, currentSongFromAlbum);
  var nowPlayingNumber = wasPlayingNumber - 1;
  if (wasPlayingNumber === 0) {
    nowPlayingNumber = currentAlbum.songs.length - 1;
  }

  var wasPlayingElement = getSongNumberCell(wasPlayingNumber + 1);
  wasPlayingElement.text(wasPlayingNumber + 1);
  var nowPlayingElement = getSongNumberCell(nowPlayingNumber + 1);
  nowPlayingElement.html(pauseButtonTemplate);

  setSong(nowPlayingNumber + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
};

var togglePlayFromPlayerBar = function() {
  var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);

  if (currentSoundFile === null) { // added condition so that if no song is playing, play first song on the album
    setSong(1);
    currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber)
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    $playButton.html(playerBarPauseButton);
    currentlyPlayingSongElement.html(pauseButtonTemplate);

    var $fillBar = $(".volume .fill");
    $fillBar.width(currentVolume + '%');
    var $fillThumb = $(".volume .thumb");
    $fillThumb.css("left", currentVolume + '%');

  } else if (currentSoundFile.isPaused()) {
    currentSoundFile.play();
    $playButton.html(playerBarPauseButton);
    currentlyPlayingSongElement.html(pauseButtonTemplate);
  } else {
    currentSoundFile.pause();
    $playButton.html(playerBarPlayButton);
    currentlyPlayingSongElement.html(playButtonTemplate);
  }
};

var updatePlayerBarSong = function(song) {
    $('.artist-name').text(currentAlbum.artist);
    $('.song-name').text(song.title);
    $('.artist-song-mobile').text(currentAlbum.artist + ' - ' + song.title);
    setTotalTimeInPlayerBar();
    // $('.total-time').text(song.duration);
    // $('.current-time').text('0:00');
};

var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = songNumber;
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });

  currentSoundFile.bind("ended", function(){ // added function to play the next song when current song ends
    nextSong();
  });

  setVolume(currentVolume);
  updatePlayerBarSong(currentSongFromAlbum);
};

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

var updateSeekBarWhileSongPlays = function(){
  if (currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
      setCurrentTimeInPlayerBar();
    });
  }
};

var setCurrentTimeInPlayerBar = function() {
  var $currentTime = $('.current-time');
  $currentTime.text(filterTimeCode(currentSoundFile.getTime()));
};

var setTotalTimeInPlayerBar = function() {
  var $totalTime = $('.total-time');
  currentSoundFile.bind("durationchange", function(){ // this was an exciting discovery
    $totalTime.text(filterTimeCode(currentSoundFile.getDuration()));
  });
};

var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left;
    // console.log('event.pageX = ' + event.pageX + ' and $(this).offset().left = ' + $(this).offset().left);
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;
    updateSeekPercentage($(this), seekBarFillRatio);

    if ($(this).parent().hasClass('seek-control')) {
      seek(seekBarFillRatio * currentSongFromAlbum.duration);
    } else {
      setVolume(seekBarFillRatio * 100);
    }
  });

  $seekBars.find('.thumb').mousedown(function(event){
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event){
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      updateSeekPercentage($seekBar, seekBarFillRatio);
      if ($seekBar.parent().hasClass('seek-control')) { // question for mike: how do I not seek until done dragging 'thumb'
        seek(seekBarFillRatio * currentSongFromAlbum.duration);
      } else {
        setVolume(seekBarFillRatio * 100);
      }

    });

    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var filterTimeCode = function(seconds) {
  var parsedSeconds = parseFloat(seconds);
  var roundedSeconds = Math.floor(parsedSeconds % 60);
  if (roundedSeconds < 10) {
    roundedSeconds = '0' + roundedSeconds;
  }
  var minutes = Math.floor(parsedSeconds / 60);
  return minutes + ':' + roundedSeconds;
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentlySongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playButton = $('.main-controls .play-pause');

$(document).ready(function(){
  setCurrentAlbum(albumPinback);
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playButton.click(togglePlayFromPlayerBar);
});
