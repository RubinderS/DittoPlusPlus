import * as PluginTypes from '@type/pluginTypes';
import * as React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core';

interface Props {
  activePlugins: PluginTypes.ActivePlugin[];
  selectedIndex: number;
}

export const Sidebar = (props: Props) => {
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

const useStyles = makeStyles((theme: Theme) => {
  const {palette} = theme;

  return createStyles({
    sideBar: {
      width: '80px',
      backgroundColor: palette.primary.main,
    },
    pluginIcon: {
      height: '50px',
      width: '100%',
      maxWidth: '100%',
      backgroundColor: palette.grey[300],
    },
  });
});
