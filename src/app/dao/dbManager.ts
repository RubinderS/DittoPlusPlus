import * as Datastore from 'nedb';

interface Args {
  name: string;
}

export default class DBManager {
  db: Datastore;

  constructor(args: Args) {
    const {name} = args;

    this.db = new Datastore({filename: name, autoload: true});
  }

  /**
   * insert
   */
  public async insert(doc: any): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.db.insert(doc, (err, newDoc) => {
        if (err) {
          reject(err);
        }

        resolve(newDoc);
      });
    });
  }

  /**
   * find
   */
  public find(query: any): Promise<Array<Object>> {
    return new Promise((resolve, reject) => {
      this.db.find(query, (err: any, docs: any) => {
        if (err) {
          reject(err);
        }

        resolve(docs);
      });
    });
  }

  /**
   * findOne
   */
  public findOne(query: any): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.db.findOne(query, (err: any, doc: any) => {
        if (err) {
          reject(err);
        }

        resolve(doc);
      });
    });
  }
}
