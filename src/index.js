import _ from 'lodash';
import './style.scss';
import { searchComponent } from './searchComponent/searchComponent';
import { playlistsComponent } from './playlistsComponent/playlistsComponent';
import Icon from './music.png';



function component() {
  let element = document.createElement('div');

  element.appendChild(searchComponent());
  element.appendChild(playlistsComponent());
  // element.appendChild(playlistComponent());

  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  // element.classList.add('hello');

  // // Add the image to our existing div.
  // var myIcon = new Image();
  // myIcon.src = Icon;
  // element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());