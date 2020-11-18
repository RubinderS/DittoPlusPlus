import {Box} from '@material-ui/core';
import * as React from 'react';
import {useStyles} from './styles';
import {ClipItem, Events, Messages} from './types';
import * as PluginTypes from '@type/pluginTypes';
import {useState} from 'react';

export const ClipboardComponent = (props: PluginTypes.RenderProps) => {
  const classes = useStyles();
  const [clipItems, updateClipItems] = useState<ClipItem[]>([]);
  const {process} = props;

  process.on(Events.NewClip, (doc: ClipItem) => {
    updateClipItems([doc, ...clipItems]);
  });

  const onClickClipItem = (e: ClipItem) => {
    const id = clipItems.findIndex((clipItem, index) => clipItem._id === e._id);
    const _clipItems = [...clipItems.slice(0, id), ...clipItems.slice(id + 1)];
    updateClipItems([e, ..._clipItems]);

    if (e.type === 'text') {
      process.sendMessage(Messages.WriteClipText, e.data, (err, res) => {
        if (err) {
          throw err;
        }

        if (res) {
          console.log(res);
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
          onClick={() => onClickClipItem(item)}
        >
          {item.data}
        </Box>
      ))}
    </Box>
  );

  return <Box className={classes.container}></Box>;
};
