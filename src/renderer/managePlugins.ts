import {plugins} from '@renderer/plugins/index';
import {PluginBase, DatastoreType} from '@plugins/pluginBase';
import {remote} from 'electron';

let activePlugins: PluginBase[] = [];
let allPlugins: PluginBase[] = [];

export const activatePlugins = () => {
  console.log('called activate');
  allPlugins;

  plugins.map((plugin) => {
    const pObj = new plugin();

    allPlugins.push(pObj);
    activePlugins.push(pObj);

    let db = undefined;

    if (pObj.requiresDb) {
      const Datastore = remote.getGlobal('Datastore');
      db = new Datastore({filename: pObj.name.toLowerCase(), autoload: true});
    }

    if (pObj.onInitialize) {
      pObj.onInitialize({db});
    }
  });

  activePlugins.forEach((plugin) => {
    //
  });

  setInterval(() => {
    // keep listening for main process msgs
  }, 100);
};
