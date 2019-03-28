function component() {
  let element = document.createElement('div');

  element.innerHTML = `
    <form id='search-bar'>
      <input id='artist' type="text" placeholder="Enter Artist">
      <input id='artist-search' type="submit" value="Submit">
    </form>
    <p id='alert-search'></p>
    <p id='artist-response'></p>
    <div class='button'><button id='get-favorites'>Get Favorites</button></div>
    <p id='alert-favorite'></p>
    <p id='favorites-response'></p>
    <form id='update-input'>
      <input id='update-artist' type='text' placeholder='Change Artist Name'>
      <input id='update-album' type='text' placeholder='Change Album Name'>
      <input id='update-track' type='text' placeholder='Change Track Name'>
      <input id='update-rating' type='text' placeholder='Change Rating'>
    </form>
    <div class='button'><button id='get-playlists'>Get Playlists</button></div>
    <p id='playlist-response'></p>
    <div id="favoriteToAdd" class="modal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <p id='modal-text'></p>
      </div>
    </div>
    <form id='add-playlist-form'>
      <input id='add-playlist' type='text' placeholder='Create New Playlist'>
      <input id='add-playlist-submit' type='submit' value='Add Playlist'>
    </form>
  `;

  return element;
}

document.body.appendChild(component());

$('#artist-search').click((e) => {
  e.preventDefault();

  let artist = $('#artist').val();

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = `https://api.musixmatch.com/ws/1.1/track.search?apikey=eab02df9c3bc6447e4cbba18a982e72b&q_artist=${artist}&page_size=20`;
  $('#artist-response').innerHTML = '';

  let textToAppend = `<table id='search-table' style="width:100%"><tr><th>Artist</th><th>Album</th><th>Track</th><th>Rating</th><th>Favorite</th></tr>`

  $.ajax({
    method: 'GET',
    url: proxyurl + url,
    success: ((response) => {
      let parsedResponse = JSON.parse(response);
      parsedResponse.message.body.track_list.forEach((track) => {
        textToAppend += `<tr>
                  <td>${ track.track.artist_name}</td>
                  <td>${ track.track.album_name}</td>
                  <td>${ track.track.track_name}</td>
                  <td>${ track.track.track_rating}</td>
                  <td><span class='add-to-favorites' id='${track.track.track_name}'>Add To Favorites</span></td>`
      })
      textToAppend += '</table>';
      clearSearch();
      $('#artist-response').append(textToAppend);
      addFavoriteListener();
    }),
  })
})



const clearFavorite = () => {
  $('#favorite-table').remove();
}
const clearSearch = () => {
  $('#search-table').remove();
}
const clearPlaylists = () => {
  $('#all-playlists').remove();
}


function getAllFavorites() {
  const url = `http://playlist-1810.herokuapp.com/api/v1/favorites`;
  $('#favorites-response').innerHTML = '';

  let textToAppend = `<table id='favorite-table' style="width:100%"><tr><th>Artist</th><th>Album</th><th>Track</th><th>Rating</th><th>Favorite</th><th>Edit</th><th>Add to Playlist</th></tr>`
  $.ajax({
    method: 'GET',
    url: url,
    success: ((response) => {
      response.forEach((track) => {
        textToAppend += `<tr>
                  <td>${ track.artist_name}</td>
                  <td>${ track.genre}</td>
                  <td>${ track.name}</td>
                  <td>${ track.rating}</td>
                  <td><span class='remove-favorites' id='${track.id}'>Remove From Favorites</span></td>
                  <td><span class='edit-favorites' id='${track.id}-e'>Edit</span></td>
                  <td><span class='addFavToPlaylist' id='${track.id}-p'>Add to Playlist</td>`
      })

        // < button id = "myBtn" > Open Modal</button >

      textToAppend += '</table>'
      clearFavorite();
      $('#favorites-response').append(textToAppend);
      addDeleteListener();
      addEditListener();
      addPlaylistListener();
    }),
  })
}

function getAllPlaylists() {
  const url = `http://playlist-1810.herokuapp.com/api/v1/playlists`;
  $('#playlist-response').innerHTML = '';

  let textToAppend = `<div id='all-playlists'>`;
  $.ajax({
    method: 'GET',
    url: url,
    success: ((response) => {
      response.forEach((playlist) => {
        textToAppend += `<div class='single-playlist'><h3>${playlist.playlist_name}</h3>`;
        if(playlist.favorites[0] != null){
          textToAppend += `<table id='favorite-table' style="width:100%"><tr><th>Artist</th><th>Album</th><th>Track</th><th>Rating</th></tr>`
          playlist.favorites.forEach(favorite => {
            textToAppend += `<tr>
                    <td>${ favorite.artist_name}</td>
                    <td>${ favorite.genre}</td>
                    <td>${ favorite.name}</td>
                    <td>${ favorite.rating}</td>`
          })
          textToAppend += '</table></div>'
          } else {
            textToAppend += '</div>'
          }

        })
      textToAppend += '</div>'
      clearPlaylists();

      $('#playlist-response').append(textToAppend);
    }),
  })
}

