import * as PluginTypes from '@type/pluginTypes';
import * as React from 'react';
import {useStyles} from './styles';

interface Props {
  activePlugins: PluginTypes.ActivePlugin[];
  selectedIndex: number;
}

const Sidebar = (props: Props) => {
  const classes = useStyles();
  const {activePlugins} = props;

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
