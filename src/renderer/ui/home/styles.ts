import {makeStyles, Theme, createStyles} from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => {
  const {palette} = theme;

  return createStyles({
    container: {
      display: 'flex',
      height: '100%',
    },
    sideBar: {
      width: '80px',
      backgroundColor: palette.primary.main,
    },
    contentArea: {
      margin: '5px',
      width: '100%',
    },
    contentRendered: {
      overflowY: 'scroll',
      overflowX: 'hidden',
      height: '100%',
    },
    pluginIcon: {
      height: '50px',
      width: '100%',
      maxWidth: '100%',
      backgroundColor: palette.grey[300],
    },
  });
});
