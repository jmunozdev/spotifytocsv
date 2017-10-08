/*
 * 
 * @type Javascript raw file
 * 
 */

var totalSongsContainer = document.getElementsByClassName("entity-additional-info");
var totalSongs = totalSongsContainer[0].innerText.split(' ')[0];
console.log('Total songs to export: ' + totalSongs);
recursiveScrollDown(totalSongs);


/*
 * Functions declarations:
 */


function recursiveScrollDown(totalSongs) {
    if (totalSongs > 100) {
        setTimeout(function () {
            var lastSong = (totalSongs - 100 <= 1) ? 1 : (totalSongs - 100);
            console.log('More than 100 songs detected. Scrolling down from song #' + totalSongs + ' to song #' + lastSong);
            window.scrollTo(0, document.body.scrollHeight);
            totalSongs -= 100;
            recursiveScrollDown(totalSongs);
        }, 1250);
    } else {
        getCSV();
        console.log('llamada a funcion! Ibamos por la cancion numero: ' + totalSongs);
    }
}

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
        var titleAndArtistString = allArtistAlbumObjects[i].innerText;
        var splittedTitleAndArtist = titleAndArtistString.split('•');
        var artist = splittedTitleAndArtist[0];
        var album = splittedTitleAndArtist[1];
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
    var filename = document.title + '.csv';
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
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