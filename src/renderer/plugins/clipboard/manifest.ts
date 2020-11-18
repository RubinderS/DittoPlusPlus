import * as PluginTypes from '@type/pluginTypes';
import {ClipboardComponent} from './render';
import {ClipboardProcess} from './process';

export const ClipBoard: PluginTypes.Manifest = {
  id: 1,
  name: 'Clipboard',
  sideIcon: 'icon',
  requiresDb: true,
  process: ClipboardProcess,
  render: ClipboardComponent,
};
