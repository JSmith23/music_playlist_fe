export function searchComponent() {
  let element = document.createElement('div');

  element.innerHTML = '<form><input type="text" placeholder="Enter Artist"><input type="submit" value="Submit"></form>'

  return element;
}