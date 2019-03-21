export function playlistsComponent() {
  let element = document.createElement('div');

  let favorites = '<p id="favorites">Favorites</p>';

  $.getJSON('https://jsonplaceholder.typicode.com/albums', function (response) {
    // debugger;
    let theHTML;
    response.forEach(album => {
      theHTML += `<p>${album.title}</p>`;
    })
    element.innerHTML = theHTML;
  
  })
  return element;
}