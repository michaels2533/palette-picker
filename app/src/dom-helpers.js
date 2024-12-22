import { addPalette, deletePaletteByUUID } from './local-storage';

// Write the Hex Code using the Clipboard API.
function writeHexCode(hexCode) {
  navigator.clipboard
    .writeText(hexCode)
    .then(() => {
      console.log('Successfully Copied to Clipboard!');
    })
    .catch(() => {
      console.log('Error: something went wrong!');
    });
}

const createPaletteCard = (paletteObj) => {
  // Build out the palette card using the palette object data.
  //Create a brand new palette card element.
  const paletteCard = document.createElement('li');
  paletteCard.classList.add('palette-card');
  // Create the title of the card.
  const h3 = document.createElement('h3');
  h3.textContent = paletteObj.title;
  // Create a div to group the color items.
  const colors = document.createElement('div');
  colors.classList.add('colors');
  //Loop through the palette colors.
  paletteObj.colors.forEach((colorCode) => {
    //Create the color item div that will contain the color swatch and button.
    const colorItem = document.createElement('div');
    colorItem.classList.add('color-item');
    //Create the color swatch div.
    const colorSwatch = document.createElement('div');
    colorSwatch.classList.add('color-swatch');
    colorSwatch.style.setProperty('background-color', colorCode);
    colorSwatch.style.setProperty('color', 'white');
    colorSwatch.textContent = 'Text Example';
    // Create a button with the Hex Code.
    const colorButton = document.createElement('div');
    const colorText = document.createElement('span');
    const colorHex = document.createElement('span');
    colorText.textContent = 'Copy ';
    colorHex.textContent = colorCode;
    colorButton.appendChild(colorText);
    colorButton.appendChild(colorHex);
    colorButton.classList.add('copy-button');
    // Add a click event listener to each button that copies the hex code to the Clipboard.
    colorButton.addEventListener('click', () => {
      // Copies the text to the Clipboard.
      writeHexCode(colorCode);

      //Temporarily changes the text content of the button.
      const originalTextContent = colorButton.textContent;
      colorButton.textContent = 'Copied Hex!';

      //Switches the text back after a brief period.
      setTimeout(() => {
        colorButton.textContent = originalTextContent;
      }, 1000);
    });
    //Insert the color swatch and button into the color item div.
    colorItem.appendChild(colorSwatch);
    colorItem.appendChild(colorButton);
    // Append the color item to the 'colors' div.
    colors.appendChild(colorItem);
  });
  //Adds a delete button.
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete Button';
  deleteButton.id = 'delete-button';
  //Add a click event listener to delete the palette.
  deleteButton.addEventListener('click', handlePaletteDeletion);

  //Add a temperature banner along the bottom that is colored by the temperature.
  const tempFooter = document.createElement('span');
  tempFooter.classList.add('tag');

  //Changes the color of the banner according to the temperature
  switch (paletteObj.temperature) {
    case 'neutral':
      tempFooter.textContent = paletteObj.temperature;
      tempFooter.style.setProperty('background-color', '#555555');
      break;
    case 'warm':
      tempFooter.textContent = paletteObj.temperature;
      tempFooter.style.setProperty('background-color', '#431212');
      break;
    case 'cool':
      tempFooter.textContent = paletteObj.temperature;
      tempFooter.style.setProperty('background-color', '#1e81b0 ');
      break;
    default:
      tempFooter.textContent = paletteObj.temperature;
      break;
  }
  //Add the palette card components into palettes card div.
  paletteCard.appendChild(h3);
  paletteCard.appendChild(colors);
  paletteCard.appendChild(deleteButton);
  paletteCard.appendChild(tempFooter);

  //Assign a data attribute that stores the UUID.
  paletteCard.dataset.uuid = paletteObj.uuid;

  return paletteCard;
};

const renderThePalettes = (storedPalettes) => {
  // Grab the DOM element that will contain the list of palettes.
  const palettesList = document.querySelector('#palettes-list');
  // Create a empty palette card element
  let paletteCard = document.createElement('li');

  //Retrieve the keys values(UUID) of the stored palettes object.
  const UUIDs = Object.keys(storedPalettes);

  // Loops through each stored palette using the UUID.
  for (let i = 0; i < UUIDs.length; i++) {
    //Creates the palette card with the palette object data.
    paletteCard = createPaletteCard(storedPalettes[UUIDs[i]]);
    //Inserts the palette card into the list of palettes.
    palettesList.appendChild(paletteCard);
  }
};

const handleFormSubmit = (event) => {
  // Prevent the default browser submit behavior
  event.preventDefault();

  // Grab the DOM element that will contain the list of palettes.
  const palettesList = document.querySelector('#palettes-list');

  // The form element containing the submitted palette information.
  const paletteForm = event.target;

  //Create a new palette object with the submitted information.
  const paletteObj = {
    uuid: crypto.randomUUID(),
    title: paletteForm.paletteTitle.value,
    colors: [],
  };

  // Fill the array with the selected color codes.
  for (let i = 1; i <= 3; i++) {
    paletteObj.colors.push(paletteForm[`color${i}`].value);
  }

  //Check validation for radio buttons.
  const radioButtons = paletteForm.temp;
  // Loops through the list of radio buttons.
  for (let i = 0; i < radioButtons.length; i++) {
    // Determines whether the radio button is checked.
    if (radioButtons[i].checked) {
      paletteObj.temperature = radioButtons[i].value;
    }
  }

  //Add the palette object in localStorage.
  addPalette(paletteObj);

  //Convert the palette object to a DOM element(li element).
  const paletteLiElm = createPaletteCard(paletteObj);

  // Add the palette li element into the DOM.
  palettesList.appendChild(paletteLiElm);

  // Resets the form inputs
  paletteForm.reset();
};

const deletePaletteCardByUUID = (uuid) => {
  // Grab the DOM element that will contain the list of palettes.
  const palettesList = document.querySelector('#palettes-list');

  // Grab the DOM element with a 'data-uuid' attribute that is set to the provided uuid.
  const paletteToBeDeleted = document.querySelector(`[data-uuid="${uuid}"]`);

  // Deletes the palette from the the list of palettes.
  palettesList.removeChild(paletteToBeDeleted);
};

const handlePaletteDeletion = (event) => {
  // Selects the parent li of the button
  const targetPalette = event.target.parentElement;

  // Delete palette from localStorage
  deletePaletteByUUID(targetPalette.dataset.uuid);

  //Remove palette from the DOM
  deletePaletteCardByUUID(targetPalette.dataset.uuid);
};

export { renderThePalettes, handleFormSubmit, handlePaletteDeletion };
