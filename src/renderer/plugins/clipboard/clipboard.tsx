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
    console.log('plugin constructed');
  }

  onInitialize(args: InitializeArgs) {
    const {db} = args;

    if (db) {
      this.db = db;
    }

    console.log('initialized');

    setInterval(() => {
      const currClipText = clipboard.readText();

      if (currClipText !== lastClipText) {
        lastClipText = currClipText;
        console.log(currClipText);
        this.db.insert({data: currClipText}, (err: any, doc: any) => {
          if (err) {
            console.log('error', JSON.stringify(err));

            return;
          }

          console.log(JSON.stringify(doc));
        });
      }
    }, 200);
  }
}
