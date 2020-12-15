import * as fs from 'fs';
import * as path from 'path';
import {clipboard, nativeImage} from 'electron';
import * as PluginTypes from '@type/pluginTypes';
import {ClipData, ClipItemDoc, Events, Messages} from './types';
import * as Datastore from 'nedb';
import {imagesDir} from './component/utils';

export class ClipboardProcess extends PluginTypes.ProcessAbstract {
  db: Datastore<Partial<ClipItemDoc>>;
  lastClip: string;
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

    const clipData = this.readClipboard();
    this.lastClip = this.clipDataToString(clipData);
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

  clipDataToString = (clipData: ClipData): string => {
    switch (clipData.type) {
      case 'text':
        return clipData.data;

      case 'image':
        return clipData.data.getBitmap().toString();
    }
  };

  readClipboard = (): ClipData => {
    const clipText = clipboard.readText();
    const clipImageBuffer = clipboard.readImage();
    let clipData: ClipData;

    if (clipImageBuffer.getBitmap().length !== 0) {
      clipData = {
        type: 'image',
        data: clipImageBuffer,
      };
    } else {
      clipData = {
        type: 'text',
        data: clipText,
      };
    }

    return clipData;
  };

  writeClipboard = (clipItem: ClipItemDoc) => {
    switch (clipItem.type) {
      case 'text':
        this.lastClip = clipItem.text;
        clipboard.writeText(clipItem.text);
        break;

      case 'image':
        const image = nativeImage.createFromPath(
          path.join(imagesDir, `${clipItem._id}.png`),
        );

        this.lastClip = image.getBitmap().toString();
        clipboard.writeImage(image);
        break;
    }
  };

  watchClipboard = async () => {
    const clipData = this.readClipboard();
    const clipString = this.clipDataToString(clipData);

    if (clipString !== this.lastClip) {
      this.lastClip = clipString;

      switch (clipData.type) {
        case 'text':
          const savedDocText = await this.insertClipDb({
            type: 'text',
            text: clipData.data,
          });

          this.clipItems.push(savedDocText);
          this.emit(Events.NewClip, savedDocText);
          break;

        case 'image':
          const savedDocImage = await this.insertClipDb({
            type: 'image',
          });

          await this.saveFile(
            path.join(imagesDir, `${savedDocImage._id}.png`),
            clipData.data.toPNG(),
          );

          this.clipItems.push(savedDocImage);
          this.emit(Events.NewClip, savedDocImage);
          break;
      }
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
        const {_id} = msgData as ClipItemDoc;
        const clipItem = msgData as ClipItemDoc;
        this.writeClipboard(clipItem);
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
        let result: ClipItemDoc[];

        if (query === '') {
          result = this.clipItems;
        } else {
          result = this.clipItems.filter((item) => {
            return (
              item.type === 'text' &&
              item.text.toLowerCase().includes(query.toLowerCase())
            );
          });
        }

        cb(undefined, result);
        break;

      default:
        cb('not a valid clipboard message type', undefined);
    }
  };
}
