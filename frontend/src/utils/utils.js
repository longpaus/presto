export const findById = (decks, deckId) => {
  return decks.find(deck => deck.id === deckId);
};

export const findAndRemove = (decks, deckId) => {
  const index = decks.findIndex(deck => deck.id === deckId);
  if (index !== -1) {
    decks.splice(index, 1);
  }
};

export const findAndUpdateElement = (store, updatedElement) => {
  for (const deck of store.decks) {
    for (const slide of deck.slides) {
      const indexToUpdate = slide.elements.findIndex((el) => el.id === updatedElement.id);
      if (indexToUpdate !== -1) {
        slide.elements[indexToUpdate] = updatedElement;
        return;
      }
    }
  }
};

export const checkNumber = (num) => {
  const minValue = 1;
  const maxValue = 99;
  const roundedNum = parseFloat(num).toFixed(2);
  return Math.max(minValue, Math.min(roundedNum, maxValue));
};

export const getNumber = (str) => {
  try {
    return checkNumber(parseFloat(str.replace('%', '').replace('em', '')).toFixed(2));
  } catch (error) {
    return 0;
  }
};

export const elDimensionValidation = (dimension) => {
  return !dimension || (dimension > 0 && dimension <= 100)
}
