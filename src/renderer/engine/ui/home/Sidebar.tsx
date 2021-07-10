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
  background-color: ${(props) => props.theme.themeColor[400]};
`;

const StyledPluginIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  height: 50px;
  width: 100%;
  color: ${(props) => props.theme.themeColor[100]};
`;

export const Sidebar = (props: Props) => {
  const {activePlugins} = props;

  return (
    <StyledSideBar>
      {activePlugins.map((plugin, index) => {
        const SideIcon = (plugin.sideIcon || <></>) as React.FC<any>;

        return (
          <StyledPluginIcon
            key={`${index}_sidebar_${plugin.name.toLowerCase()}`}
          >
            <SideIcon />
          </StyledPluginIcon>
        );
      })}
    </StyledSideBar>
  );
};
