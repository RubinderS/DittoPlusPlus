import * as Datastore from 'nedb';

export type DatastoreType = Datastore;

export interface InitializeArgs {
  db?: Datastore;
}
