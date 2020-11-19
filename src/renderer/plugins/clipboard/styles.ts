import {makeStyles, Theme, createStyles} from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => {
  const {palette} = theme;

  return createStyles({
    container: {
      display: 'flex',
      height: '100%',
      width: '100%',
      minWidth: '200px',
      flexDirection: 'column',
    },
    clipItem: {
      backgroundColor: palette.primary.main,
      color: 'white',
      overflow: 'auto',
      maxHeight: '60px',
      padding: '5px',
      borderRadius: '4px',
      marginTop: '2px',
      width: '100%',
    },
  });
});
