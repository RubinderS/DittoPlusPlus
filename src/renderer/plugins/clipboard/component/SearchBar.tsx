import {blueGrey} from 'material-colors-ts';
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
  background-color: ${blueGrey[400]};
  height: ${searchBarDimensions.height}px;
  padding-top: ${searchBarDimensions.paddingTop}px;
  padding-bottom: ${searchBarDimensions.paddingBottom}px;
  padding-left: ${searchBarDimensions.paddingLeft}px;
  padding-right: ${searchBarDimensions.paddingRight}px;
  z-index: 2;
`;

const StyledSearchBar = styled.input`
  border: 0px;
  padding-top: ${searchBarDimensions.paddingTop}px;
  padding-bottom: ${searchBarDimensions.paddingBottom}px;
  padding-left: ${searchBarDimensions.paddingLeft}px;
  padding-right: ${searchBarDimensions.paddingRight}px;
  height: calc(
    100% -
      ${searchBarDimensions.paddingTop * 2 +
      searchBarDimensions.paddingBottom * 2}px
  );
  width: calc(
    100% -
      ${searchBarDimensions.paddingRight * 2 +
      searchBarDimensions.paddingLeft * 2}px
  );
  margin-top: ${searchBarDimensions.paddingTop}px;
  margin-bottom: ${searchBarDimensions.paddingBottom}px;
  margin-left: ${searchBarDimensions.paddingLeft}px;
  margin-right: ${searchBarDimensions.paddingRight}px;
  border-radius: 5px;
  background-color: ${blueGrey[300]};
  &:focus {
    background-color: ${blueGrey[200]};
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
