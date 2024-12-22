import palettes from '../palettes.json';

// The localStorage helper functions.
const setLocalStorageKey = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorageKey = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    console.err(err);
    return null;
  }
};

// The rest of the functions to interact with 'localStorage'.
export const setPalettes = (newPalettes) => {
  setLocalStorageKey('palettes', newPalettes);
};

export const getPalettes = () => {
  const savedPalettes = getLocalStorageKey('palettes');
  // Checks whether the savedPalettes objects exists if not, return a empty object.
  return savedPalettes ? savedPalettes : {};
};

export const loadDefaultPalettes = () => {
  const savedPalettes = getPalettes();

  //Load the default palettes only if palettes object is empty.
  if (Object.keys(savedPalettes).length === 0) {
    setPalettes(palettes);
  }
};

export const addPalette = (newPalette) => {
  // grab the stored palettes from the localStorage.
  const storedPalettes = getPalettes();

  //Add the new palette using its UUID.
  storedPalettes[newPalette.uuid] = newPalette;

  //Put back the modified palettes in localStorage.
  setPalettes(storedPalettes);

  return newPalette;
};

export const deletePaletteByUUID = (uuid) => {
  // Get the palettes from 'localStorage'
  const storedPalettes = getPalettes();

  // Remove the palette using its UUID.
  delete storedPalettes[uuid];

  // Update the palettes in localStorage.
  setPalettes(storedPalettes);
};

// Test Cases for the localStorage functions
const test = () => {
  console.log('Loading Default Palettes:');
  loadDefaultPalettes();
  console.log(getPalettes());
  console.log('--------------------------');

  const palette1 = {
    uuid: crypto.randomUUID(),
  };
  const palette2 = {
    uuid: crypto.randomUUID(),
  };
  console.log('Adding Palettes:');
  console.log(addPalette(palette1));
  console.log(addPalette(palette2));
  console.log(getPalettes());
  console.log('--------------------------');
  console.log('Deleting Palettes');
  console.log(deletePaletteByUUID(palette2.uuid));
  console.log(getPalettes());
  console.log('----------------------------');
};
