import * as PluginTypes from '@type/pluginTypes';
import * as React from 'react';
import styled from 'styled-components';

interface Props {
  activePlugins: PluginTypes.ActivePlugin[];
  selectedIndex: number;
}

const StyledSideBar = styled.div`
  min-width: 40px;
  width: 40px;
  -webkit-app-region: drag;
  background-color: ${(props) => props.theme.themeColor[400]};
`;

const StyledPluginIcon = styled.div<{selected: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  height: 50px;
  width: 100%;
  color: ${(props) =>
    props.selected ? props.theme.themeColor[50] : props.theme.themeColor[200]};
`;

export const Sidebar = (props: Props) => {
  const {activePlugins, selectedIndex} = props;

  return (
    <StyledSideBar>
      {activePlugins.map((plugin, index) => {
        const SideIcon = (plugin.sideIcon || <></>) as React.FC<any>;

        return (
          <StyledPluginIcon
            key={`sidebar_${plugin.name.toLowerCase()}`}
            selected={selectedIndex === index}
          >
            <SideIcon />
          </StyledPluginIcon>
        );
      })}
    </StyledSideBar>
  );
};
