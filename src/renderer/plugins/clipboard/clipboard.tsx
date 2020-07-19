import * as React from 'react';
import {clipboard, remote} from 'electron';
import {PluginBase, InitializeArgs, DatastoreType} from '@plugins/pluginBase';

let lastClipText = clipboard.readText();

export class Clipboard extends PluginBase {
  name = 'Clipboard';
  readonly requiresDb = true;
  db: DatastoreType;

  constructor() {
    super();
  }

  watchClipboard = () => {
    const currClipText = clipboard.readText();

    if (currClipText !== lastClipText) {
      lastClipText = currClipText;
      console.log(currClipText);
      this.db.insert({data: currClipText}, (err: any, _doc: any) => {
        if (err) {
          throw err;
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
