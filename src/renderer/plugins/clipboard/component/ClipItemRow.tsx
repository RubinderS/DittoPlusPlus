import {Theme, createStyles, makeStyles} from '@material-ui/core';
import {blueGrey} from '@material-ui/core/colors';
import {CSSProperties} from '@material-ui/core/styles/withStyles';
import * as React from 'React';
import {ClipItemDoc} from '../types';
import {dimensions, imagesDir} from './utils';
import * as path from 'path';

export type ClipItemVariants = 'light' | 'dark' | 'selected';

interface Props {
  key: string | number | null | undefined;
  clipItem: ClipItemDoc;
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
    image: {
      height: `${height}px`,
    },
  });
});

export const ClipItemRow = (props: Props) => {
  const {key, clipItem, variant, onClick} = props;
  const classes = useStyles();

  const getVariantClass = (variant: ClipItemVariants) => {
    switch (variant) {
      case 'light':
        return classes.clipItemLight;

      case 'dark':
        return classes.clipItemDark;

      case 'selected':
        return classes.clipItemSelected;
    }
  };

  const renderClipItem = (clipItem: ClipItemDoc): React.ReactNode => {
    const {data, type, _id} = clipItem;

    switch (type) {
      case 'text':
        return data;

      case 'image':
        return (
          <img
            className={classes.image}
            src={path.join(imagesDir, `${_id}.png`)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div key={key} className={getVariantClass(variant)} onClick={onClick}>
      {renderClipItem(clipItem)}
    </div>
  );
};
