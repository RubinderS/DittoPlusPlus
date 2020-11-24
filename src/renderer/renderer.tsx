/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Import the styles here to process them with webpack
import {ThemeProvider, createMuiTheme} from '@material-ui/core';
import {Home} from '@engine/ui';
import {loadPlugins} from '@engine/managePlugins';
const {activePlugins} = loadPlugins();

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
