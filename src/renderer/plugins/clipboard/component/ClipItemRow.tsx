import * as React from 'React';
import {ClipItemDoc} from '../types';
import {dimensions, imagesDir} from './utils';
import * as path from 'path';
import {blueGrey} from 'material-colors-ts';
import styled from 'styled-components';

interface Props {
  clipItem: ClipItemDoc;
  variant: ClipItemVariants;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export type ClipItemVariants = 'light' | 'dark' | 'selected';
const {clipItemDimensions} = dimensions;

const getBackgroundColor = (variant: ClipItemVariants) => {
  switch (variant) {
    case 'light':
      return blueGrey[50];

    case 'dark':
      return blueGrey[100];

    case 'selected':
      return blueGrey[300];
  }
};

const StyledClipItem = styled.div<Pick<Props, 'variant'>>`
  color: 'black';
  overflow: 'hidden';
  max-height: ${clipItemDimensions.height}px;
  min-height: ${clipItemDimensions.height}px;
  padding-top: ${clipItemDimensions.paddingTop}px;
  padding-bottom: ${clipItemDimensions.paddingBottom}px;
  padding-left: ${clipItemDimensions.paddingLeft}px;
  padding-right: ${clipItemDimensions.paddingRight}px;
  line-height: 20px;
  max-width: 100%;
  background-color: ${(props) => getBackgroundColor(props.variant)};
  &:focus {
    outline: '0px solid transparent';
  }
`;

const StyledImage = styled.img`
  height: ${clipItemDimensions.height}px;
`;

export const ClipItemRow = (props: Props) => {
  const {clipItem, onClick} = props;

  const renderClipItem = (clipItem: ClipItemDoc): React.ReactNode => {
    switch (clipItem.type) {
      case 'text':
        return clipItem.text;

      case 'image':
        return (
          <StyledImage src={path.join(imagesDir, `${clipItem._id}.png`)} />
        );

      default:
        return null;
    }
  };

  return (
    <StyledClipItem onClick={onClick} variant={props.variant}>
      {renderClipItem(clipItem)}
    </StyledClipItem>
  );
};
