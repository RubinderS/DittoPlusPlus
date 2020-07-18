import DBManager from './dbManager';

const db = new DBManager({name: 'mydb2'});

// db.load()
//   .then(() => {
//     db.insert({name: 'Robin2', pc: 'Dell'})
//       .then((newDoc) => console.log(JSON.stringify(newDoc)))
//       .catch((err) => console.log(err));
//     db.insert({name: 'Robin2', pc: 'Dell'})
//       .then((newDoc) => console.log(JSON.stringify(newDoc)))
//       .catch((err) => console.log(err));
//     })
//     .catch((err) => console.log(err));

// db.insert({name: 'Robin2', pc: 'Dell'})
//   .then((newDoc) => console.log(JSON.stringify(newDoc)))
//   .catch((err) => console.log(err));

async function func() {
  try {
    const res = await db.find({name: 'Robin2'});
    console.log(JSON.stringify(res));
  } catch (e) {
    console.log(e);
  }
}

func();
