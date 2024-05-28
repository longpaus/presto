import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import DeleteDeckModal from '../components/common/DeleteDeckModal';
import LogoutBtn from '../components/common/LogoutBtn';
import { Context, useContext } from '../context';
import Button from '@mui/material/Button';
import { saveStore } from '../utils/apiCalls';
import Box from '@mui/material/Box';
import { elDimensionValidation, findAndRemove, findById } from '../utils/utils';
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ActionMenu, { ACTIONS } from '../components/ActionMenu';
import Slide from '../components/Slide';
import { ELEMENT_TYPE, newElement, newSlide } from '../utils/data';
import InputModal from '../components/common/InputModal';
import detectLang from 'lang-detector'
import DeckName from '../components/DeckName';
import ElementProperties, { ELEMENT_ACTIONS } from '../components/ElementProperties';
import { LEFT_PANEL_WIDTH, RIGHT_PANEL_WIDTH } from '../utils/constants';

export default function Deck () {
  const { getters, setters } = useContext(Context);
  const { deckId } = useParams();
  const [deck] = useState(() => findById(getters.store.decks, deckId));
  const [slideIndex, setSlideIndex] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [modals, setModals] = useState({ delete: false, changeBackground: false, addText: false, addImage: false, addCode: false, addVideo: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (forceUpdate) {
      setForceUpdate(false);
      setters.setSelectedElement(null);
    }
  }, [forceUpdate]);

  useEffect(() => {
    setters.setSelectedElement(null);
  }, [slideIndex]);

  const toggleModal = (modalName) => {
    setModals({ ...modals, [modalName]: !modals[modalName] });
  };

  const handleDeleteDeck = (deckId) => {
    findAndRemove(getters.store.decks, deckId);
    saveStore(getters.store, getters.token);
    navigate('/dashboard');
  }

  const handleChangeBackground = (formData) => {
    if (formData.colorPicker) {
      deck.slides[slideIndex].backgroundColor = formData.colorPicker;
      if (formData.setBackground) {
        deck.backgroundColor = formData.colorPicker
        for (const slide of deck.slides) {
          slide.backgroundColor = formData.colorPicker;
        }
      }
      saveStore(getters.store, getters.token);
    }
  }
  const handleRename = (name) => {
    deck.title = name;
    saveStore(getters.store, getters.token);
  }

  const handleAddText = (formData) => {
    const element = newElement(formData);
    element.type = ELEMENT_TYPE.TEXT;
    deck.slides[slideIndex].elements.push(element);
    saveStore(getters.store, getters.token);
  }

  const handleAddImage = (formData) => {
    const element = newElement(formData);
    element.type = ELEMENT_TYPE.IMAGE;
    deck.slides[slideIndex].elements.push(element);
    saveStore(getters.store, getters.token);
  }

  const handleAddCode = (formData) => {
    const element = newElement(formData)
    element.type = ELEMENT_TYPE.CODE;
    const lang = detectLang(element.text);
    element.codeLanguage = lang;
    deck.slides[slideIndex].elements.push(element);
    saveStore(getters.store, getters.token);
  }

  const handleAddVideo = (formData) => {
    const element = newElement(formData);
    element.type = ELEMENT_TYPE.VIDEO;
    deck.slides[slideIndex].elements.push(element);
    saveStore(getters.store, getters.token);
  }

  const handleAction = (action) => {
    switch (action) {
      case ACTIONS.NEW_SLIDE:
        deck.slides.push(newSlide(deck));
        saveStore(getters.store, getters.token)
        setSlideIndex(deck.slides.length - 1);
        break;
      case ACTIONS.DELETE_SLIDE:
        if (deck.slides.length > 1) {
          findAndRemove(deck.slides, deck.slides[slideIndex].id);
          saveStore(getters.store, getters.token)
          if (slideIndex === 0) {
            setForceUpdate(true);
          } else {
            setSlideIndex(slideIndex - 1);
          }
        }
        break;
      case ACTIONS.BACKGROUND:
        toggleModal('changeBackground');
        break;
      case ACTIONS.ADD_TEXT:
        toggleModal('addText');
        break;
      case ACTIONS.ADD_IMAGE:
        toggleModal('addImage');
        break;
      case ACTIONS.ADD_CODE:
        toggleModal('addCode');
        break;
      case ACTIONS.ADD_VIDEO:
        toggleModal('addVideo');
        break;
      case ELEMENT_ACTIONS.DELETE_ELEMENT:
        findAndRemove(deck.slides[slideIndex].elements, getters.selectedElement.id);
        saveStore(getters.store, getters.token)
        setForceUpdate(true);
        break;
      default:
        console.log(`${action} action clicked`);
        break;
    }
  }

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Button
              variant="contained"
              color="info"
              sx={{ mr: 2 }}
              onClick={() => toggleModal('delete')}
            >
              Delete
            </Button>
            <DeckName title={deck.title} handleNameChange={handleRename}/>

          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={() => navigate('/dashboard')}
          >
            Back
          </Button>
          <LogoutBtn/>
        </Toolbar>
      </AppBar>
      <DeleteDeckModal
        open={modals.delete}
        onConfirm={handleDeleteDeck}
        onClose={() => toggleModal('delete')}
        deckId={deckId}
      />
      <InputModal
        open={modals.changeBackground}
        onSubmit={handleChangeBackground}
        onClose={() => toggleModal('changeBackground')}
        dialogTitle="Change Slide Background Colour"
        fields={[{
          id: 'colorPicker',
          label: 'colorPicker',
          type: 'colorPicker'
        }, {
          id: 'setBackground',
          label: 'Set As Default Background',
          type: 'boolean'
        }
        ]}
      />
      <InputModal
        open={modals.addText}
        onSubmit={handleAddText}
        onClose={() => toggleModal('addText')}
        dialogTitle="Add a Text Box"
        fields={[{
          id: 'width',
          label: 'Width',
          type: 'number',
          validation: width => elDimensionValidation(width)
        },
        {
          id: 'height',
          label: 'Height',
          type: 'number',
          validation: height => elDimensionValidation(height)
        },
        {
          id: 'text',
          label: 'TEXT',
          type: 'text',
          required: true
        },
        {
          id: 'fontSize',
          label: 'Font Size',
          type: 'number'
        },
        {
          id: 'color',
          label: 'Color',
          type: 'text'
        }
        ]}
      />
      <InputModal
        open={modals.addImage}
        onSubmit={handleAddImage}
        onClose={() => toggleModal('addImage')}
        dialogTitle="Add an image"
        fields={[
          {
            id: 'width',
            label: 'Width',
            type: 'number',
            validation: width => elDimensionValidation(width)
          },
          {
            id: 'height',
            label: 'Height',
            type: 'number',
            validation: height => elDimensionValidation(height)
          },
          {
            id: 'url',
            label: 'Image url',
            type: 'text',
            required: true
          },
          {
            id: 'text',
            label: 'alt Tag',
            type: 'text',
            required: true
          }
        ]}
      />
      <InputModal
        open={modals.addCode}
        onSubmit={handleAddCode}
        onClose={() => toggleModal('addCode')}
        dialogTitle="Add Code Block"
        fields={[
          {
            id: 'width',
            label: 'Width',
            type: 'number',
            validation: width => elDimensionValidation(width)
          }, {
            id: 'height',
            label: 'Height',
            type: 'number',
            validation: height => elDimensionValidation(height)
          },
          {
            id: 'text',
            label: 'Code',
            type: 'text',
            multiline: true,
            rows: 5,
            required: true
          },
          {
            id: 'fontSize',
            label: 'Font Size',
            type: 'number'
          }
        ]}
      />
      <InputModal
        open={modals.addVideo}
        onSubmit={handleAddVideo}
        onClose={() => toggleModal('addVideo')}
        dialogTitle="Add Video"
        fields={[
          {
            id: 'width',
            label: 'Width',
            type: 'number',
            validation: width => elDimensionValidation(width)
          }, {
            id: 'height',
            label: 'Height',
            type: 'number',
            validation: height => elDimensionValidation(height)
          },
          {
            id: 'url',
            label: 'Video url',
            type: 'text',
            required: true
          },
          {
            id: 'autoPlay',
            label: 'Auto Play',
            type: 'boolean'
          }
        ]}
      />
      <Box mt={10} display="flex" flexDirection="row" >
        <Box width={LEFT_PANEL_WIDTH}>
          <ActionMenu handleAction={handleAction} numSlides={deck.slides.length}/>
        </Box>
        <Box ml={2} mr={2}>
          <Box display="flex" flexDirection="column" alignItems="center" spacing={2}>
            <Box>
              <Slide slide={deck.slides[slideIndex]} index={slideIndex}/>
            </Box>
            <Box>
              <IconButton style={{ visibility: slideIndex <= 0 ? 'hidden' : 'visible' }}>
                <ArrowBackIosNewIcon onClick={() => (setSlideIndex(slideIndex - 1))}/>
              </IconButton>
              <IconButton style={{ visibility: slideIndex >= deck.slides.length - 1 ? 'hidden' : 'visible' }}>
                <ArrowForwardIosIcon onClick={() => (setSlideIndex(slideIndex + 1))}/>
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box width={RIGHT_PANEL_WIDTH}>
          {getters.selectedElement != null && <ElementProperties handleAction={handleAction}/>}
        </Box>
      </Box>
    </>
  );
}
