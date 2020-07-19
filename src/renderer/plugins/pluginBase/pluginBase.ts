import * as Datastore from 'nedb';

export type DatastoreType = Datastore;

export interface InitializeArgs {
  db?: Datastore;
}

export class PluginBase {
  name: string = 'name_not_defined';
  sideBarIcon?: SVGAElement;
  requiresDb?: boolean;
  db?: Datastore;

  onInitialize?(e: InitializeArgs): void;
  onClick?(e: any): void;
  onAppFocus?(e: any): void;
  onAppUnFocus?(e: any): void;
  render?(e: any): React.ReactNode;
}
