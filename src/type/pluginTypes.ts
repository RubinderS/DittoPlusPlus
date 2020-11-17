import {EventEmitter} from 'events';
import {DatastoreType} from './dbTypes';

export interface PluginInitArgs {
  db?: DatastoreType;
}

export interface PluginRenderProps {
  process?: PluginProcess;
}

export class PluginProcess extends EventEmitter {
  sendMessage: (message: string, cb: (response: any) => void) => void;
  initialize: (args: PluginInitArgs) => void;
  onAppFocus?(e: any): void;
  onAppUnFocus?(e: any): void;
  onIconClick?(e: any): void;
}

export interface PluginManifest {
  id: number;
  name: string;
  sideIcon?: string;
  requiresDb?: boolean;
  process?: typeof PluginProcess;
  render?: (props: PluginRenderProps) => React.ReactNode;
}

export interface ActivePlugin {
  id: number;
  name: string;
  sideIcon?: string;
  requiresDb?: boolean;
  process?: PluginProcess;
  render?: (props: PluginRenderProps) => React.ReactNode;
}
