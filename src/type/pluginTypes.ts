import {EventEmitter} from 'events';
import * as Datastore from 'nedb';
import {IconType} from 'react-icons';

export interface ProcessInitArgs {
  db?: Datastore;
}

export interface RenderProps {
  pluginProcess: ProcessAbstract;
}

export class ProcessAbstract extends EventEmitter {
  sendMessage: (
    type: string,
    msgData: any,
    cb?: (error: any, response: any) => void,
  ) => void;
  initialize: (args: ProcessInitArgs) => void;
  onAppFocus?(e: any): void;
  onAppUnFocus?(e: any): void;
  onIconClick?(e: any): void;
}

export interface Manifest {
  id: number;
  name: string;
  sideIcon?: IconType;
  requiresDb?: boolean;
  pluginProcess?: typeof ProcessAbstract;
  render?: (props: RenderProps) => React.ReactNode;
}

export interface ActivePlugin {
  id: number;
  name: string;
  sideIcon?: IconType;
  requiresDb?: boolean;
  pluginProcess?: ProcessAbstract;
  render?: (props: RenderProps) => React.ReactNode;
}
