import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Context, initialValue } from './context';
import Router from './Router';

function App () {
  const [token, setToken] = React.useState(initialValue.token);
  const [userName, setUserName] = React.useState(initialValue.userName);
  const [store, setStore] = useState(initialValue.store);
  const [isSmallScreen, setIsSmallScreen] = useState(initialValue.isSmallScreen);
  const [selectedElement, setSelectedElement] = useState(initialValue.selectedElement);

  const getters = {
    token,
    userName,
    store,
    isSmallScreen,
    selectedElement
  };

  const setters = {
    setToken: (token) => {
      setToken(token);
      localStorage.setItem('token', token);
    },
    setUserName,
    setStore,
    setIsSmallScreen,
    setSelectedElement
  }

  return (
    <Context.Provider value={{ getters, setters }}>
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
