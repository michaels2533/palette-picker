import './style.css';
import {
  renderThePalettes,
  handleFormSubmit,
  handlePaletteDeletion,
} from './dom-helpers.js';
import {
  setPalettes,
  getPalettes,
  addPalette,
  deletePaletteByUUID,
  loadDefaultPalettes,
} from './local-storage';

// Ordinarily, you'd add these elements to index.html
// const uuidButton = document.createElement('button');
// const uuidText = document.createElement('p');
// document.body.append(uuidButton, uuidText);

// uuidButton.textContent = 'Generate UUID';

// uuidButton.addEventListener('click', () => {
//   const newUUID = generateUUID();
//   uuidText.textContent = `your new uuid is: ${newUUID}`;
// });

// Main function
const main = () => {
  //Initializes the default palettes only if all the palettes are removed.
  loadDefaultPalettes();

  //Renders the palettes from localStorage
  renderThePalettes(getPalettes());

  // Grab the form element and add a submit event listener.
  const paletteForm = document.querySelector('#create-palette-form');
  paletteForm.addEventListener('submit', handleFormSubmit);
};

main();
