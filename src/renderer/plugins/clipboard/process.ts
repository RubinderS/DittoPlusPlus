import * as fs from 'fs';
import * as path from 'path';
import {clipboard} from 'electron';
import * as PluginTypes from '@type/pluginTypes';
import {ClipItemDoc, Events, Messages, ReadClipboardData} from './types';
import * as Datastore from 'nedb';
import {imagesDir} from './component/utils';

export class ClipboardProcess extends PluginTypes.ProcessAbstract {
  db: Datastore<Partial<ClipItemDoc>>;
  lastClip = clipboard.readText(); // write a func to read clipboard
  clipItems: ClipItemDoc[];

  constructor() {
    super();

    if (!fs.existsSync(imagesDir)) {
      fs.mkdir(imagesDir, (err) => {
        if (err) {
          throw err;
        }
      });
    }
  }

  saveFile = async (fileName: string, data: Buffer): Promise<void> => {
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, data, (err) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  };

  insertClipDb = async (doc: Partial<ClipItemDoc>): Promise<ClipItemDoc> => {
    return new Promise((resolve, reject) => {
      doc.timeStamp = Date.now();

      this.db.insert(doc, (err: any, savedDoc: ClipItemDoc) => {
        if (err) {
          reject(err);
        }

        resolve(savedDoc);
      });
    });
  };

  readClipboard = (): ReadClipboardData => {
    const clipText = clipboard.readText();
    const clipImageBuffer = clipboard.readImage().toPNG();

    const clipData: ReadClipboardData = {
      type: clipImageBuffer.length !== 0 ? 'image' : 'text',
    };

    switch (clipData.type) {
      case 'text':
        clipData.text = clipText;
        break;

      case 'image':
        clipData.imageBuffer = clipImageBuffer;
        clipData.imageString = clipImageBuffer.toString();
        break;
    }

    return clipData;
  };

  watchClipboard = async () => {
    const clipData = this.readClipboard();

    switch (clipData.type) {
      case 'text':
        if (clipData.text !== this.lastClip) {
          this.lastClip = clipData.text as string;

          const savedDoc = await this.insertClipDb({
            type: 'text',
            data: clipData.text,
          });

          this.clipItems.push(savedDoc);
          this.emit(Events.NewClip, savedDoc);
        }
        break;

      case 'image':
        if (clipData.imageString !== this.lastClip) {
          this.lastClip = clipData.imageString as string;

          const savedDoc = await this.insertClipDb({
            type: 'image',
          });

          await this.saveFile(
            path.join(imagesDir, `${savedDoc._id}.png`),
            clipData.imageBuffer as Buffer,
          );

          this.clipItems.push(savedDoc);
          this.emit(Events.NewClip, savedDoc);
        }
        break;
    }
  };

  initialize = (args: PluginTypes.ProcessInitArgs): void => {
    const {db} = args;

    if (!db) {
      throw `database instance not provided to clipboard plugin`;
    }

    this.db = db;
    this.db
      .find({})
      .sort({timeStamp: -1})
      .exec((err: Error | null, docs: ClipItemDoc[]) => {
        this.clipItems = docs;
        this.emit(Events.ClipsInitialized, this.clipItems);
      });

    setInterval(this.watchClipboard, 200);
  };

  sendMessage = (
    type: string,
    msgData: any,
    cb: (error: any, response: any) => void = () => {
      //
    },
  ) => {
    switch (type) {
      case Messages.ClipItemSelected:
        const {_id, data} = msgData as ClipItemDoc;
        if (data) {
          this.lastClip = data;
          clipboard.writeText(data);
          cb(undefined, true);
          this.db.update(
            {_id},
            {$set: {timeStamp: Date.now()}},
            {},
            (err: Error | null, _n: number) => {
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

      case Messages.SearchClips:
        const query = msgData as string;
        const result = this.clipItems.filter((item) => {
          return (
            item.type === 'text' &&
            item.data &&
            item.data.toLowerCase().includes(query.toLowerCase())
          );
        });
        cb(undefined, result);
        break;

      default:
        cb('not a valid clipboard message type', undefined);
    }
  };
}
