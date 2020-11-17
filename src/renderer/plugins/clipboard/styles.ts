import {makeStyles, Theme, createStyles} from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => {
  const {palette} = theme;

  return createStyles({
    container: {
      display: 'flex',
      height: '100%',
      // width: '100%',
      minWidth: '200px',
      flexDirection: 'column',
      // backgroundColor: 'grey',
    },
    clipItem: {
      backgroundColor: palette.primary.main,
      color: 'white',
      height: '60px',
      padding: '5px',
      borderRadius: '4px',
      marginTop: '2px',
      // width: '100%',
      // minWidth: '100px',
      maxWidth: '700px',
    },
    // pluginIcon: {
    //   height: '50px',
    //   width: '100%',
    //   maxWidth: '100%',
    //   backgroundColor: palette.grey[300],
    // },
  });
});
