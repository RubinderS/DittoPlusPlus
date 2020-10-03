/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Import the styles here to process them with webpack
import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import '../../public/style.css';
import {loadPlugins} from './managePlugins';
import {Home} from '@ui';

const activePlugins = loadPlugins();

const theme = createMuiTheme({
  palette: {
    // primary: {
    // main: '#898989',
    // },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Home activePlugins={activePlugins} selectedIndex={0} />
  </ThemeProvider>,

  document.getElementById('app'),
);