function addFavoriteListener() {
  $('.add-to-favorites').click((e) => {
    let artist = e.target.parentElement.parentElement.children[0].innerText
    let album = e.target.parentElement.parentElement.children[1].innerText
    let track = e.target.parentElement.parentElement.children[2].innerText
    let rating = e.target.parentElement.parentElement.children[3].innerText

    const url = `http://playlist-1810.herokuapp.com/api/v1/favorites`;
    let data = `{"name":"${track}", "artist_name":"${artist}", "genre":"${album}", "rating":"${rating}"}`

    $.ajax({
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({ 'name': track, 'artist_name': artist, 'genre': album, 'rating': rating }),
      url: url,
      success: () => {
        $('#alert-search').text('Song Added');
        getAllFavorites();
      }
    })
  })
}

function addDeleteListener() {
  $('.remove-favorites').click((e) => {
    let artistId = e.target.parentElement.parentElement.children[4].firstChild.id;

    const url = `http://playlist-1810.herokuapp.com/api/v1/favorites/${artistId}`;

    $.ajax({
      method: 'DELETE',
      url: url,
      success: () => {
        $('#alert-favorite').text('Song Deleted');
        getAllFavorites();
      }
    })
  })
}

function addEditListener() {
  $('.edit-favorites').click((e) => {
    let artist_id = e.target.parentElement.parentElement.children[5].firstChild.id;
    artist_id = artist_id.slice(0, artist_id.length - 2)

    const url = `http://playlist-1810.herokuapp.com/api/v1/favorites/${artist_id}`;

    let data = `{`;

    let track = $('#update-track').val();
    let artist = $('#update-artist').val();
    let album = $('#update-album').val();
    let rating = $('#update-rating').val();
    if (track != '') {
      data += `"name":"${track}",`
    }
    if (artist != '') {
      data += `"artist_name":"${artist}",`
    }
    if (album != '') {
      data += `"genre":"${album}",`
    }
    if (rating != '') {
      data += `"rating":"${rating}",`
    }
    data = data.slice(0, data.length - 1);
    data += '}'

    console.log(url);

    $.ajax({
      method: 'PATCH',
      data: data,
      url: url,
      success: () => {
        console.log('it worked')
      },
      failure: () => {
        console.log('it didnt work')
      }
    })
  })
}

function addPlaylistListener() {
  // MODAL STUFF

  var modal = $('#favoriteToAdd');

  // Get the button that opens the modal
  var addToPlaylist = $(".addFavToPlaylist");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal 
  addToPlaylist.click((e) => {
    let songID = e.target.id.slice(0, e.target.id.length - 2);
    let songName = e.target.parentElement.parentElement.children[2].textContent;
    let allPlaylists = `<h1>Pick a Playlist to add ${songName} to</h1>`;
    const url = `http://playlist-1810.herokuapp.com/api/v1/playlists`;
    $.ajax({
      method: 'GET',
      url: url,
      success: ((response) => {
        response.forEach((playlist) => {
          allPlaylists += `<p class='addToThisPlaylist' id='playlist-${playlist.id}'>${playlist.playlist_name}</p>`;
        })
        $('#playlist-response').append("<div id='removeModal'>" + allPlaylists + "</div>");
        $('#modal-text').append(allPlaylists);
        modal[0].style.display = "block";

        window.onclick = function (event) {
          if (event.target == modal) {
            modal[0].style.display = "none";
          }
        }
        $('.addToThisPlaylist').click((e) => {
          let playlistID = e.target.id.slice(9, e.target.id.length);
          const playlistUrl = `http://playlist-1810.herokuapp.com/api/v1/playlists/${playlistID}`;
          $.ajax({
            contentType: 'application/json',
            method: 'POST',
            data: JSON.stringify({'playlist_id': playlistID, 'favorite_id': songID}),
            url: playlistUrl,
            success: () => {
              $('#alert-search').text('Song Added');
              getAllFavorites();
              modal[0].style.display = "none";
              $('#removeModal').remove();
              document.getElementById('modal-text').innerHTML = '';
            }
          })
        })
      })
    })
  })
}


module.exports = {
  addFavoriteListener, addDeleteListener, addEditListener
}

$('#get-favorites').click((e) => {
  e.preventDefault();
  getAllFavorites();
})

$('#get-playlists').click((e) => {
  e.preventDefault();
  getAllPlaylists();
})

$('#add-playlist-submit').click((e) => {
  e.preventDefault();

  let playlistName = $('#add-playlist').val();

  const url = `http://playlist-1810.herokuapp.com/api/v1/playlists`;
  data = `{"playlist_name": "${playlistName}"}`
debugger;
  $.ajax({
    contentType: 'application/json',
    method: 'POST',
    data: JSON.stringify({ 'playlist_name': playlistName }),
    url: url,
    success: ((response) => {
      alert(`Playlist ${playlistName} added successfully`)
    })
  })
})
