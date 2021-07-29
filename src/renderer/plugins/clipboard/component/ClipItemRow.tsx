import * as React from 'React';
import {ClipItemDoc} from '../types';
import {dimensions} from './utils';
import * as path from 'path';
import styled, {DefaultTheme} from 'styled-components';
import {escapeRegExp} from 'lodash';
import ReactHtmlParser from 'react-html-parser';

interface Props {
  clipItem: ClipItemDoc;
  variant: ClipItemVariants;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  imagesDir: string;
  searchText: string;
}

export type ClipItemVariants = 'light' | 'dark' | 'selected';
const {clipItemDimensions} = dimensions;

const getBackgroundColor = (variant: ClipItemVariants, theme: DefaultTheme) => {
  switch (variant) {
    case 'light':
      return theme.themeColor[50];

    case 'dark':
      return theme.themeColor[100];

    case 'selected':
      return theme.themeColor[300];
  }
};

const StyledClipItem = styled.div<Pick<Props, 'variant'>>`
  color: black;
  overflow: hidden;
  max-height: ${clipItemDimensions.heightPx}px;
  min-height: ${clipItemDimensions.heightPx}px;
  padding-top: ${clipItemDimensions.paddingTopPx}px;
  padding-bottom: ${clipItemDimensions.paddingBottomPx}px;
  padding-left: ${clipItemDimensions.paddingLeftPx}px;
  padding-right: ${clipItemDimensions.paddingRightPx}px;
  line-height: 20px;
  max-width: 100%;
  background-color: ${(props) =>
    getBackgroundColor(props.variant, props.theme)};
  &:focus {
    outline: '0px solid transparent';
  }
  &:hover {
    background-color: ${(props) => props.theme.themeColor[200]};
  }
`;

const StyledImage = styled.img`
  height: ${clipItemDimensions.heightPx}px;
`;

const StyledHighlightedSpan = styled.span`
  background-color: rgba(0, 0, 0, 0.1);
`;

const TextItem = (props: {text: string; searchText: string}) => {
  const {text, searchText} = props;

  if (!searchText) {
    return <p>{text}</p>;
  }

  const regex = new RegExp(escapeRegExp(searchText), 'gim');
  const textChunks: {chunk: string; isHighlighted: boolean}[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text))) {
    if (match) {
      const startIndex = match.index;
      const endIndex = match.index + match[0].length;

      textChunks.push({
        chunk: text.slice(lastIndex, startIndex),
        isHighlighted: false,
      });

      textChunks.push({
        chunk: text.slice(startIndex, endIndex),
        isHighlighted: true,
      });

      lastIndex = endIndex;
    }
  }

  textChunks.push({
    chunk: text.slice(lastIndex),
    isHighlighted: false,
  });

  return (
    <p>
      {textChunks.map((textChunk) => {
        const {chunk, isHighlighted} = textChunk;

        if (isHighlighted) {
          return <StyledHighlightedSpan>{chunk}</StyledHighlightedSpan>;
        } else {
          return <span>{chunk}</span>;
        }
      })}
    </p>
  );
};

export const ClipItem = (props: Props) => {
  const {clipItem, onClick, imagesDir, searchText} = props;

  const renderClipItem = (clipItem: ClipItemDoc): React.ReactNode => {
    switch (clipItem.type) {
      case 'text':
        return <TextItem searchText={searchText} text={clipItem.text} />;

      case 'image':
        return (
          <StyledImage
            src={'file://' + path.join(imagesDir, `${clipItem._id}.png`)}
          />
        );

      case 'file':
        return clipItem.path;

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
