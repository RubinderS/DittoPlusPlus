import * as React from 'react';
import styled from 'styled-components';
import {escapeRegExp} from './utils';

interface Props {
  text: string;
  searchText: string;
}

const StyledHighlightedSpan = styled.span`
  background-color: rgba(0, 0, 0, 0.1);
`;

export const TextItem = (props: Props) => {
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
      {textChunks.map(({chunk, isHighlighted}) => {
        if (isHighlighted) {
          return <StyledHighlightedSpan>{chunk}</StyledHighlightedSpan>;
        } else {
          return <span>{chunk}</span>;
        }
      })}
    </p>
  );
};
