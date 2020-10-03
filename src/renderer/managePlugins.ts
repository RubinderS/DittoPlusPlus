import {plugins} from '@plugins';
import {PluginBase} from '@pluginBase';
import {PluginInitArgs} from '@types';
import * as path from 'path';
import {remote} from 'electron';

let activePlugins: PluginBase[] = [];
let allPlugins: PluginBase[] = [];

export const loadPlugins = (): PluginBase[] => {
  plugins.map((plugin) => {
    const pluginObj = new plugin();

    /* perform initalization logic */
    if (pluginObj.onInitialize) {
      const initArgs: PluginInitArgs = {};

      if (pluginObj.requiresDb) {
        const Datastore = remote.getGlobal('Datastore');

        initArgs.db = new Datastore({
          filename: path.join('db', `${pluginObj.name.toLowerCase()}.db`),
          autoload: true,
        });
      }

      pluginObj.onInitialize(initArgs);
    }

    /* maintain plugins lists */
    allPlugins.push(pluginObj);
    activePlugins.push(pluginObj);
  });

  activePlugins.forEach((plugin) => {
    //
  });

  setInterval(() => {
    // keep listening for main process msgs
  }, 100);

  return activePlugins;
};
