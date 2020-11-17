import {ClipItem, ClipListener} from './types';
import {PluginProcess, PluginManifest, PluginInitArgs} from '@type/pluginTypes';
import {ClipboardComponent} from './component';
import {ClipboardProcess} from './process';

// export class Clipboard extends PluginBase {
//   name = 'Clipboard';
//   requiresDb = true;
//   db: DatastoreType;
//   lastClip = '';
//   clipItems: ClipItem[];
//   clipListeners: ClipListener[] = [];
//   updateClipItems: React.Dispatch<React.SetStateAction<ClipItem[]>>;

//   constructor() {
//     super();
//   }

//   onInitialize = (args: PluginInitArgs) => {
//     const {db} = args;

//     if (db) {
//       this.db = db;
//     }

//     setInterval(this.watchClipboard, 200);
//   };

//   getComponent = () => {};
// }

export const ClipBoard: PluginManifest = {
  id: 1,
  name: 'Clipboard',
  sideIcon: 'icon',
  requiresDb: true,
  process: ClipboardProcess,
  render: ClipboardComponent,
};
