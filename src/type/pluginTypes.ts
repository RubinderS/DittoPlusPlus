import {EventEmitter} from 'events';
import {DatastoreType} from './dbTypes';

export interface ProcessInitArgs {
  db?: DatastoreType;
}

export interface RenderProps {
  process: ProcessAbstract;
}

export class ProcessAbstract extends EventEmitter {
  sendMessage: (
    type: string,
    data: any,
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
  sideIcon?: string;
  requiresDb?: boolean;
  process?: typeof ProcessAbstract;
  render?: (props: RenderProps) => React.ReactNode;
}

export interface ActivePlugin {
  id: number;
  name: string;
  sideIcon?: string;
  requiresDb?: boolean;
  process?: ProcessAbstract;
  render?: (props: RenderProps) => React.ReactNode;
}