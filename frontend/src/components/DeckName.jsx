import React, { useState } from 'react';
import { TextField } from '@mui/material';
export default function DeckName ({ title, handleNameChange }) {
  const [name, setName] = useState(title);
  const handleOnChange = (e) => {
    const newName = e.target.value;
    handleNameChange(newName);
    setName(newName);
  }
  return (
    <TextField
      value={name}
      sx={{
        input: { color: 'white', fontSize: '1.2em' },
      }}
      onChange={handleOnChange}
    >

    </TextField>
  )
}
