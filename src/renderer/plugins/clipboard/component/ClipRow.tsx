import {Theme, createStyles, makeStyles} from '@material-ui/core';
import {blueGrey} from '@material-ui/core/colors';
import {CSSProperties} from '@material-ui/core/styles/withStyles';
import * as React from 'React';
import {ClipDoc} from '../types';
import {dimensions, imagesDir} from './utils';
import * as path from 'path';

export type ClipRowVariants = 'light' | 'dark' | 'selected';

interface Props {
  clipDoc: ClipDoc;
  variant: ClipRowVariants;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const useStyles = makeStyles((_theme: Theme) => {
  const {
    clipRow: {height, paddingTop, paddingBottom, paddingLeft, paddingRight},
  } = dimensions;

  const clipRowStyles: CSSProperties = {
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
    clipRowLight: {
      ...clipRowStyles,
      backgroundColor: blueGrey[50],
    },
    clipRowDark: {
      ...clipRowStyles,
      backgroundColor: blueGrey[100],
    },
    clipRowSelected: {
      ...clipRowStyles,
      backgroundColor: blueGrey[300],
    },
    image: {
      height: `${height}px`,
    },
  });
});

export const ClipRow = (props: Props) => {
  const {clipDoc, variant, onClick} = props;
  const classes = useStyles();

  const getVariantClass = (variant: ClipRowVariants) => {
    switch (variant) {
      case 'light':
        return classes.clipRowLight;

      case 'dark':
        return classes.clipRowDark;

      case 'selected':
        return classes.clipRowSelected;
    }
  };

  const renderClipRow = (clipDoc: ClipDoc): React.ReactNode => {
    switch (clipDoc.type) {
      case 'text':
        return clipDoc.text;

      case 'file':
        return clipDoc.path;

      case 'image':
        return (
          <img
            className={classes.image}
            src={path.join(imagesDir, `${clipDoc._id}.png`)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={getVariantClass(variant)} onClick={onClick}>
      {renderClipRow(clipDoc)}
    </div>
  );
};
