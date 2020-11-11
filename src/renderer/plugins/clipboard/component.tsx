import {Box} from '@material-ui/core';
import React, {useEffect, useState} from 'React';
import {useStyles} from './styles';
import {ClipItem} from './types';

export const ClipboardComponent = () => {
  const classes = useStyles();
  const [clipItems, updateClipItems] = useState<ClipItem[]>([]);

  const saveFile = (fileName: string, data: Buffer) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) {
        throw err;
      }
    });
  };

  const watchClipboard = () => {
    const currClipText = clipboard.readText();
    const currClipImageBuffer = clipboard.readImage().toPNG();
    const currClipImageString = currClipImageBuffer.toString();
    const isImage = currClipImageBuffer.length !== 0;

    if (
      (currClipText && currClipText !== this.lastClip) ||
      (currClipImageString && currClipImageString !== this.lastClip)
    ) {
      this.lastClip = isImage ? currClipImageString : currClipText;

      const doc: ClipItem = {
        type: isImage ? 'image' : 'text',
        data: isImage ? undefined : currClipText,
      };

      this.db.insert(doc, (err: any, doc: ClipItem) => {
        if (err) {
          throw err;
        }

        if (isImage) {
          this.saveFile(
            path.join('db', 'clipboardImages', `${doc._id}.png`),
            currClipImageBuffer,
          );
        }

        this.clipItems = [doc, ...this.clipItems];
        this.updateClipItems && this.updateClipItems(this.clipItems);
      });
    }
  };

  const onClickClipItem = (e: ClipItem) => {
    const id = this.clipItems.findIndex(
      (clipItem, index) => clipItem._id === e._id,
    );

    this.clipItems = [
      ...this.clipItems.slice(0, id),
      ...this.clipItems.slice(id + 1),
    ];

    this.updateClipItems(this.clipItems);
    clipboard.writeText(e.data!);
  };
  const getClipItems = async (): Promise<ClipItem[]> => {
    if (this.clipItems) {
      return this.clipItems;
    }

    return new Promise((resolve, reject) => {
      this.db.find({}, (err: any, items: ClipItem[]) => {
        if (err) {
          reject(err);
        }

        this.clipItems = items;
        resolve(this.clipItems);
      });
    });
  };

  useEffect(() => {
    if (!this.updateClipItems) {
      this.updateClipItems = updateClipItems;
    }

    this.getClipItems()
      .then((items) => {
        updateClipItems(items.reverse());
      })
      .catch((error) => {
        updateClipItems([
          {data: 'error fetching clipboard data', type: 'text'},
        ]);
      });
  }, []);

  return (
    <Box className={classes.container}>
      {clipItems.map((item, index) => (
        <Box
          key={`${index}_clipItem`}
          className={classes.clipItem}
          onClick={() => this.onClickClipItem(item)}
        >
          {item.data}
        </Box>
      ))}
    </Box>
  );
};
