import React, { createContext } from 'react';

export const initialValue = {
  token: null,
  userName: 'User',
  store: { decks: [] },
  isSmallScreen: false,
  selectedElement: null
};

export const Context = createContext(initialValue);
export const useContext = React.useContext;
