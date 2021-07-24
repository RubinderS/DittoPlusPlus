import * as fs from 'fs';
import * as path from 'path';
import {clipboard, nativeImage} from 'electron';
import * as PluginTypes from '@type/pluginTypes';
import {
  ClipData,
  ClipItemDoc,
  ClipItemDocFile,
  Events,
  Messages,
} from './types';
import * as Datastore from 'nedb';
import {shiftItemToFront} from './component/utils';

export class ClipboardProcess extends PluginTypes.ProcessAbstract {
  db: Datastore<Partial<ClipItemDoc>>;
  lastClipId: string;
  clipItems: ClipItemDoc[];
  imagesDir: string;

  constructor() {
    super();

    const clipData = this.readClipboard();
    if (clipData) {
      this.lastClipId = this.convertClipDataToId(clipData);
    } else {
      this.lastClipId = '';
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

  convertClipDataToId = (clipData: ClipData): string => {
    switch (clipData.type) {
      case 'file':
      case 'text':
        return clipData.data;

      case 'image':
        return clipData.data.getBitmap().toString();
    }
  };

  readClipboardFiles = () => {
    if (process.platform === 'darwin') {
      return clipboard.readBuffer('public.file-url').toString();
    } else if (process.platform === 'win32') {
      return;
      // reading files from clipboard for windows is not supported at the moment
      //
      // const rawFilePath = clipboard.read('FileNameW');
      // return rawFilePath.replace(new RegExp(String.fromCharCode(0), 'g'), '');
    }
  };

  writeClipboardFiles = (clipItem: ClipItemDocFile) => {
    if (process.platform === 'darwin') {
      clipboard.writeBuffer(
        'public.file-url',
        Buffer.from(clipItem.path, 'utf-8'),
      );
    } else if (process.platform === 'win32') {
      // writing files to clipboard for windows is not supported at the moment
      //
      // clipboard.writeBuffer(
      //   'FileNameW',
      //   Buffer.from(clipItem.path.split('').join(String.fromCharCode(0))),
      //   'clipboard',
      // );
    }
  };

  readClipboard = (): ClipData | undefined => {
    const clipText = clipboard.readText();
    const clipImageBuffer = clipboard.readImage();
    const clipFile = this.readClipboardFiles();
    let clipData: ClipData | undefined = undefined;

    if (clipFile) {
      clipData = {
        type: 'file',
        data: clipFile,
      };
    } else if (clipImageBuffer.getBitmap().length !== 0) {
      clipData = {
        type: 'image',
        data: clipImageBuffer,
      };
    } else if (clipText) {
      clipData = {
        type: 'text',
        data: clipText,
      };
    }

    return clipData;
  };

  writeClipboard = (clipItem: ClipItemDoc) => {
    switch (clipItem.type) {
      case 'file':
        this.lastClipId = clipItem.path;
        this.writeClipboardFiles(clipItem);
        break;

      case 'text':
        this.lastClipId = clipItem.text;
        clipboard.writeText(clipItem.text);
        break;

      case 'image':
        const image = nativeImage.createFromPath(
          path.join(this.imagesDir, `${clipItem._id}.png`),
        );

        this.lastClipId = image.getBitmap().toString();
        clipboard.writeImage(image);
        break;
    }
  };

  watchClipboard = async () => {
    const clipData = this.readClipboard();

    if (!clipData) {
      return;
    }

    const clipId = this.convertClipDataToId(clipData);

    if (clipId !== this.lastClipId) {
      this.lastClipId = clipId;
      let savedDoc: ClipItemDoc;

      switch (clipData.type) {
        case 'file':
          savedDoc = await this.insertClipDb({
            type: 'file',
            path: clipData.data,
          });

          break;

        case 'text':
          savedDoc = await this.insertClipDb({
            type: 'text',
            text: clipData.data,
          });

          break;

        case 'image':
          savedDoc = await this.insertClipDb({
            type: 'image',
          });

          await this.saveFile(
            path.join(this.imagesDir, `${savedDoc._id}.png`),
            clipData.data.toPNG(),
          );

          break;
      }

      this.clipItems.unshift(savedDoc);
      this.emit(Events.NewClip, savedDoc);
    }
  };

  initialize = (args: PluginTypes.ProcessInitArgs): void => {
    const {db, pluginSettingsDir} = args;

    if (!db) {
      throw `database instance not provided to clipboard plugin`;
    }

    this.imagesDir = path.resolve(
      path.join(pluginSettingsDir, 'clipboardImages'),
    );

    if (!fs.existsSync(this.imagesDir)) {
      fs.mkdirSync(this.imagesDir);
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
        const clipItem = msgData as ClipItemDoc;
        this.writeClipboard(clipItem);
        this.clipItems = shiftItemToFront(this.clipItems, clipItem);
        cb(undefined, this.clipItems);

        this.db.update(
          {_id: clipItem._id},
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

      case Messages.GetImagesDir:
        cb(undefined, this.imagesDir);
        break;

      default:
        cb('not a valid clipboard message type', undefined);
    }
  };
}
