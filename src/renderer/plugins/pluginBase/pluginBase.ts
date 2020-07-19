import * as Datastore from 'nedb';

export type DatastoreType = Datastore;

export interface InitializeArgs {
  db?: Datastore;
}

export class PluginBase {
  name: string;
  sideBarIcon?: SVGAElement;
  requiresDb?: boolean;
  db?: Datastore;

  constructor() {
    console.log('Plaugin base constructed');
  }

  onInitialize?(e: InitializeArgs): void;
  onClick?(e: any): void;
  onAppFocus?(e: any): void;
  onAppUnFocus?(e: any): void;
  render?(e: any): React.ReactNode;
}
