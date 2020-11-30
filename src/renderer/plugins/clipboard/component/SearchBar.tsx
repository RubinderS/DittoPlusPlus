import {TextField, withStyles} from '@material-ui/core';
import {blueGrey} from '@material-ui/core/colors';

export const SearchBar = withStyles({
  root: {
    '& .MuiInput-underline:after': {
      border: 'none',
      borderTop: `2px solid ${blueGrey[400]}`,
      borderRadius: '0px',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none',
        borderTop: `2px solid ${blueGrey[400]}`,
        borderRadius: '0px',
      },
      '&:hover fieldset': {
        border: 'none',
        borderTop: `2px solid ${blueGrey[400]}`,
        borderRadius: '0px',
      },
      '&.Mui-focused fieldset': {
        border: 'none',
        borderTop: `2px solid ${blueGrey[400]}`,
        borderRadius: '0px',
      },
    },
  },
})(TextField);
