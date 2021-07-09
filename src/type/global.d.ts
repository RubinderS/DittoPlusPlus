import * as Datastore from 'nedb';

declare global {
  namespace NodeJS {
    interface Global {
      Datastore: typeof Datastore;
    }
  }
}
