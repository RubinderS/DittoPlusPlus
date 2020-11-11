import * as React from 'react';
import {clipboard} from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import {PluginBase} from '@pluginBase';
import {DatastoreType, PluginInitArgs} from '@types';
import {ClipItem, ClipListener} from './types';

export class Clipboard extends PluginBase {
  name = 'Clipboard';
  requiresDb = true;
  db: DatastoreType;
  lastClip = '';
  clipItems: ClipItem[];
  clipListeners: ClipListener[] = [];
  updateClipItems: React.Dispatch<React.SetStateAction<ClipItem[]>>;

  constructor() {
    super();
  }

  onInitialize = (args: PluginInitArgs) => {
    const {db} = args;

    if (db) {
      this.db = db;
    }

    setInterval(this.watchClipboard, 200);
  };

  getComponent = () => {};
}
