import * as React from 'react';
import {clipboard} from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import {PluginBase} from '@pluginBase';
import {DatastoreType, PluginInitArgs} from '@types';

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

  constructor() {
    super();
  }

  saveFile(fileName: string, data: Buffer) {
    fs.writeFile(fileName, data, (err) => {
      if (err) {
        throw err;
      }
    });
  }

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

  onInitialize(args: PluginInitArgs) {
    const {db} = args;

    if (db) {
      this.db = db;
    }

    setInterval(this.watchClipboard, 200);
  }

  render() {
    return <div>yo</div>;
  }
}
