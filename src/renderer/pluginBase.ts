import {DatastoreType, PluginInitArgs} from '@types';

export class PluginBase {
  name: string = 'name_not_defined';
  sideBarIcon?: SVGAElement;
  db?: DatastoreType;
  requiresDb?: boolean;

  constructor() {}

  onInitialize?(e: PluginInitArgs): void;
  onAppFocus?(e: any): void;
  onAppUnFocus?(e: any): void;
  onIconClick?(e: any): void;
  getComponent?(): React.ReactNode;
}
