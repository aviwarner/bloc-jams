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
  return template;
}

var setCurrentAlbum = function(album) {

  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
  // var albumNumberTracks = document.getElementsByClassName('album-view-number-tracks')[0];

  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);
  // albumNumberTracks.firstChild.nodeValue = album.songs.length + ' tracks';

  albumSongList.innerHTML = '';

  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

var findParentByClassName = function(element, targetClass) {
  if (element.parentElement === null) {
    console.log("No parent found");
  } else if (element) {
    var currentParent = element.parentElement;
      while (currentParent.className !== targetClass && currentParent.className !== null) {
        currentParent = currentParent.parentElement;
        console.log("No parent found with that class name");
      }
    return currentParent;
  }
};

var getSongItem = function(element) {
  switch (element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentByClassName(element,'song-item-number'); // why are breaks not necessary? IF you click on an element, and if that element is of the class (album-song-button, ion-pause, or ion-play), then SELECT the song-item-number
    case 'album-view-song-item':
      return element.querySelector('.song-item-number'); // if you click on the row of a song (but not a specific child element), select the song-item-number which is a specific child of that element
    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number'); // If you click on the title or duration of the song, select the parent (album-view-song-item) THEN move down to the song-item-number.
    case 'song-item-number': // If you click on the song-item-number, congrats! you've done it.
      return element;
    default:
      return;
  }
};

var clickHandler = function(targetElement) { // later we setup a click listener (line 162), this is the function called when you click
  var songItem = getSongItem(targetElement); // songItem is now defined as the song-item-number on the line you clicked

  if (currentlyPlayingSong === null) {
    songItem.innerHTML = pauseButtonTemplate; // if no song is playing yet, change that song number to 'pause'
    currentlyPlayingSong = songItem.getAttribute('data-song-number'); // since this is 'playing', define the var currentlyPlayingSong as this song number
  } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) { // if this song WAS playing, change the song number back to the number (when you hover away)
    songItem.innerHTML = playButtonTemplate; // change the icon back to play from pauseButtonTemplate
    currentlyPlayingSong = null; // clear out the currentlyPlayingSong
  } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) { // if a DIFFERENT song was playing
    var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]'); // define a new variable that's the number of the song that WAS playing
    currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number'); // change that songs button from pause back to the number
    songItem.innerHTML = pauseButtonTemplate; // change THIS song's button to pause
    currentlyPlayingSong = songItem.getAttribute('data-song-number'); // set the currentlyPlayingSong to the song you've clicked
  }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;

window.onload = function() {
  setCurrentAlbum(albumPinback);

  songListContainer.addEventListener('mouseover', function(event) { // a new mouseover listener for the song list
    if (event.target.parentElement.className === 'album-view-song-item') { // if you've hovered over something whose parent is the song row
      var songItem = getSongItem(event.target);  // define songItem as the current song-item-number

      if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) { // if the current data-song-number IS NOT currentlyPlayingSong
        songItem.innerHTML = playButtonTemplate; // change the song-item-number to the playButtonTemplate
      }
    }
  });

  for (var i = 0; i < songRows.length; i++) {

    songRows[i].addEventListener('mouseleave', function(event) {
      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');
      if (songItemNumber !== currentlyPlayingSong) {
        songItem.innerHTML = songItemNumber;
      }
    });

    songRows[i].addEventListener('click', function(event) {
      clickHandler(event.target);
    });

  }
};
