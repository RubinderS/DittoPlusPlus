import * as React from 'react';
import {clipboard, remote} from 'electron';

let lastClipText = clipboard.readText();

const Datastore = remote.getGlobal('Datastore') as typeof global.Datastore;

const db = new Datastore({filename: 'clipdb3.db', autoload: true});

export const main = () => {
  setInterval(() => {
    const currClipText = clipboard.readText();

    if (currClipText !== lastClipText) {
      lastClipText = currClipText;
      console.log(currClipText);
      db.insert({data: currClipText}, (err: any, doc: any) => {
        if (err) {
          console.log('error', JSON.stringify(err));

          return;
        }

        console.log(JSON.stringify(doc));
      });
    }
  }, 200);
};
