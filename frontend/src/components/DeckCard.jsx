import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Avatar, CardActionArea, CardHeader } from '@mui/material';
import { blue } from '@mui/material/colors';
import Box from '@mui/material/Box';

export default function DeckCard ({ deck }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/deck/${deck.id}`);
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ minHeight: '100px', aspectRatio: '2 / 1', maxWidth: '300px' }}>
        <CardActionArea sx={{ width: '100%', height: '100%' }} onClick={handleCardClick}>
          <CardHeader
            sx={{
              display: 'flex',
              overflow: 'hidden',
              '& .MuiCardHeader-content': {
                overflow: 'hidden'
              }
            }}
            avatar={
              <Avatar sx={{ bgcolor: blue[500] }}>
                {deck.title[0]}
              </Avatar>
            }
            title={deck.title}
            titleTypographyProps={{ noWrap: true }}
            subheader={deck.slides.length + ' slides'}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {deck.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}
