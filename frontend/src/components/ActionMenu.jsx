import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { bindMenu, bindTrigger } from 'material-ui-popup-state/hooks'
import PopupState from 'material-ui-popup-state';
import { Menu } from '@mui/material';
import { Context, useContext } from '../context';
import Box from '@mui/material/Box';

export const ACTIONS = {
  NEW_SLIDE: 'New Slide',
  DELETE_SLIDE: 'Delete Slide',
  BACKGROUND: 'Background',
  PREVIEW: 'Preview',
  ADD_TEXT: 'Add TEXT',
  ADD_IMAGE: 'Add IMAGE',
  ADD_VIDEO: 'Add VIDEO',
  ADD_CODE: 'Add CODE'
};

export default function ActionMenu ({ handleAction, numSlides }) {
  const { getters } = useContext(Context);
  const actions = Object.values(ACTIONS);
  const disableDeleteSlide = (action) => action === ACTIONS.DELETE_SLIDE && numSlides <= 1;

  if (getters.isSmallScreen) {
    return (
      <Box display="flex" flexDirection="column">
        <PopupState variant="popover" popupId="popup-action-menu">
          {(popupState) => (
            <React.Fragment>
              <IconButton {...bindTrigger(popupState)}>
                <MoreVertIcon/>
              </IconButton>
              <Menu {...bindMenu(popupState)}>
                {actions.map((action) => (
                  <MenuItem
                    key={action}
                    onClick={() => {
                      popupState.close();
                      handleAction(action);
                    }}>
                    {action}
                  </MenuItem>))}
              </Menu>

            </React.Fragment>
          )}
        </PopupState>
      </Box>
    );
  } else {
    return (
      <Box display="flex" flexDirection="column">
        <ButtonGroup variant="text" orientation="vertical" size="medium">
          {actions.map((action) => (
            <Button
              key={action}
              disabled={disableDeleteSlide(action)}
              onClick={() => handleAction(action)}
            >
              {action}
            </Button>))}
        </ButtonGroup>
      </Box>
    )
  }
}
