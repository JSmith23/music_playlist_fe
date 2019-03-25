import _ from 'lodash';
// require('dotenv').config();
// import './style.css';
import { searchComponent } from './searchComponent/searchComponent';
import { playlistsComponent } from './playlistsComponent/playlistsComponent';
import Icon from './music.png';


function component() {
  let element = document.createElement('div');

  element.innerHTML = `
    <form id='search-bar'>
      <input id='artist' type="text" placeholder="Enter Artist">
      <input id='artist-search' type="submit" value="Submit">
    </form>
    <p id='artist-response'></p>
    <div class='button'><button id='get-favorites'>Get Favorites</button></div>
    <p id='favorites-response'></p>`;

  return element;
}

document.body.appendChild(component());

$('#artist-search').click((e) => {
  e.preventDefault();

  let artist = $('#artist').val();

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = `https://api.musixmatch.com/ws/1.1/track.search?apikey=eab02df9c3bc6447e4cbba18a982e72b&q_artist=${artist}&page_size=20`; 
  $('#artist-response').innerHTML = '';

  let textToAppend = `<table style="width:100%"><tr><th>Artist</th><th>Album</th><th>Track</th><th>Rating</th><th>Favorite</th></tr>`
  
  $.ajax({
    method: 'GET', 
    url: proxyurl + url, 
    success: ((response) => {
      let parsedResponse = JSON.parse(response);
      parsedResponse.message.body.track_list.forEach((track) => {
        textToAppend += `<tr>
                  <td>${ track.track.artist_name }</td>
                  <td>${ track.track.album_name }</td>
                  <td>${ track.track.track_name }</td>
                  <td>${ track.track.track_rating }</td>
                  <td><span class='add-to-favorites' id='${track.track.track_name}'>Add To Favorites</span></td>`
      })
      textToAppend += '</table>'
      $('#artist-response').append(textToAppend);
      addFavoriteListener();
    }),
  })
})

$('#get-favorites').click((e) => {
  e.preventDefault();

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = `http://playlist-1810.herokuapp.com/api/v1/favorites`; 
  $('#favorites-response').innerHTML = '';

  let textToAppend = `<table style="width:100%"><tr><th>Artist</th><th>Album</th><th>Track</th><th>Rating</th><th>Favorite</th><th>Edit</th></tr>`
  
  $.ajax({
    method: 'GET', 
    url: proxyurl + url, 
    success: ((response) => {
      response.forEach((track) => {
        textToAppend += `<tr>
                  <td>${ track.artist_name }</td>
                  <td>${ track.genre }</td>
                  <td>${ track.name }</td>
                  <td>${ track.track_rating }</td>
                  <td><span class='remove-favorites' id='${track.id}'>Remove From Favorites</span></td>
                  <td><span class='edit-favorites' id='${track.id}-e'>Edit</span></td>`
      })
      textToAppend += '</table>'
      $('#favorites-response').append(textToAppend);
      addDeleteListener();
      addEditListener();
    }),
  })
})

function addFavoriteListener() {
  $('.add-to-favorites').click((e) => {
    let artist = e.target.parentElement.parentElement.children[0].innerText
    let album = e.target.parentElement.parentElement.children[1].innerText
    let track = e.target.parentElement.parentElement.children[2].innerText
    let rating = e.target.parentElement.parentElement.children[3].innerText

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `http://playlist-1810.herokuapp.com/api/v1/favorites`; 

    $.ajax({
      method: 'POST',
      url: url,
      data: `{"favorites": {"name":"${track}", "artist_name":"${artist}", "genre":"${album}", "rating":"${rating}"}}`
    })
  })
}

function addDeleteListener() {
  $('.remove-favorites').click((e) => {
    debugger;
    let artistId = e.target.parentElement.parentElement.children[4].firstChild.id;

    const url = `http://playlist-1810.herokuapp.com/api/v1/favorites/${artistId}`; 

    $.ajax({
      method: 'DELETE',
      url: url,
    })
  })
}

function addEditListener() {
  $('.edit-favorites').click((e) => {
    let artist_id = e.target.parentElement.parentElement.children[5].firstChild.id;
    artist_id = artist_id.slice(0, artist_id.length - 2)

    const url = `http://playlist-1810.herokuapp.com/api/v1/favorites/${artist_id}`; 

    $.ajax({
      method: 'PUT',
      url: url, 
      data: `{"favorites": {"id": "${artist_id}", name":"${track}", "artist_name":"${artist}", "genre":"${album}", "rating":"${rating}"}}`
    })
  })
}
