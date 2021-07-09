import {pluginManifests} from '@plugins';
import * as path from 'path';
import * as fs from 'fs';
import {remote} from 'electron';
import * as PluginTypes from '@type/pluginTypes';

const activePlugins: PluginTypes.ActivePlugin[] = [];
const allPlugins: PluginTypes.Manifest[] = [];

export const loadPlugins = () => {
  const dbPath = process.env.DB_PATH;

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }

  pluginManifests.forEach((pluginManifest, _index) => {
    const {id, name, requiresDb, process} = pluginManifest;

    if (isPluginActive(id)) {
      let activeProcess;

      if (process) {
        activeProcess = new process();
        const initArgs: PluginTypes.ProcessInitArgs = {};

        if (requiresDb) {
          const Datastore = remote.getGlobal('Datastore');

          initArgs.db = new Datastore({
            filename: path.join(dbPath, `${name.toLowerCase()}.db`),
            autoload: true,
          });
        }

        activeProcess.initialize(initArgs);
      }

      const activePlugin: PluginTypes.ActivePlugin = {
        ...pluginManifest,
        process: activeProcess,
      };
      activePlugins.push(activePlugin);
    }

    allPlugins.push(pluginManifest);
  });

  return {activePlugins, allPlugins};
};

setInterval(() => {
  // keep listening for main process msgs
}, 100);

const isPluginActive = (_id: number) => {
  // logic to identify if a plugin is active
  return true;
};
