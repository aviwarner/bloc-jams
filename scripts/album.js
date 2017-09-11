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
  + ' <td class="song-item-number">' + songNumber + '</td>'
  + ' <td class="song-item-title">' + songName + '</td>'
  + ' <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;
  return template;
}

var setCurrentAlbum = function(album) {

  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
  var albumNumberTracks = document.getElementsByClassName('album-view-number-tracks')[0];

  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);
  albumNumberTracks.firstChild.nodeValue = album.songs.length + ' tracks';

  albumSongList.innerHTML = '';

  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

window.onload = function() {
  setCurrentAlbum(albumPinback);

  var albumImageTwo = document.getElementsByClassName("album-cover-art")[0];

  albumImageTwo.addEventListener('click',nextAlbum);

  var i = 0;

  function nextAlbum() {
    var albumList = [albumPinback, albumPicasso, albumMarconi];
    if (i === albumList.length - 1) {
      setCurrentAlbum(albumList[0]);
      i = 0;
    } else {
      i++;
      setCurrentAlbum(albumList[i]);
    }
  };

  /* 'official solution'

  var albumList = [albumPinback, albumPicasso, albumMarconi];
  var i = 1;
  albumImageTwo.addEventListener(click, function(event) {
    setCurrentAlbum(albumList[i]);
    i++;
    if (i == albumList.length) {
      i = 0;
    }
  });
  */
};

/* Assignment 11 steps
1) Create array including all album names
2) add onClick listener to the album images
3) have listener call function setCurrentAlbum using next value in the array
*/
