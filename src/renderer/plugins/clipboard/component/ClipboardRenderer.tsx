import {Box} from '@material-ui/core';
import * as React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core';
import {blueGrey} from '@material-ui/core/colors';
import {ClipItem, Events, Messages} from '../types';
import * as PluginTypes from '@type/pluginTypes';
import {useEffect, useState} from 'react';
import useEventListener from '@use-it/event-listener';
import {clamp} from 'lodash';
import {CSSProperties} from '@material-ui/core/styles/withStyles';

export const ClipboardRenderer = (props: PluginTypes.RenderProps) => {
  const classes = useStyles();
  const [clipItems, updateClipItems] = useState<ClipItem[]>([]);
  const [selectedIndex, updateSelectedIndex] = useState(0);
  const {process} = props;

  const reArrangeClipItems = (selectedClipItem: ClipItem) => {
    const index = clipItems.findIndex(
      (clipItem) => clipItem._id === selectedClipItem._id,
    );

    const slicedClipItems = [
      ...clipItems.slice(0, index),
      ...clipItems.slice(index + 1),
    ];

    updateClipItems([selectedClipItem, ...slicedClipItems]);
  };

  const sendClipboardItemSelected = (clipItem: ClipItem) => {
    if (clipItem.type === 'text') {
      process.sendMessage(Messages.ClipItemSelected, clipItem, (err, res) => {
        if (err) {
          throw err;
        }

        if (res) {
          // console.log(res);
        }
      });
    }
  };

  const onKeyPress = (event: KeyboardEvent) => {
    const {key} = event;

    switch (key) {
      case 'ArrowUp':
        updateSelectedIndex((prevSelectedIndex) =>
          clamp(prevSelectedIndex - 1, 0, clipItems.length - 1),
        );
        break;

      case 'ArrowDown':
        updateSelectedIndex((prevSelectedIndex) =>
          clamp(prevSelectedIndex + 1, 0, clipItems.length - 1),
        );
        break;

      case 'Enter':
        reArrangeClipItems(clipItems[selectedIndex]);
        sendClipboardItemSelected(clipItems[selectedIndex]);
        updateSelectedIndex(0);
        break;
    }
  };

  useEventListener('keydown', onKeyPress);

  useEffect(() => {
    process.sendMessage(Messages.GetAllClipItems, '', (err, res) => {
      if (!err) {
        updateClipItems([...res]);
      }
    });

    process.on(Events.NewClip, (doc: ClipItem) => {
      updateClipItems((prevClipItems) => [doc, ...prevClipItems]);
    });

    process.on(Events.ClipsInitialized, (clips: ClipItem[]) => {
      updateClipItems(clips);
    });
  }, []);

  const onClickClipItem = (e: ClipItem) => {
    reArrangeClipItems(e);
    sendClipboardItemSelected(e);
  };

  const getBackgroundColor = (index: number, selectedIndex: number) => {
    if (index === selectedIndex) {
      return classes.clipItemSelected;
    } else if (index % 2) {
      return classes.clipItemEvenRow;
    } else {
      return classes.clipItemOddRow;
    }
  };

  return (
    <Box className={classes.container}>
      {clipItems.map((item, index) => (
        <Box
          key={`${index}_clipItem`}
          className={getBackgroundColor(index, selectedIndex)}
          onClick={() => onClickClipItem(item)}
        >
          {item.data}
        </Box>
      ))}
    </Box>
  );
};

const useStyles = makeStyles((_theme: Theme) => {
  const clipItemStyles: CSSProperties = {
    color: 'black',
    overflow: 'auto',
    minHeight: '40px',
    lineHeight: '20px',
    padding: '5px',
    width: '100%',
  };

  return createStyles({
    container: {
      display: 'flex',
      height: '100%',
      width: '100%',
      minWidth: '200px',
      flexDirection: 'column',
    },
    clipItemEvenRow: {
      ...clipItemStyles,
      backgroundColor: blueGrey[50],
    },
    clipItemOddRow: {
      ...clipItemStyles,
      backgroundColor: blueGrey[100],
    },
    clipItemSelected: {
      ...clipItemStyles,
      backgroundColor: blueGrey[300],
    },
  });
});