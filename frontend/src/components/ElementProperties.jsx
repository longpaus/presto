import Typography from '@mui/material/Typography';
import { getProperties } from '../utils/data';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import * as React from 'react';
import { Context, useContext } from '../context';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { findAndUpdateElement } from '../utils/utils';
import { saveStore } from '../utils/apiCalls';

const TITLE_FONT_SIZE = '1rem';
const FORM_FONT_SIZE = '0.8rem';

export const ELEMENT_ACTIONS = {
  DELETE_ELEMENT: 'Delete Element'
};

export default function ElementProperties ({ handleAction }) {
  const { getters, setters } = useContext(Context);
  const actions = Object.values(ELEMENT_ACTIONS);

  const handleFieldChange = (fieldId, value) => {
    const updatedElement = {
      ...getters.selectedElement,
      [fieldId]: value
    };
    setters.setSelectedElement(updatedElement);
    findAndUpdateElement(getters.store, updatedElement);
    saveStore(getters.store, getters.token);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="left">
      <Typography variant="h6" fontSize={TITLE_FONT_SIZE} color="text.secondary" fontWeight="bold">
        {getters.selectedElement.type} Properties
      </Typography>
      {getProperties(getters.selectedElement).map((field) => (
        <React.Fragment key={field.id}>
          {field.type === 'boolean'
            ? <FormControlLabel
              control={
                <Checkbox
                  checked={field.value || false}
                  size="small"
                />
              }
              label={
                <Typography
                  variant="body2"
                  fontSize={FORM_FONT_SIZE}
                >
                  {field.label}
                </Typography>
              }
            />
            : <TextField
              variant="standard"
              key={field.id}
              multiline={field.multiline}
              rows={field.rows}
              label={field.label}
              type={field.type}
              value={field.value}
              fullWidth
              size="small"
              margin="dense"
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: FORM_FONT_SIZE // font size
                },
                '& .MuiInputLabel-root': {
                  fontSize: FORM_FONT_SIZE // font size for label
                },
                '& .MuiFormLabel-root': {
                  fontSize: FORM_FONT_SIZE // font size for form label
                }
              }}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            />
          }
        </React.Fragment>
      ))}
      <ButtonGroup variant="text" orientation="vertical" size="medium">
        {actions.map((action) => (
          <Button
            key={action}
            onClick={() => handleAction(action)}
          >
            {action}
          </Button>))}
      </ButtonGroup>
    </Box>
  )
}
