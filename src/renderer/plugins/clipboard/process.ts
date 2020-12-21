import * as fs from 'fs';
import * as path from 'path';
import {clipboard, nativeImage} from 'electron';
import * as PluginTypes from '@type/pluginTypes';
import {ClipData, ClipDoc, Events, Messages} from './types';
import * as Datastore from 'nedb';
import {imagesDir, shiftItemToFront} from './component/utils';

export class ClipboardProcess extends PluginTypes.ProcessAbstract {
  db: Datastore<Partial<ClipDoc>>;
  lastClipString: string;
  clipDocs: ClipDoc[];

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
    this.lastClipString = this.clipDataToString(clipData);
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

  insertClipDb = async (doc: Partial<ClipDoc>): Promise<ClipDoc> => {
    return new Promise((resolve, reject) => {
      doc.timeStamp = Date.now();

      this.db.insert(doc, (err: any, savedDoc: ClipDoc) => {
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
      case 'file':
        return clipData.data;

      case 'image':
        return clipData.data.getBitmap().toString();
    }
  };

  clipDataToClipDoc = (clipData: ClipData): Partial<ClipDoc> => {
    switch (clipData.type) {
      case 'text':
        return {
          type: 'text',
          text: clipData.data,
        };

      case 'file':
        return {
          type: 'file',
          path: clipData.data,
        };

      case 'image':
        return {
          type: 'image',
        };
    }
  };

  readClipboardFiles = () => {
    if (process.platform === 'darwin') {
      return clipboard.readBuffer('public.file-url').toString();
    }
  };

  writeClipboardFiles = (clipDoc: ClipDoc) => {
    if (clipDoc.type === 'file') {
      if (process.platform === 'darwin') {
        return clipboard.writeBuffer(
          'public.file-url',
          Buffer.from(clipDoc.path, 'utf-8'),
        );
      }
    }
  };

  readClipboard = (): ClipData => {
    const clipText = clipboard.readText();
    const clipImageBuffer = clipboard.readImage();
    const clipFile = this.readClipboardFiles();
    let clipData: ClipData;

    if (clipImageBuffer.getBitmap().length !== 0) {
      clipData = {
        type: 'image',
        data: clipImageBuffer,
      };
    } else if (clipFile) {
      clipData = {
        type: 'file',
        data: clipFile,
      };
    } else {
      clipData = {
        type: 'text',
        data: clipText,
      };
    }

    return clipData;
  };

  writeClipboard = (clipDoc: ClipDoc) => {
    switch (clipDoc.type) {
      case 'text':
        this.lastClipString = clipDoc.text;
        clipboard.writeText(clipDoc.text);
        break;

      case 'file':
        this.lastClipString = clipDoc.path;
        this.writeClipboardFiles(clipDoc);
        break;

      case 'image':
        const image = nativeImage.createFromPath(
          path.join(imagesDir, `${clipDoc._id}.png`),
        );

        this.lastClipString = image.getBitmap().toString();
        clipboard.writeImage(image);
        break;
    }
  };

  watchClipboard = async () => {
    const clipData = this.readClipboard();
    const clipString = this.clipDataToString(clipData);

    if (clipString !== this.lastClipString) {
      this.lastClipString = clipString;
      const clipDoc = this.clipDataToClipDoc(clipData);
      const savedDoc = await this.insertClipDb(clipDoc);

      if (clipData.type === 'image') {
        await this.saveFile(
          path.join(imagesDir, `${savedDoc._id}.png`),
          clipData.data.toPNG(),
        );
      }

      this.clipDocs.unshift(savedDoc);
      this.emit(Events.NewClip, savedDoc);
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
      .exec((err: Error | null, docs: ClipDoc[]) => {
        this.clipDocs = docs;
        this.emit(Events.ClipsInitialized, this.clipDocs);
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
      case Messages.ClipDocSelected:
        const clipDoc = msgData as ClipDoc;
        this.writeClipboard(clipDoc);
        cb(undefined, true);
        this.clipDocs = shiftItemToFront(this.clipDocs, clipDoc);
        this.db.update(
          {_id: clipDoc._id},
          {$set: {timeStamp: Date.now()}},
          {},
          (err: Error | null, _n: number) => {
            if (err) {
              throw err;
            }
          },
        );
        break;

      case Messages.GetAllClipDocs:
        if (this.clipDocs) {
          cb(undefined, this.clipDocs);
        } else {
          cb('clip docs are not ready yet', undefined);
        }
        break;

      case Messages.SearchClips:
        const query = msgData as string;
        let result: ClipDoc[];

        if (query === '') {
          result = this.clipDocs;
        } else {
          result = this.clipDocs.filter((item) => {
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
