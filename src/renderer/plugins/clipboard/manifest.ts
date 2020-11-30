import * as PluginTypes from '@type/pluginTypes';
import {AssignmentOutlined} from '@material-ui/icons';
import {ClipboardRenderer} from './component/';
import {ClipboardProcess} from './process';

export const ClipBoard: PluginTypes.Manifest = {
  id: 1,
  name: 'Clipboard',
  sideIcon: AssignmentOutlined,
  requiresDb: true,
  process: ClipboardProcess,
  render: ClipboardRenderer,
};
