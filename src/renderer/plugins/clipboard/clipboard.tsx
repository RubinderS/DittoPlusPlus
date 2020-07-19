import * as React from 'react';
import {clipboard, remote} from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import {PluginBase, InitializeArgs, DatastoreType} from '@plugins/pluginBase';
import {DocType} from './types';

export class Clipboard extends PluginBase {
  name = 'Clipboard';
  readonly requiresDb = true;
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

  onInitialize(args: InitializeArgs) {
    const {db} = args;

    if (db) {
      this.db = db;
    }

    setInterval(this.watchClipboard, 200);
  }
}
