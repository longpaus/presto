import { v4 as uuid } from 'uuid';
import { elDimensionValidation } from './utils';

const code1 = `const App = props => {
    return (
      <div>
        <h1> Prism JS </h1>
        <div>Awesome Syntax Highlighter</div>
      </div>
    );
  };
  `;
const code2 = 'List<String> things = new ArrayList<>();';

export const sampleSlide = () => {
  return {
    id: uuid(),
    backgroundColor: '#f0f0f0',
    backgroundGradient: 'top-down',
    elements: [
      {
        id: uuid(),
        type: 'TEXT',
        left: '10%',
        top: '10%',
        width: '30%',
        height: '30%',
        zIndex: undefined,
        text: 'Text Box Sample 1',
        fontFamily: 'Verdana',
        fontSize: '1.2em',
        color: '#3cb371',
        codeLanguage: '',
        url: '',
        altTag: '',
        autoPlay: false
      },
      {
        id: uuid(),
        type: 'TEXT',
        left: '20%',
        top: '25%',
        width: '60%',
        height: undefined,
        zIndex: undefined,
        text: 'Text Box Sample 2',
        fontFamily: 'Tahoma',
        fontSize: '0.8em',
        color: '#ff0000',
        codeLanguage: '',
        url: '',
        altTag: '',
        autoPlay: false
      },
      {
        id: uuid(),
        type: 'CODE',
        left: '10%',
        top: '40%',
        width: undefined,
        height: '30%',
        zIndex: 1,
        text: code1,
        fontFamily: '',
        fontSize: '1em',
        color: '',
        codeLanguage: 'JavaScript',
        url: '',
        altTag: '',
        autoPlay: false
      },
      {
        id: uuid(),
        type: 'CODE',
        left: '10%',
        top: '60%',
        width: '80%',
        height: undefined,
        zIndex: 1,
        text: code2,
        fontFamily: '',
        fontSize: '2em',
        color: '',
        codeLanguage: '',
        url: '',
        altTag: '',
        autoPlay: false
      }
    ]
  }
}

export const ELEMENT_TYPE = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  CODE: 'CODE',
  VIDEO: 'VIDEO'
};

export const newSlide = (deck) => {
  return {
    id: uuid(),
    backgroundColor: deck ? deck.backgroundColor : '',
    backgroundGradient: 'top-down',
    elements: []
  }
}

export const newDeck = () => {
  return {
    id: uuid(),
    title: '',
    backgroundColor: '#f0f0f0',
    description: '',
    slides: []
  }
}

export const newElement = (formData) => {
  return {
    id: uuid(),
    type: undefined,
    left: '1%',
    top: '1%',
    width: formData.width ? `${formData.width}%` : '30%', // default to '50%' if formData.width doesn't exist
    height: formData.height ? `${formData.height}%` : '30%', // default to '50%' if formData.height doesn't exist
    zIndex: 1,
    text: formData.text ? formData.text : '',
    fontFamily: 'Verdana',
    fontSize: formData.fontSize ? `${formData.fontSize}em` : '1em', // default to '1em' if formData.fontSize doesn't exist
    color: formData.color ? formData.color : '#000000', // default to '#000000' (black) if formData.color doesn't exist
    codeLanguage: formData.codeLanguage ? formData.codeLanguage : '',
    url: formData.url ? formData.url : '',
    autoPlay: formData.autoPlay ? formData.autoPlay : false // default to false if formData.autoPlay doesn't exist
  }
};

export const getProperties = (element) => {
  const properties = [{
    id: 'left',
    label: 'Left',
    type: 'text',
    validation: width => elDimensionValidation(width),
    value: element.left
  }, {
    id: 'top',
    label: 'Top',
    type: 'text',
    validation: width => elDimensionValidation(width),
    value: element.top
  }, {
    id: 'width',
    label: 'Width',
    type: 'text',
    validation: width => elDimensionValidation(width),
    value: element.width
  },
  {
    id: 'height',
    label: 'Height',
    type: 'text',
    validation: height => elDimensionValidation(height),
    value: element.height
  }]

  const textProperties = [{
    id: 'text',
    label: 'TEXT',
    type: 'text',
    required: true,
    value: element.text
  },
  {
    id: 'fontSize',
    label: 'Font Size',
    type: 'text',
    value: element.fontSize
  },
  {
    id: 'color',
    label: 'Color',
    type: 'text',
    value: element.color
  },
  {
    id: 'fontFamily',
    label: 'Font Family',
    type: 'text',
    value: element.fontFamily
  }]

  const imageProperties = [{
    id: 'text',
    label: 'altTag',
    type: 'text',
    required: true,
    value: element.text
  },
  {
    id: 'url',
    label: 'Image url',
    type: 'text',
    value: element.url
  }]

  const codeProperties = [{
    id: 'text',
    label: 'Code',
    type: 'text',
    multiline: true,
    rows: 5,
    required: true,
    value: element.text
  },
  {
    id: 'fontSize',
    label: 'Font Size',
    type: 'text',
    value: element.fontSize
  }]

  const videoProperties = [{
    id: 'url',
    label: 'Video url',
    type: 'text',
    value: element.url
  },
  {
    id: 'autoPlay',
    label: 'Auto Play',
    type: 'boolean',
    value: element.autoPlay
  }]

  switch (element.type) {
    case ELEMENT_TYPE.TEXT:
      return [...properties, ...textProperties];
    case ELEMENT_TYPE.IMAGE:
      return [...properties, ...imageProperties];
    case ELEMENT_TYPE.CODE:
      return [...properties, ...codeProperties];
    case ELEMENT_TYPE.VIDEO:
      return [...properties, ...videoProperties];
    default:
      return []
  }
};
