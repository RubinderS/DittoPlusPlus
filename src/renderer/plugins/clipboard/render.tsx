import {Box} from '@material-ui/core';
import * as React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core';
import {ClipItem, Events, Messages} from './types';
import * as PluginTypes from '@type/pluginTypes';
import {useEffect, useState} from 'react';

export const ClipboardComponent = (props: PluginTypes.RenderProps) => {
  const classes = useStyles();
  const [clipItems, updateClipItems] = useState<ClipItem[]>([]);
  const {process} = props;

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
    const index = clipItems.findIndex((clipItem) => clipItem._id === e._id);
    const slicedClipItems = [
      ...clipItems.slice(0, index),
      ...clipItems.slice(index + 1),
    ];
    updateClipItems([e, ...slicedClipItems]);

    if (e.type === 'text') {
      process.sendMessage(Messages.WriteClipText, e, (err, res) => {
        if (err) {
          throw err;
        }

        if (res) {
          // console.log(res);
        }
      });
    }
  };

  return (
    <Box className={classes.container}>
      {clipItems.map((item, index) => (
        <Box
          key={`${index}_clipItem`}
          className={classes.clipItem}
          style={{backgroundColor: index % 2 ? '#F3F3F3' : '#CCCCCC'}}
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
