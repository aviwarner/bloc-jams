var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + ' <td class="song-item-title">' + songName + '</td>'
  + ' <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;

  var $row = $(template);

  var clickHandler = function(songNumber) {
    var songNumber = parseInt($(this).attr('data-song-number'));
    if (currentlyPlayingSongNumber === null) {
      setSong(songNumber);
      currentSoundFile.play();
      $(this).html(pauseButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPauseButton);
    } else if (currentlyPlayingSongNumber === songNumber) {
      if (currentSoundFile.isPaused()) {
        currentSoundFile.play();
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
      } else {
        currentSoundFile.pause();
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
      }
    } else {
      var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
      $(this).html(pauseButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPauseButton);
      setSong(songNumber);
      currentSoundFile.play();
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
  getSongNumberCell(nowPlayingNumber).text(nowPlayingNumber);
  if (nowPlayingNumber === currentAlbum.songs.length) {
    nowPlayingNumber = 0;
  }
  getSongNumberCell(nowPlayingNumber + 1).html(pauseButtonTemplate);
  setSong(nowPlayingNumber + 1);
  currentSoundFile.play();
};

var previousSong = function() {
  var wasPlayingNumber = trackIndex(currentAlbum, currentSongFromAlbum);
  var nowPlayingNumber = wasPlayingNumber - 1;
  getSongNumberCell(wasPlayingNumber + 1).text(wasPlayingNumber + 1);
  if (wasPlayingNumber === 0) {
    nowPlayingNumber = currentAlbum.songs.length - 1;
  }
  getSongNumberCell(nowPlayingNumber + 1).html(pauseButtonTemplate);
  setSong(nowPlayingNumber + 1);
  currentSoundFile.play();
};

var updatePlayerBarSong = function(song) {
    $('.artist-name').text(currentAlbum.artist);
    $('.song-name').text(song.title);
    $('.artist-song-mobile').text(currentAlbum.artist + ' - ' + song.title);
    $('.total-time').text(song.duration);
    $('.current-time').text('0:00');
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
  setVolume(currentVolume);
  updatePlayerBarSong(currentSongFromAlbum);
};

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
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

$(document).ready(function(){
  setCurrentAlbum(albumPinback);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
