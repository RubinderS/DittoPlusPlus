import {makeStyles, Theme, createStyles} from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => {
  const {palette} = theme;

  return createStyles({
    container: {
      display: 'flex',
      height: '100%',
      width: '100%',
    },
    sideBar: {
      flex: '10%',
      backgroundColor: palette.primary.main,
    },
    content: {
      flex: '90%',
      margin: '5px',
    },
    pluginIcon: {
      height: '50px',
      width: '100%',
      maxWidth: '100%',
      backgroundColor: palette.grey[300],
    },
  });
});
