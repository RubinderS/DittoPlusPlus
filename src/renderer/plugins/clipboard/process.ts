import * as fs from 'fs';
import * as path from 'path';
import {clipboard} from 'electron';
import {DatastoreType} from '@type/dbTypes';
import * as PluginTypes from '@type/pluginTypes';
import {Events, ClipItem, Messages} from './types';

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
              this.emit(Events.NewClip, savedDoc);
            },
          );
        } else {
          this.emit(Events.NewClip, savedDoc);
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

  sendMessage = (
    type: string,
    data: any,
    cb?: (error: any, response: any) => void,
  ) => {
    if (type === Messages.WriteClipText) {
      this.lastClip = data;
      clipboard.writeText(data);
      cb && cb(undefined, true);
    }
  };
}
