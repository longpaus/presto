import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import {
  LEFT_PANEL_WIDTH,
  RIGHT_PANEL_WIDTH,
  SCREEN_MARGIN,
  SLIDE_MAX_HEIGHT,
  SLIDE_MAX_WIDTH,
  SMALL_SCREEN_HEIGHT,
  SMALL_SCREEN_WIDTH
} from '../utils/constants';
import { Context, useContext } from '../context';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Element from './Element';
import ReactPlayer from 'react-player/lazy';
import { ELEMENT_TYPE } from '../utils/data';

const ASPECT_RATIO = SLIDE_MAX_WIDTH / SLIDE_MAX_HEIGHT;
const WIDTH_SMALL_GAP = RIGHT_PANEL_WIDTH + 2 * SCREEN_MARGIN;
const WIDTH_GAP = LEFT_PANEL_WIDTH + RIGHT_PANEL_WIDTH + 2 * SCREEN_MARGIN;
const HEIGHT_GAP = 150; // Top Bar + Slide navigation arrows

export default function Slide ({ slide, index, handleSelectElement }) {
  const { setters } = useContext(Context);
  const [slideSize, setSlideSize] = useState({ width: SLIDE_MAX_WIDTH, height: SLIDE_MAX_HEIGHT, scale: 1 });

  useEffect(() => {
    const updateSlideSize = () => {
      const isSmallScreen = window.innerWidth < SMALL_SCREEN_WIDTH || window.innerHeight < SMALL_SCREEN_HEIGHT;
      setters.setIsSmallScreen(isSmallScreen);

      const width = Math.min(isSmallScreen ? window.innerWidth - WIDTH_SMALL_GAP : window.innerWidth - WIDTH_GAP, SLIDE_MAX_WIDTH);
      const height = Math.min(window.innerHeight - HEIGHT_GAP, SLIDE_MAX_HEIGHT);
      if (width / height > ASPECT_RATIO) {
        setSlideSize({
          width: height * ASPECT_RATIO,
          height,
          scale: height / SLIDE_MAX_HEIGHT,
        });
      } else {
        setSlideSize({
          width,
          height: width / ASPECT_RATIO,
          scale: width / SLIDE_MAX_WIDTH,
        });
      }
    };

    window.addEventListener('resize', updateSlideSize);

    return () => {
      window.removeEventListener('resize', updateSlideSize);
    };
  }, []);

  const renderTextElement = (element) => (
    <Element key={element.id}
             element={element}
             onClick={() => handleSelectElement(element)}
    >
      <Typography sx={{
        fontFamily: element.fontFamily,
        fontSize: element.fontSize,
        color: element.color,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: '100%'
      }}>
        {element.text}
      </Typography>
    </Element>
  )

  const renderCodeElement = (element) => (
    <Element key={element.id}
             element={element}
    >
      <Box>
        {element.codeLanguage !== 'Unknown' &&
        <SyntaxHighlighter language={element.codeLanguage}
                           style={docco}
                           customStyle={{ fontSize: element.fontSize }}>
          {element.text}
      </SyntaxHighlighter>
        }
        {element.codeLanguage === 'Unknown' && element.text}

      </Box>
    </Element>
  )

  const renderImageElement = (element) => (
    <Element key={element.id} element={element}>
      <img
        src={element.url}
        alt={element.text}
        width="100%"
        height="100%"
        draggable={false}
      />
    </Element>
  )

  const renderVideoElement = (element) => (
    <Element key = {element.id} element={element}>
      <ReactPlayer url={element.url} light={true} playing={element.autoPlay} width="100%" height="100%"/>
    </Element>
  )

  const renderSlideNumber = (number) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '0',
        bottom: '0',
        width: '50px',
        height: '50px',
        zIndex: 1
      }}>
      <Typography
        sx={{
          fontFamily: 'Verdana',
          fontSize: '1em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
        {number}
      </Typography>
    </Box>)

  const renderElement = (element) => {
    switch (element.type) {
      case ELEMENT_TYPE.TEXT:
        return renderTextElement(element);
      case ELEMENT_TYPE.CODE:
        return renderCodeElement(element);
      case ELEMENT_TYPE.IMAGE:
        return renderImageElement(element);
      case ELEMENT_TYPE.VIDEO:
        return renderVideoElement(element);
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: slideSize.width,
        height: slideSize.height,
        border: '2px solid black',
        backgroundColor: slide.backgroundColor,
        boxSizing: 'border-box',
        fontSize: `${slideSize.scale}em`,
      }}
    >
      {slide.elements.map((element) => renderElement(element))}
      {renderSlideNumber(index + 1)}
    </Box>
  )
}
