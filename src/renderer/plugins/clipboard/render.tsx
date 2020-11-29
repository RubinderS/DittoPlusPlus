import {Box} from '@material-ui/core';
import * as React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import {ClipItem, Events, Messages} from './types';
import * as PluginTypes from '@type/pluginTypes';
import {useEffect, useState} from 'react';
import useEventListener from '@use-it/event-listener';
import * as _ from 'lodash';

export const ClipboardComponent = (props: PluginTypes.RenderProps) => {
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
      process.sendMessage(Messages.WriteClipText, clipItem, (err, res) => {
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
          _.clamp(prevSelectedIndex - 1, 0, clipItems.length - 1),
        );
        break;

      case 'ArrowDown':
        updateSelectedIndex((prevSelectedIndex) =>
          _.clamp(prevSelectedIndex + 1, 0, clipItems.length - 1),
        );
        break;

      case 'Enter':
        //
        break;
    }
  };

  useEventListener('keydown', onKeyPress);

  useEffect(() => {
    process.sendMessage(Messages.GetAllClipItems, '', (err, res) => {
      if (!err) {
        updateClipItems(res);
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
      return grey[400];
    } else if (index % 2) {
      return grey[50];
    } else {
      return grey[200];
    }
  };

  return (
    <Box className={classes.container}>
      {clipItems.map((item, index) => (
        <Box
          key={`${index}_clipItem`}
          className={classes.clipItem}
          style={{backgroundColor: getBackgroundColor(index, selectedIndex)}}
          onClick={() => onClickClipItem(item)}
        >
          {item.data}
        </Box>
      ))}
    </Box>
  );
};

const useStyles = makeStyles((_theme: Theme) => {
  return createStyles({
    container: {
      display: 'flex',
      height: '100%',
      width: '100%',
      minWidth: '200px',
      flexDirection: 'column',
    },
    clipItem: {
      color: 'black',
      overflow: 'auto',
      minHeight: '20px',
      maxHeight: '60px',
      padding: '5px',
      width: '100%',
    },
  });
});
