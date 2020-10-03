import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import * as React from 'react';

export const Home = (props: any) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.sideBar}></div>
      <div className={classes.content}></div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => {
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
    },
  });
});
