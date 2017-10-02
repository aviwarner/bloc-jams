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
      $(this).html(pauseButtonTemplate);
      setSong(songNumber);
    } else if (currentlyPlayingSongNumber === songNumber) {
      $(this).html(playButtonTemplate);
      setSong(null);
      $('.main-controls .play-pause').html(playerBarPlayButton);
    } else {
      var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
      $(this).html(pauseButtonTemplate);
      setSong(songNumber);
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

var changeSong = function(direction) {
  var wasPlayingNumber = trackIndex(currentAlbum, currentSongFromAlbum);
  var nowPlayingNumber = wasPlayingNumber + direction;
  if (direction === 1) {
    getSongNumberCell(nowPlayingNumber).text(nowPlayingNumber);
    if (nowPlayingNumber === currentAlbum.songs.length) {
      nowPlayingNumber = 0;
    }
  } else {
    getSongNumberCell(wasPlayingNumber + 1).text(wasPlayingNumber + 1);
    if (wasPlayingNumber === 0) {
      nowPlayingNumber = currentAlbum.songs.length - 1;
    }
  }
  getSongNumberCell(nowPlayingNumber + 1).html(pauseButtonTemplate);
  setSong(nowPlayingNumber + 1);
};

var updatePlayerBarSong = function(song) {
    $('.artist-name').text(currentAlbum.artist);
    $('.song-name').text(song.title);
    $('.artist-song-mobile').text(currentAlbum.artist + ' - ' + song.title);
    $('.total-time').text(song.duration);
    $('.current-time').text('0:00');
    $('.main-controls .play-pause').html(playerBarPauseButtom);
};

var setSong = function(songNumber) {
  if (songNumber === null) {
    currentlyPlayingSongNumber = '';
    currentSongFromAlbum = '';
  } else {
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  }
  updatePlayerBarSong(currentSongFromAlbum);
  console.log('setSong current number is: ' + currentlyPlayingSongNumber + ' and current song is ' + currentSongFromAlbum.title);
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButtom = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentlySongFromAlbum = null;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$( document ).ready(function() {
    setCurrentAlbum(albumPinback);
    $previousButton.click(function() {
      changeSong(-1);
    });
    $nextButton.click(function() {
      changeSong(1);
    });
});
