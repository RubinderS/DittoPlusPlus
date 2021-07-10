import * as React from 'React';
import {dimensions} from './utils';
import styled from 'styled-components';

interface Props {
  id: string;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
}

const {searchBarDimensions} = dimensions;

const StyledContainer = styled.div`
  background-color: ${(props) => props.theme.themeColor[400]};
  height: ${searchBarDimensions.heightPx}px;
  padding-top: ${searchBarDimensions.paddingTopPx}px;
  padding-bottom: ${searchBarDimensions.paddingBottomPx}px;
  padding-left: ${searchBarDimensions.paddingLeftPx}px;
  padding-right: ${searchBarDimensions.paddingRightPx}px;
  z-index: 2;
`;

const StyledSearchBar = styled.input`
  border: 0px;
  padding-top: ${searchBarDimensions.paddingTopPx}px;
  padding-bottom: ${searchBarDimensions.paddingBottomPx}px;
  padding-left: ${searchBarDimensions.paddingLeftPx}px;
  padding-right: ${searchBarDimensions.paddingRightPx}px;
  height: calc(
    100% -
      ${searchBarDimensions.paddingTopPx * 2 +
      searchBarDimensions.paddingBottomPx * 2}px
  );
  width: calc(
    100% -
      ${searchBarDimensions.paddingRightPx * 2 +
      searchBarDimensions.paddingLeftPx * 2}px
  );
  margin-top: ${searchBarDimensions.paddingTopPx}px;
  margin-bottom: ${searchBarDimensions.paddingBottomPx}px;
  margin-left: ${searchBarDimensions.paddingLeftPx}px;
  margin-right: ${searchBarDimensions.paddingRightPx}px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.themeColor[300]};
  &:focus {
    background-color: ${(props) => props.theme.themeColor[200]};
    outline: none;
  }
`;

const SearchBarComponent = (
  props: Props,
  ref: React.RefObject<HTMLInputElement>,
) => {
  return (
    <StyledContainer>
      <StyledSearchBar {...props} ref={ref} />
    </StyledContainer>
  );
};

SearchBarComponent.displayName = 'SearchBar';
export const SearchBar = React.forwardRef(SearchBarComponent);
