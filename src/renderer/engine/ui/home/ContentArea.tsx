import * as PluginTypes from '@type/pluginTypes';
import * as React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core';

interface Props {
  activePlugins: PluginTypes.ActivePlugin[];
  selectedIndex: number;
}

export const ContentArea = (props: Props) => {
  const classes = useStyles();
  const {activePlugins, selectedIndex} = props;

  const getContent = (plugin: PluginTypes.ActivePlugin) => {
    const {process, render} = plugin;

    if (!render) {
      return <div>plugin doesn&apos;t have a ui</div>;
    }

    return render({process: process || new PluginTypes.ProcessAbstract()});
  };

  return (
    <div className={classes.contentArea}>
      {activePlugins
        .filter((_plugin, index) => index === selectedIndex)
        .map((plugin, index) => {
          return (
            <div
              key={`${index}_content_selected_${plugin.name.toLowerCase()}`}
              className={classes.contentRendered}
            >
              {getContent(plugin)}
            </div>
          );
        })}
    </div>
  );
};

const useStyles = makeStyles((_theme: Theme) => {
  return createStyles({
    contentArea: {
      margin: '5px',
      width: '100%',
    },
    contentRendered: {
      overflowY: 'scroll',
      overflowX: 'hidden',
      height: '100%',
    },
  });
});
