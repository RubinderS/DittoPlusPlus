import {Theme, createStyles, makeStyles} from '@material-ui/core';
import {blueGrey} from '@material-ui/core/colors';
import {CSSProperties} from '@material-ui/core/styles/withStyles';
import * as React from 'React';
import {ClipItem} from '../types';
import {dimensions} from './utils';

export type ClipItemVariants = 'light' | 'dark' | 'selected';

interface Props {
  key: string | number | null | undefined;
  clipItem: ClipItem;
  variant: ClipItemVariants;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const useStyles = makeStyles((_theme: Theme) => {
  const {
    clipItem: {height, paddingTop, paddingBottom, paddingLeft, paddingRight},
  } = dimensions;

  const clipItemStyles: CSSProperties = {
    color: 'black',
    overflow: 'hidden',
    maxHeight: `${height}px`,
    minHeight: `${height}px`,
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    lineHeight: '20px',
    maxWidth: '100%',
    '&:focus': {
      outline: '0px solid transparent',
    },
  };

  return createStyles({
    clipItemLight: {
      ...clipItemStyles,
      backgroundColor: blueGrey[50],
    },
    clipItemDark: {
      ...clipItemStyles,
      backgroundColor: blueGrey[100],
    },
    clipItemSelected: {
      ...clipItemStyles,
      backgroundColor: blueGrey[300],
    },
  });
});

export const ClipItemRow = (props: Props) => {
  const {key, clipItem, variant, onClick} = props;
  const classes = useStyles();

  const getBackgroundColor = (variant: ClipItemVariants) => {
    switch (variant) {
      case 'light':
        return classes.clipItemLight;

      case 'dark':
        return classes.clipItemDark;

      case 'selected':
        return classes.clipItemSelected;
    }
  };

  return (
    <div key={key} className={getBackgroundColor(variant)} onClick={onClick}>
      {clipItem.data}
    </div>
  );
};
