import 'styled-components';
import {blueGrey} from 'material-colors-ts';

interface IPalette {
  main: string;
  contrastText: string;
}
declare module 'styled-components' {
  export interface DefaultTheme {
    themeColor: typeof blueGrey;
  }
}
