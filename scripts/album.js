var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    { title: 'Blue', duration: '4:26' },
    { title: 'Green', duration: '3:14' },
    { title: 'Red', duration: '5:01' },
    { title: 'Pink', duration: '3:21' },
    { title: 'Magenta', duration: '2:15' }
  ]
};
var albumMarconi = {
  title: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/02.png',
  songs: [
    { title: 'Hello, Operator?', duration: '1:01' },
    { title: 'Ring, ring, ring', duration: '5:01' },
    { title: 'Fits in your pocket', duration: '5:01' },
    { title: 'Can you hear me now?', duration: '3:14' },
    { title: 'Wrong phone number', duration: '2:15' },
    { title: 'Bonus Track (Live Jam)', duration: '15:42'}
  ]
};
var albumPinback = {
  title: 'This is a Pinback CD',
  artist: 'Pinback',
  label: 'Ace Fu Records',
  year: '1999',
  albumArtUrl: 'assets/images/album_covers/pinbackcover.png',
  songs: [
    { title: 'Tripoli', duration: '4:30' },
    { title: 'Hurley', duration: '3:55' },
    { title: 'Charborg', duration: '3:28' },
    { title: 'Chaos Engine', duration: '3:38' },
    { title: 'Shag', duration: '3:05' },
    { title: 'Loro', duration: '3:33' },
    { title: 'Crutch', duration: '4:31' },
    { title: 'Rousseau', duration: '5:08' },
    { title: 'Lyon', duration: '5:18' },
    { title: 'Montaigne', duration: '5:38' }
  ]
};

var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + ' <td class="song-item-title">' + songName + '</td>'
  + ' <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;

  var $row = $(template);

  var clickHandler = function() {
    var songNumber = $(this).attr('data-song-number');

    if (currentlyPlayingSong === null) {
      $(this).html(pauseButtonTemplate);
      currentlyPlayingSong = songNumber;
    } else if (currentlyPlayingSong === songNumber) {
      $(this).html(playButtonTemplate);
      currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songNumber) {
      var currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
      currentlyPlayingSongElement.html(currentlyPlayingSong);
      $(this).html(pauseButtonTemplate);
      currentlyPlayingSong = songNumber;
    }
  };

  var onHover = function(event){
    var songNumberElement = $(this).find('.song-item-number');
    var songNumber = songNumberElement.attr('data-song-number');
    if (songNumber !== currentlyPlayingSong) {
      songNumberElement.html(playButtonTemplate);
    }
  };

  var offHover = function(event){
    var songNumberElement = $(this).find('.song-item-number');
    var songNumber = songNumberElement.attr('data-song-number');
    if (songNumber !== currentlyPlayingSong) {
      songNumberElement.html(songNumber);
    }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
}

var setCurrentAlbum = function(album) {

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

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;

$(document).ready(function(){
  setCurrentAlbum(albumPinback);
});
