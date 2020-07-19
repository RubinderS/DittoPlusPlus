import {plugins} from '@renderer/plugins/index';
import {PluginBase, DatastoreType, InitializeArgs} from '@plugins/pluginBase';
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

    if (pObj.onInitialize) {
      const initArgs: InitializeArgs = {};

      if (pObj.requiresDb) {
        const Datastore = remote.getGlobal('Datastore');
        initArgs.db = new Datastore({filename: pObj.name.toLowerCase(), autoload: true});
      }

      pObj.onInitialize(initArgs);
    }
  });

  activePlugins.forEach((plugin) => {
    //
  });

  setInterval(() => {
    // keep listening for main process msgs
  }, 100);
};
