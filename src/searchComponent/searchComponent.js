export function searchComponent() {
  let element = document.createElement('div');

  element.innerHTML = `
    <form>
      <input type="text" placeholder="Enter Artist">
      <input id='artist-search' type="submit" value="Submit">
    </form>`
  
  return element;
}