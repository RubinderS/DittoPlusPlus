import * as React from 'react';
import {Sidebar} from './Sidebar';
import {ContentArea} from './ContentArea';
import * as PluginTypes from '@type/pluginTypes';
import styled from 'styled-components';

interface Props {
  activePlugins: PluginTypes.ActivePlugin[];
  selectedIndex: number;
}

const HeaderHeightPx = 25;

const StyledContainer = styled.div`
  height: 100%;
`;

const StyledBody = styled.div`
  display: flex;
  height: calc(100% - ${HeaderHeightPx}px);
`;

const StyledHeader = styled.div`
  padding-top: 3px;
  padding-left: 5px;
  width: calc(100% - 5px);
  height: calc(${HeaderHeightPx}px - 3px);
  -webkit-app-region: drag;
  color: ${(props) => props.theme.themeColor[100]};
  background-color: ${(props) => props.theme.themeColor[400]};
`;

export const Home = (props: Props) => {
  const {activePlugins, selectedIndex} = props;

  return (
    <StyledContainer>
      <StyledHeader>{activePlugins[selectedIndex].name}</StyledHeader>
      <StyledBody>
        <Sidebar activePlugins={activePlugins} selectedIndex={selectedIndex} />
        <ContentArea
          activePlugins={activePlugins}
          selectedIndex={selectedIndex}
        />
      </StyledBody>
    </StyledContainer>
  );
};
