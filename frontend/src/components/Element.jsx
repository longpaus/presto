import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Draggable from 'react-draggable';
import { checkNumber, getNumber } from '../utils/utils';
import { Context, useContext } from '../context';
import { saveStore } from '../utils/apiCalls';

export default function Element ({ element, children }) {
  const { getters, setters } = useContext(Context);
  const nodeRef = React.useRef(null);
  const [selected, setSelected] = useState(false);
  const [dragKey, setDragKey] = useState(0); // <-- Add state for key

  useEffect(() => {
    setSelected(getters.selectedElement && getters.selectedElement.id === element.id);
  }, [getters.selectedElement]);

  const handleDrag = (data) => {
    const parentWidth = data.node.parentElement.offsetWidth;
    const parentHeight = data.node.parentElement.offsetHeight;
    const relativeX = (data.x / parentWidth) * 100;
    const relativeY = (data.y / parentHeight) * 100;
    const relativeLeft = checkNumber(getNumber(element.left) + relativeX);
    const relativeTop = checkNumber(getNumber(element.top) + relativeY);
    const updatedElement = {
      ...element,
      left: `${relativeLeft}%`,
      top: `${relativeTop}%`
    };
    setters.setSelectedElement(updatedElement);
  };

  const handleDragStop = (data) => {
    element.left = getters.selectedElement.left;
    element.top = getters.selectedElement.top;
    saveStore(getters.store, getters.token);
    setDragKey(prevKey => prevKey + 1); // <-- Update key to force re-render
  };

  const handleDragTopLeft = (data) => {
    const parentWidth = data.node.parentElement.offsetWidth;
    const parentHeight = data.node.parentElement.offsetHeight;
    const relativeX = (data.x / parentWidth) * 100;
    const relativeY = (data.y / parentHeight) * 100;
    const relativeLeft = checkNumber(getNumber(element.left) + relativeX);
    const relativeTop = checkNumber(getNumber(element.top) + relativeY);
    const currentWidth = getNumber(element.width) * parentWidth / 100;
    const currentHeight = getNumber(element.height) * parentHeight / 100;
    const relativeWidth = checkNumber(((currentWidth - data.x) / parentWidth) * 100);
    const relativeHeight = checkNumber(((currentHeight - data.y) / parentHeight) * 100);
    const updatedElement = {
      ...element,
      left: `${relativeLeft}%`,
      top: `${relativeTop}%`,
      width: `${relativeWidth}%`,
      height: `${relativeHeight}%`
    };
    setters.setSelectedElement(updatedElement);
  };

  const handleDragStopTopLeft = (data) => {
    element.left = getters.selectedElement.left;
    element.top = getters.selectedElement.top;
    element.width = getters.selectedElement.width;
    element.height = getters.selectedElement.height;
    saveStore(getters.store, getters.token);
    setDragKey(prevKey => prevKey + 1); // <-- Update key to force re-render
  };

  const handleDragTopRight = (data) => {
    const parentWidth = data.node.parentElement.offsetWidth;
    const parentHeight = data.node.parentElement.offsetHeight;
    const relativeY = (data.y / parentHeight) * 100;
    const relativeTop = checkNumber(getNumber(element.top) + relativeY);
    const currentWidth = getNumber(element.width) * parentWidth / 100;
    const currentHeight = getNumber(element.height) * parentHeight / 100;
    const relativeWidth = checkNumber(((currentWidth + data.x) / parentWidth) * 100);
    const relativeHeight = checkNumber(((currentHeight - data.y) / parentHeight) * 100);
    const updatedElement = {
      ...element,
      top: `${relativeTop}%`,
      width: `${relativeWidth}%`,
      height: `${relativeHeight}%`
    };
    setters.setSelectedElement(updatedElement);
  };

  const handleDragStopTopRight = (data) => {
    element.top = getters.selectedElement.top;
    element.width = getters.selectedElement.width;
    element.height = getters.selectedElement.height;
    saveStore(getters.store, getters.token);
    setDragKey(prevKey => prevKey + 1); // <-- Update key to force re-render
  };

  const handleDragBottomLeft = (data) => {
    const parentWidth = data.node.parentElement.offsetWidth;
    const parentHeight = data.node.parentElement.offsetHeight;
    const relativeX = (data.x / parentWidth) * 100;
    const relativeLeft = checkNumber(getNumber(element.left) + relativeX);
    const currentWidth = getNumber(element.width) * parentWidth / 100;
    const currentHeight = getNumber(element.height) * parentHeight / 100;
    const relativeWidth = checkNumber(((currentWidth - data.x) / parentWidth) * 100);
    const relativeHeight = checkNumber(((currentHeight + data.y) / parentHeight) * 100);
    const updatedElement = {
      ...element,
      left: `${relativeLeft}%`,
      width: `${relativeWidth}%`,
      height: `${relativeHeight}%`
    };
    setters.setSelectedElement(updatedElement);
  };

  const handleDragStopBottomLeft = (data) => {
    element.left = getters.selectedElement.left;
    element.width = getters.selectedElement.width;
    element.height = getters.selectedElement.height;
    saveStore(getters.store, getters.token);
    setDragKey(prevKey => prevKey + 1); // <-- Update key to force re-render
  };

  const handleDragBottomRight = (data) => {
    const parentWidth = data.node.parentElement.offsetWidth;
    const parentHeight = data.node.parentElement.offsetHeight;
    const currentWidth = getNumber(element.width) * parentWidth / 100;
    const currentHeight = getNumber(element.height) * parentHeight / 100;
    const relativeWidth = checkNumber(((currentWidth + data.x) / parentWidth) * 100);
    const relativeHeight = checkNumber(((currentHeight + data.y) / parentHeight) * 100);
    const updatedElement = {
      ...element,
      width: `${relativeWidth}%`,
      height: `${relativeHeight}%`
    };
    setters.setSelectedElement(updatedElement);
  };

  const handleDragStopBottomRight = (data) => {
    element.width = getters.selectedElement.width;
    element.height = getters.selectedElement.height;
    saveStore(getters.store, getters.token);
    setDragKey(prevKey => prevKey + 1); // <-- Update key to force re-render
  };

  return (
    <Draggable
      key={dragKey} // <-- Add key prop
      nodeRef={nodeRef}
      disabled={!selected}
      bounds="parent"
      handle=".handle"
      onDrag={(e, data) => handleDrag(data)}
      onStop={(e, data) => handleDragStop(data)}
    >
      <Box
        ref={nodeRef}
        onClick={() => {
          if (!selected) {
            setters.setSelectedElement(element)
          }
        }}
        sx={{
          position: 'absolute',
          left: element.left,
          top: element.top,
          width: element.width,
          height: element.height,
          zIndex: element.zIndex,
          padding: '2.5px',
          boxSizing: 'border-box'
          // border: '1px solid grey',
        }}
      >
        <Box
          className="handle"
          sx={{
            position: 'absolute',
            width: 'calc(100% - 5px)',
            height: 'calc(100% - 5px)',
            padding: '2.5px',
            boxSizing: 'border-box',
            border: '1px solid grey',
            display: 'block',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
        {children}
        </Box>
        {/* Corner handles */}
        {selected && (
          <>
            <Draggable
                onDrag={(e, data) => handleDragTopLeft(data)}
                onStop={(e, data) => handleDragStopTopLeft(data)}
            >
            <Box
              sx={{
                position: 'absolute',
                width: '5px',
                height: '5px',
                top: '0px',
                left: '0px',
                background: 'black',
                border: '1px solid black',
                cursor: 'nwse-resize' // North-West to South-East resizing cursor
              }}
            />
            </Draggable>
            <Draggable
                onDrag={(e, data) => handleDragTopRight(data)}
                onStop={(e, data) => handleDragStopTopRight(data)}
            >
            <Box
              sx={{
                position: 'absolute',
                width: '5px',
                height: '5px',
                top: '0px',
                right: '0px',
                background: 'black',
                border: '1px solid black',
                cursor: 'nesw-resize' // North-East to South-West resizing cursor
              }}
            />
            </Draggable>
            <Draggable
                onDrag={(e, data) => handleDragBottomLeft(data)}
                onStop={(e, data) => handleDragStopBottomLeft(data)}
            >
            <Box
              sx={{
                position: 'absolute',
                width: '5px',
                height: '5px',
                bottom: '0px',
                left: '0px',
                background: 'black',
                border: '1px solid black',
                cursor: 'nesw-resize' // North-East to South-West resizing cursor
              }}
            />
            </Draggable>
            <Draggable
                onDrag={(e, data) => handleDragBottomRight(data)}
                onStop={(e, data) => handleDragStopBottomRight(data)}
            >
            <Box
              sx={{
                position: 'absolute',
                width: '5px',
                height: '5px',
                bottom: '0px',
                right: '0px',
                background: 'black',
                border: '1px solid black',
                cursor: 'nwse-resize' // North-West to South-East resizing cursor
              }}
            />
            </Draggable>
          </>
        )}
      </Box>
    </Draggable>
  )
}
