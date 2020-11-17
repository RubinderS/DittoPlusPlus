import * as fs from 'fs';
import * as path from 'path';
import {clipboard} from 'electron';
import {DatastoreType} from '@type/dbTypes';
import * as PluginTypes from '@type/pluginTypes';
import {ClipEvents, ClipItem} from './types';

export class ClipboardProcess extends PluginTypes.ProcessAbstract {
  db: DatastoreType;
  lastClip = '';
  clipItems: ClipItem[];

  constructor() {
    super();
  }

  saveFile = (fileName: string, data: Buffer, onFileSaved?: () => void) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) {
        throw err;
      }

      onFileSaved && onFileSaved();
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

      this.db.insert(doc, (err: any, savedDoc: ClipItem) => {
        if (err) {
          throw err;
        }

        if (isImage) {
          this.saveFile(
            path.join('db', 'clipboardImages', `${savedDoc._id}.png`),
            currClipImageBuffer,
            () => {
              this.emit(ClipEvents.NewClip, savedDoc);
            },
          );
        } else {
          this.emit(ClipEvents.NewClip, savedDoc);
        }
      });
    }
  };

  initialize = (args: PluginTypes.ProcessInitArgs) => {
    const {db} = args;

    if (db) {
      this.db = db;
    }

    setInterval(this.watchClipboard, 200);
  };

  sendMessage = (message: string, cb: (response: string) => void) => {
    console.log(message);
  };
}
