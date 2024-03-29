import {pluginManifests} from '@plugins';
import * as path from 'path';
import * as fs from 'fs';
import {remote} from 'electron';
import * as PluginTypes from '@type/pluginTypes';

const activePlugins: PluginTypes.ActivePlugin[] = [];
const allPlugins: PluginTypes.Manifest[] = [];

export const loadPlugins = () => {
  const settingsDir = process.env.Settings_Dir;

  if (!fs.existsSync(settingsDir)) {
    fs.mkdirSync(settingsDir);
  }

  pluginManifests.forEach((pluginManifest, _index) => {
    const {id, name, requiresDb, pluginProcess} = pluginManifest;

    if (isPluginActive(id)) {
      let activeProcess;

      const pluginSettingsDir = path.join(
        settingsDir,
        name.toLocaleLowerCase(),
      );

      if (!fs.existsSync(pluginSettingsDir)) {
        fs.mkdirSync(pluginSettingsDir);
      }

      if (pluginProcess) {
        activeProcess = new pluginProcess();
        const initArgs: PluginTypes.ProcessInitArgs = {pluginSettingsDir};

        if (requiresDb) {
          const Datastore = remote.getGlobal('Datastore');

          initArgs.db = new Datastore({
            filename: path.join(
              pluginSettingsDir,
              `${name.toLocaleLowerCase()}.db`,
            ),
            autoload: true,
          });
        }

        activeProcess.initialize(initArgs);
      }

      const activePlugin: PluginTypes.ActivePlugin = {
        ...pluginManifest,
        pluginProcess: activeProcess,
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
