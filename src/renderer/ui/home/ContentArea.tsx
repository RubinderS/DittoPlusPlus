import * as PluginTypes from '@type/pluginTypes';
import * as React from 'react';
import {useStyles} from './styles';

interface Props {
  activePlugins: PluginTypes.ActivePlugin[];
  selectedIndex: number;
}

const ContentArea = (props: Props) => {
  const classes = useStyles();
  const {activePlugins, selectedIndex} = props;

  const getContent = (plugin: PluginTypes.ActivePlugin) => {
    const {process, render} = plugin;

    if (!render) {
      return <div>plugin doesn't have a ui</div>;
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

export default ContentArea;
