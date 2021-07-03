import * as PluginTypes from '@type/pluginTypes';
import {MdAssignment} from 'react-icons/md';
import {ClipboardRenderer} from './component/';
import {ClipboardProcess} from './process';

export const ClipBoard: PluginTypes.Manifest = {
  id: 1,
  name: 'Clipboard',
  sideIcon: MdAssignment,
  requiresDb: true,
  process: ClipboardProcess,
  render: ClipboardRenderer,
};
