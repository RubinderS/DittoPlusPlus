/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Import the styles here to process them with webpack
import '@public/style.css';
import {activatePlugins} from './managePlugins';
import {Home} from '@ui/home';
import {createMuiTheme, ThemeProvider} from '@material-ui/core';

activatePlugins();

const theme = createMuiTheme({
  palette: {
    // primary: {
    // main: '#898989',
    // },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Home />
  </ThemeProvider>,

  document.getElementById('app'),
);
