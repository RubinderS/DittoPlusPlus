import {PluginBase} from '@pluginBase';
import * as React from 'react';
import {useStyles} from './styles';

interface Props {
  activePlugins: PluginBase[];
  selectedIndex: number;
}

const Sidebar = (props: Props) => {
  const classes = useStyles();
  const {activePlugins, selectedIndex} = props;

  return (
    <div className={classes.sideBar}>
      {activePlugins.map((plugin, index) => (
        <div
          key={`${index}_sidebar_${plugin.name.toLowerCase()}`}
          className={classes.pluginIcon}
        >
          {plugin.name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;