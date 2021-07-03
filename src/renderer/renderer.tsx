/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Import the styles here to process them with webpack
import {Home} from '@engine/ui';
import {loadPlugins} from '@engine/managePlugins';
const {activePlugins} = loadPlugins();

ReactDOM.render(
  <Home activePlugins={activePlugins} selectedIndex={0} />,
  document.getElementById('app'),
);
