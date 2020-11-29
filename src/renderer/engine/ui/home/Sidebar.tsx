import * as PluginTypes from '@type/pluginTypes';
import * as React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core';
import {blueGrey} from '@material-ui/core/colors';

interface Props {
  activePlugins: PluginTypes.ActivePlugin[];
  selectedIndex: number;
}

export const Sidebar = (props: Props) => {
  const classes = useStyles();
  const {activePlugins} = props;

  return (
    <div className={classes.sideBar}>
      {activePlugins.map((plugin, index) => {
        const SideIcon = (plugin.sideIcon || <></>) as React.ReactType;

        return (
          <div
            key={`${index}_sidebar_${plugin.name.toLowerCase()}`}
            className={classes.pluginIcon}
          >
            <SideIcon className={classes.sideBarIcon} />
          </div>
        );
      })}
    </div>
  );
};

const useStyles = makeStyles((_theme: Theme) => {
  return createStyles({
    sideBar: {
      minWidth: '40px',
      width: '40px',
      backgroundColor: blueGrey[400],
    },
    sideBarIcon: {
      color: 'white',
    },
    pluginIcon: {
      height: '50px',
      width: '100%',
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
});
