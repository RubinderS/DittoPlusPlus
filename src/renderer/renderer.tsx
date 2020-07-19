/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Import the styles here to process them with webpack
import '@public/style.css';
import {main} from './plugins/clipboard';

ReactDOM.render(
  <div className="app">
    <h4>Welcome to React, Electron and Typescript 5</h4>
    <p>Hello</p>
  </div>,
  document.getElementById('app'),
);

main();
