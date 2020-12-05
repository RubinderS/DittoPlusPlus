import {
  TextField,
  Theme,
  createStyles,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import {blueGrey} from '@material-ui/core/colors';
import {CSSProperties} from '@material-ui/core/styles/withStyles';
import * as React from 'React';

interface Props {
  id: string;
  className?: string;
  placeholder?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
}

const CustomTextField = withStyles((_theme: Theme) => {
  const fieldSetStyles: CSSProperties = {
    border: '0px',
    height: '30px',
    borderRadius: '5px',
  };

  return {
    root: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          ...fieldSetStyles,
          backgroundColor: blueGrey[300],
        },
        '&:hover fieldset': {
          ...fieldSetStyles,
          backgroundColor: blueGrey[300],
        },
        '&.Mui-focused fieldset': {
          ...fieldSetStyles,
          backgroundColor: blueGrey[200],
        },
        '& input': {
          padding: '0px',
          paddingTop: '3px',
          paddingLeft: '5px',
          color: blueGrey[700],
          zIndex: 2,
        },
      },
    },
  };
})(TextField);

const SearchBarComponent = (
  props: Props,
  ref: React.RefObject<HTMLDivElement>,
) => {
  const classes = useStyles();

  return (
    <div className={classes.searchBarContainer}>
      <CustomTextField
        {...props}
        variant="outlined"
        className={classes.searchBar}
        inputRef={ref}
      />
    </div>
  );
};

SearchBarComponent.displayName = 'SearchBar';
export const SearchBar = React.forwardRef(SearchBarComponent);

const useStyles = makeStyles((_theme: Theme) => {
  return createStyles({
    searchBarContainer: {
      backgroundColor: blueGrey[400],
      height: '30px',
      padding: '5px',
      paddingBottom: '0px',
    },
    searchBar: {
      width: '100%',
      height: '30px',
    },
  });
});
