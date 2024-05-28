import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LogoutBtn from '../components/common/LogoutBtn';
import { apiCallGet, saveStore } from '../utils/apiCalls';
import DeckCard from '../components/DeckCard';
import { Context, useContext } from '../context';
import Button from '@mui/material/Button';
import { newDeck, newSlide } from '../utils/data';
import InputModal from '../components/common/InputModal';
export default function Dashboard () {
  const { getters, setters } = useContext(Context);
  const [modalOpen, setModalOpen] = useState(false);

  React.useEffect(() => {
    apiCallGet('/store', getters.token)
      .then(data => {
        if (data.store.decks) {
          setters.setStore(data.store)
        }
      });
  }, []);

  if (getters.token === null) {
    return <Navigate to='/login' />
  }

  const handleNewDeck = (formData) => {
    const deck = newDeck();
    const firstSlide = newSlide(deck);
    deck.slides.push(firstSlide);
    deck.title = formData.name;
    deck.description = formData.description;
    getters.store.decks.push(deck);
    saveStore(getters.store, getters.token);
  }

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Hi {getters.userName}
          </Typography>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => setModalOpen(true)}
          >
            New Presentation
          </Button>
          <LogoutBtn/>
        </Toolbar>
      </AppBar>
      <InputModal
        open={modalOpen}
        onSubmit={handleNewDeck}
        onClose={() => setModalOpen(false)}
        dialogTitle="Create a new Presentaion"
        fields={[{
          id: 'name',
          label: 'Name',
          type: 'text',
          required: true
        }, {
          id: 'description',
          label: 'Description',
          type: 'text'
        }
        ]}
      />
      <Grid container spacing={2} padding={3} mt={5} maxHeight="100vh" overflow="auto">
        {getters.store.decks.map((deck) => (
            <Grid item xs={12} sm={6} md={3} lg={3} key={deck.id} flexShrink={3}>
              <DeckCard deck={deck}/>
            </Grid>
        ))}
      </Grid>
    </>
  );
}
