# h5p-simple-multi-choice

[![Build Status](https://travis-ci.org/h5p/h5p-simple-multiple-choice.svg?branch=master)](https://travis-ci.org/h5p/h5p-simple-multiple-choice)

A H5P library for creating simple multiple choices.
Used as part of other content types.

## Getting started

Grab all the modules:
```javascript
npm install
```

Build project:
```javascript
npm run build
```

Run tests:
```javscript
npm test
```

Set up development server with test data:
```javascript
npm run dev
```

## TODO: Implement input form for alternatives and xAPI statements

Semantic:
```javascript
  {
    "name": "inputAlternative",
    "type": "boolean",
    "widget": "conditional",
    "label": "Enable input alternative",
    "fields": [
      {
        "name": "altText",
        "type": "text",
        "label": "Alternative text"
      },
      {
        "name": "placeholderText",
        "type": "text",
        "label": "Placeholder text"
      }
    ]
  }
```

Use editor dependency:
```javascript
  "editorDependencies": [
    {
      "machineName": "H5PEditor.Conditional",
      "majorVersion": 1,
      "minorVersion": 0
    }
  ]
```
