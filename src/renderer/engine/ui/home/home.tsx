import * as React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core';
import {Sidebar} from './Sidebar';
import {ContentArea} from './ContentArea';
import * as PluginTypes from '@type/pluginTypes';

interface Props {
  activePlugins: PluginTypes.ActivePlugin[];
  selectedIndex: number;
}

export const Home = (props: Props) => {
  const {activePlugins, selectedIndex} = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Sidebar activePlugins={activePlugins} selectedIndex={selectedIndex} />
      <ContentArea
        activePlugins={activePlugins}
        selectedIndex={selectedIndex}
      />
    </div>
  );
};

const useStyles = makeStyles((_theme: Theme) => {
  return createStyles({
    container: {
      display: 'flex',
      height: '100%',
    },
  });
});
