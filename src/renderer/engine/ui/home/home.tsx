import * as React from 'react';
import {Sidebar} from './Sidebar';
import {ContentArea} from './ContentArea';
import * as PluginTypes from '@type/pluginTypes';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: flex;
  height: '100%';
  flex-direction: column-reverse;
`;

interface Props {
  activePlugins: PluginTypes.ActivePlugin[];
  selectedIndex: number;
}

export const Home = (props: Props) => {
  const {activePlugins, selectedIndex} = props;

  return (
    <StyledContainer>
      <Sidebar activePlugins={activePlugins} selectedIndex={selectedIndex} />
      <ContentArea
        activePlugins={activePlugins}
        selectedIndex={selectedIndex}
      />
    </StyledContainer>
  );
};
