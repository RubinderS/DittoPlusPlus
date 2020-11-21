import * as fs from 'fs';
import * as path from 'path';
import {clipboard} from 'electron';
import * as PluginTypes from '@type/pluginTypes';
import {Events, ClipItem, Messages} from './types';
import * as Datastore from 'nedb';

export class ClipboardProcess extends PluginTypes.ProcessAbstract {
  db: Datastore<ClipItem>;
  lastClip = clipboard.readText(); // write a func to read clipboard
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
        timeStamp: Date.now(),
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
              this.clipItems.push(savedDoc);
              this.emit(Events.NewClip, savedDoc);
            },
          );
        } else {
          this.clipItems.push(savedDoc);
          this.emit(Events.NewClip, savedDoc);
        }
      });
    }
  };

  initialize = (args: PluginTypes.ProcessInitArgs) => {
    const {db} = args;

    if (!db) {
      throw `database instance not provided to clipboard plugin`;
    }

    this.db = db;
    this.db
      .find({})
      .sort({timeStamp: -1})
      .exec((err: Error | null, docs: ClipItem[]) => {
        this.clipItems = docs;
        this.emit(Events.ClipsInitialized, this.clipItems);
      });

    setInterval(this.watchClipboard, 200);
  };

  sendMessage = (
    type: string,
    msgData: any,
    cb: (error: any, response: any) => void = () => {},
  ) => {
    switch (type) {
      case Messages.WriteClipText:
        const {_id, data, type} = msgData as ClipItem;
        if (data) {
          this.lastClip = data;
          clipboard.writeText(data);
          cb(undefined, true);
          this.db.update(
            {_id},
            {$set: {timeStamp: Date.now()}},
            {},
            (err: Error | null, n: number) => {
              if (err) {
                throw err;
              }
            },
          );
        }
        break;

      case Messages.GetAllClipItems:
        if (this.clipItems) {
          cb(undefined, this.clipItems);
        } else {
          cb('clip items are not ready yet', undefined);
        }
        break;

      default:
        cb('not a valid message type', undefined);
    }
  };
}
