import {PluginBase} from '@pluginBase';
import * as React from 'react';
import {useStyles} from './styles';

interface Props {
  activePlugins: PluginBase[];
  selectedIndex: number;
}

const ContentArea = (props: Props) => {
  const classes = useStyles();
  const {activePlugins, selectedIndex} = props;

  const getContent = (plugin: PluginBase) => {
    if (!plugin.getComponent) {
      return <div>plugin doesn't have a ui</div>;
    }

    return plugin.getComponent();
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