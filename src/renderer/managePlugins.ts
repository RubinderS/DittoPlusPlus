import {plugins} from '@renderer/plugins/index';
import {PluginBase, InitializeArgs} from '@plugins/pluginBase';
import {remote} from 'electron';
import * as path from 'path';

let activePlugins: PluginBase[] = [];
let allPlugins: PluginBase[] = [];

export const activatePlugins = () => {
  plugins.map((plugin) => {
    const pObj = new plugin();

    /* perform initalization logic */
    if (pObj.onInitialize) {
      const initArgs: InitializeArgs = {};

      if (pObj.requiresDb) {
        const Datastore = remote.getGlobal('Datastore');
        initArgs.db = new Datastore({
          filename: path.join('db', `${pObj.name.toLowerCase()}.db`),
          autoload: true,
        });
      }

      pObj.onInitialize(initArgs);
    }

    /* maintain plugins lists */
    allPlugins.push(pObj);
    activePlugins.push(pObj);
  });

  activePlugins.forEach((plugin) => {
    //
  });

  setInterval(() => {
    // keep listening for main process msgs
  }, 100);
};
