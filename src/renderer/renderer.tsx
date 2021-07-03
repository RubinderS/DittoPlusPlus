/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {DefaultTheme, ThemeProvider} from 'styled-components';
import {Home} from '@engine/ui';
import {loadPlugins} from '@engine/managePlugins';
import {blueGrey} from 'material-colors-ts';

const theme: DefaultTheme = {
  themeColor: blueGrey,
};

const {activePlugins} = loadPlugins();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Home activePlugins={activePlugins} selectedIndex={0} />
  </ThemeProvider>,
  document.getElementById('app'),
);
