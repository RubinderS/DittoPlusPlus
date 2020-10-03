import * as React from 'react';
import {clipboard} from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import {PluginBase} from '@pluginBase';
import {DatastoreType, PluginInitArgs} from '@types';
import {Box, TextField} from '@material-ui/core';
import {useStyles} from './styles';
import {useState} from 'react';

interface DocType {
  _id?: string;
  data?: string;
  type: 'text' | 'image';
}

export class Clipboard extends PluginBase {
  name = 'Clipboard';
  requiresDb = true;
  db: DatastoreType;
  lastClip = '';
  clipItems: DocType[];

  constructor() {
    super();
  }

  saveFile = (fileName: string, data: Buffer) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) {
        throw err;
      }
    });
  };

  watchClipboard = () => {
    const currClipText = clipboard.readText();
    const currClipImageBuffer = clipboard.readImage().toPNG();
    const currClipImageString = currClipImageBuffer.toString();
    const isImage = currClipImageBuffer.length !== 0;

    if (
      (currClipText && currClipText !== this.lastClip) ||
      (currClipImageString && currClipImageString !== this.lastClip)
    ) {
      this.lastClip = isImage ? currClipImageString : currClipText;

      const doc: DocType = {
        type: isImage ? 'image' : 'text',
        data: isImage ? undefined : currClipText,
      };

      this.db.insert(doc, (err: any, doc: DocType) => {
        if (err) {
          throw err;
        }

        if (isImage) {
          this.saveFile(
            path.join('db', 'clipboardImages', `${doc._id}.png`),
            currClipImageBuffer,
          );
        }
      });
    }
  };

  onInitialize = (args: PluginInitArgs) => {
    const {db} = args;

    if (db) {
      this.db = db;
    }

    setInterval(this.watchClipboard, 200);
  };

  getClipItems = async (): Promise<DocType[]> => {
    if (this.clipItems) {
      return this.clipItems;
    }

    return new Promise((resolve, reject) => {
      this.db.find({}, (err: any, items: DocType[]) => {
        if (err) {
          reject(err);
        }

        this.clipItems = items;
        resolve(this.clipItems);
      });
    });
  };

  render = () => {
    const classes = useStyles();
    const [clipItems, updateClipItems] = useState<DocType[]>([]);

    this.getClipItems()
      .then((items) => {
        updateClipItems(items);
      })
      .catch((error) => {
        updateClipItems([
          {data: 'error fetching clipboard data', type: 'text'},
        ]);
      });

    return (
      <Box className={classes.container}>
        {clipItems.map((item, index) => (
          <Box key={`${index}_clipItem`} className={classes.clipItem}>
            {item.data}
          </Box>
        ))}
      </Box>
    );
  };
}
