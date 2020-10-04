import * as React from 'react';
import {clipboard} from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import {PluginBase} from '@pluginBase';
import {DatastoreType, PluginInitArgs} from '@types';
import {Box, TextField} from '@material-ui/core';
import {useStyles} from './styles';
import {useState} from 'react';
import {useEffect} from 'react';

interface ClipItem {
  _id?: string;
  data?: string;
  type: 'text' | 'image';
}

type ClipListener = (clipItem: ClipItem) => void;

export class Clipboard extends PluginBase {
  name = 'Clipboard';
  requiresDb = true;
  db: DatastoreType;
  lastClip = '';
  clipItems: ClipItem[];
  clipListeners: ClipListener[] = [];
  updateClipItems: React.Dispatch<React.SetStateAction<ClipItem[]>>;

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

  onInitialize = (args: PluginInitArgs) => {
    const {db} = args;

    if (db) {
      this.db = db;
    }

    setInterval(this.watchClipboard, 200);
  };

  getClipItems = async (): Promise<ClipItem[]> => {
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

  onClickClipItem = (e: ClipItem) => {
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

  render = () => {
    const classes = useStyles();
    const [clipItems, updateClipItems] = useState<ClipItem[]>([]);

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
}
