import {pluginManifests} from '@plugins';
import * as path from 'path';
import {remote} from 'electron';
import {ActivePlugin, PluginInitArgs, PluginManifest} from '@type/pluginTypes';

let activePlugins: ActivePlugin[] = [];
let allPlugins: PluginManifest[] = [];

export const loadPlugins = () => {
  pluginManifests.map((pluginManifest, index) => {
    const {id, name, requiresDb, process, render} = pluginManifest;

    if (isPluginActive(id)) {
      let activePlugin: ActivePlugin;
      let activeProcess;

      if (process) {
        activeProcess = new process();
        const initArgs: PluginInitArgs = {};

        if (requiresDb) {
          const Datastore = remote.getGlobal('Datastore');

          initArgs.db = new Datastore({
            filename: path.join('db', `${name.toLowerCase()}.db`),
            autoload: true,
          });
        }

        activeProcess.initialize(initArgs);
      }

      activePlugin = {...pluginManifest, process: activeProcess};
      activePlugins.push(activePlugin);
    }

    allPlugins.push(pluginManifest);
  });

  return {activePlugins, allPlugins};
};

setInterval(() => {
  // keep listening for main process msgs
}, 100);

const isPluginActive = (id: number) => {
  // logic to identify if a plugin is active
  return true;
};
