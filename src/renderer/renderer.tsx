/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Import the styles here to process them with webpack
import '@public/style.css';
import {activatePlugins} from './managePlugins';
import {Home} from '@ui/home';

activatePlugins();

ReactDOM.render(<Home />, document.getElementById('app'));
