/*
 * 
 * @type Javascript raw file
 * 
 */

var scrollingTime = 1250; // 1250ms scrolling timer by default for a modern PC.
var songsShownByPage = 100; // 100 is the maximum song number shown per pagination.
var splitCharacterArtistAndAlbum = '•'; // The separation character in the string 'artist + album'
var playListName = document.title; // The playlist name.

var totalSongsContainer = document.getElementsByClassName("entity-additional-info");
var totalSongs = totalSongsContainer[0].innerText.split(' ')[0];
console.log('Total songs to export: ' + totalSongs);
recursiveScrollDown(totalSongs);

/*
 * Functions declarations:
 */

/**
* Scroll down the playlist page recursively, and when the end is reached 
* calls the exporting function.
* @param {number} totalSongs - The number of songs which are not paginated yet.
*/
function recursiveScrollDown(totalSongs) {
    if (totalSongs > 1) {
        setTimeout(function () {
            var lastSong = (totalSongs - songsShownByPage <= 1) ? 1 : (totalSongs - songsShownByPage);
            console.log('More than ' + songsShownByPage + ' songs detected. Scrolling down from song #' + totalSongs + ' to song #' + lastSong);
            window.scrollTo(0, document.body.scrollHeight);
            totalSongs -= songsShownByPage;
            recursiveScrollDown(totalSongs);
        }, scrollingTime);
    } else {
        getCSV();
        var finalSongNumber = (totalSongs<1) ? 1 : totalSongs;
        console.log('Calling the export function at song number: ' + finalSongNumber);
    }
}


/**
* Export to a CSV file all the songs + artists + albums of the current playlist.
*/
function getCSV() {
    var titleList = ['Title']; // Header row
    var allTitleObjects = document.getElementsByClassName("tracklist-name");
    for (var i = 0; i < allTitleObjects.length; i++) {
        var title = allTitleObjects[i].innerText;
        titleList.push(title);
    }
    ;

    var artistList = ['Artist']; // Header row
    var albumList = ['Album']; // Header row
    var allArtistAlbumObjects = document.getElementsByClassName("artists-album");
    for (var i = 0; i < allArtistAlbumObjects.length; i++) {
        var artistAndAlbumString = allArtistAlbumObjects[i].innerText;
        var splittedArtistAndAlbum = artistAndAlbumString.split(splitCharacterArtistAndAlbum);
        var artist = splittedArtistAndAlbum[0];
        var album = splittedArtistAndAlbum[1];
        artistList.push(artist);
        albumList.push(album);
    }
    ;

    var csvContent = ""; // data:text/csv;charset=utf-8,%EF%BB%BF
    var listLenght = titleList.length;
    for (var i = 0; i < listLenght; i++) {
        csvContent += titleList[i] + ";" + artistList[i] + ";" + albumList[i] + "\n";
    }
    ;

    // Utf-8 encoding by default.
    textEncoder = new TextEncoder('utf-8');
    // Adding MOB prefix due to Microsoft Office compatibility.
    var csvContentEncoded = textEncoder.encode(['\uFEFF' + csvContent]);
    var blob = new Blob([csvContentEncoded], {type: 'text/csv;charset=utf-8;'});
    var filename = playListName + '.csv';
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
