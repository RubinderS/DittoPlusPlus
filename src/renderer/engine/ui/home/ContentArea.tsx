import * as PluginTypes from '@type/pluginTypes';
import * as React from 'react';
import styled from 'styled-components';

const StyledContentArea = styled.div`
  width: 100%;
`;

const StyledContentRendered = styled.div`
  height: 100%;
`;

interface Props {
  activePlugins: PluginTypes.ActivePlugin[];
  selectedIndex: number;
}

export const ContentArea = (props: Props) => {
  const {activePlugins, selectedIndex} = props;

  const getContent = (plugin: PluginTypes.ActivePlugin) => {
    const {pluginProcess, render} = plugin;

    if (!render) {
      return <div>plugin doesn&apos;t have a ui</div>;
    }

    return render({
      pluginProcess: pluginProcess || new PluginTypes.ProcessAbstract(),
    });
  };

  return (
    <StyledContentArea>
      {activePlugins
        .filter((_plugin, index) => index === selectedIndex)
        .map((plugin, index) => {
          return (
            <StyledContentRendered
              key={`${index}_content_selected_${plugin.name.toLowerCase()}`}
            >
              {getContent(plugin)}
            </StyledContentRendered>
          );
        })}
    </StyledContentArea>
  );
};
