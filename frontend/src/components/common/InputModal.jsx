import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';

import ColorPicker from 'react-pick-color';

export default function InputModal ({ open, onClose, onSubmit, dialogTitle, fields }) {
  const [formData, setFormData] = useState({});
  const [errorText, setErrorText] = useState({});

  const handleFieldChange = (fieldId, value) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value
    }));
  };
  const renderField = (field) => {
    switch (field.type) {
      case 'boolean':
        return renderCheckBox(field);
      case 'colorPicker':
        return renderColorGradient(field);
      default:
        return renderTextField(field);
    }
  }
  const renderColorGradient = (field) => {
    const [color, setColor] = useState('#fff');

    const handleChange = (color) => {
      setColor(color.hex);
      handleFieldChange(field.id, color.hex);
    }
    return (
      <ColorPicker
        color={color}
        onChange={color => handleChange(color)}
        theme={{
          color: 'black',
          width: '90%'
        }}
      />
    )
  }
  const renderCheckBox = (field) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={formData[field.id] || false}
          onChange={(e) => handleFieldChange(field.id, e.target.checked)}
        />
      }
      label={field.label}
    />
  )
  const renderTextField = (field) => (
    <TextField
      key={field.id}
      error={Boolean(errorText[field.id])}
      helperText={errorText[field.id]}
      autoFocus={field.autoFocus}
      margin="dense"
      multiline={field.multiline}
      rows={field.rows}
      label={field.label}
      type={field.type}
      fullWidth
      value={formData[field.id] || ''}
      onChange={(e) => handleFieldChange(field.id, e.target.value)}
    />
  )
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate each field
    const isValid = fields.every(field => {
      const fieldValue = formData[field.id];
      if (field.required && (!fieldValue || fieldValue.trim() === '')) {
        setErrorText(prevErrors => ({
          ...prevErrors,
          [field.id]: 'Required'
        }));
        return false;
      }
      if (field.validation && !field.validation(fieldValue)) {
        setErrorText(prevErrors => ({
          ...prevErrors,
          [field.id]: field.validationMessage || 'Invalid input'
        }));
        return false;
      }
      return true;
    });

    if (isValid) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({});
    setErrorText({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        {fields.map(field => (
          <React.Fragment key={field.id}>
            {renderField(field)}
          </React.Fragment>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
