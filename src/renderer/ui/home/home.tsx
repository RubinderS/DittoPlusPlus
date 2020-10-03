import * as React from 'react';
import {useStyles} from './styles';
import {PluginBase} from '@pluginBase';
import Sidebar from './Sidebar';
import ContentArea from './ContentArea';

interface Props {
  activePlugins: PluginBase[];
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
