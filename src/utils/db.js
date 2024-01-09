require('dotenv').config();
const {MongoClient} = require('mongodb');
const sqlite3 = require('sqlite3');
//const db = new sqlite3.Database('./db.sqlite3');
const {generateSecretHash} = require('../utils/apiKey');

const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.CLUSTER}.7l9mzei.mongodb.net/?retryWrites=true&w=majority";`
const client = new MongoClient(uri);

async function registerHash(hash){
    try{
        const database = client.db("UserData")
        const users = database.collection("Users")

        const doc = {
                
                api_key_hash: hash
        }
     
        const writeConcern = {w: 0, j: true, wtimeout:1000 }
        const result = await users.insertOne(doc, {writeConcern});

    

        } finally {
        await client.close();
        }
   
}




async function getHashes(){
    if (!client){
        console.log('client failed');
        return;
    }
    try{
        const database = await client.db("UserData")
        

        if(!database){
            console.log('no database')
            return;
        }

        const users = await database.collection("Users")
        
        
        if (!users){
            console.log('no collection')
            return;
        }
        const query = {}

        const options = {
            projection: {_id: 0, api_key_hash: 1}
        };

        const cursor = await users.find(query, options);

        if ((await users.countDocuments(query)) === 0){
            console.log("No documents found!")
        }
        let keyHashes = [];

        for await (const doc of cursor){
            keyHashes.push(doc.api_key_hash);
        }
        
        return  await keyHashes;
    } catch (err){
        console.log(err);
    } finally{
        await client.close();
    }
}




async function getRoutes(){
    try{
        const database = client.db("UserData")
        const users = database.collection("Users")

        const query = {
            api_key_hash: {$exists: false}
        };

        const cursor =  users.find(query);
        let disallowed_routes = [];

        for await (const doc of cursor){
            disallowed_routes.push(doc._id);
        }
    } finally{
        await client.close();
    }
}


/*  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, api_key_hash TEXT, disallowed_routes TEXT)");
});

function registerHash(hash){
    db.run("INSERT INTO users (api_key_hash) VALUES (?)", [hash]);
}

function getHashes(callback){
    const query = 'SELECT api_key_hash FROM users';

    db.all(query, [], (err, rows) => {
    if (err) {
        console.error('Error getting hashes from DB: ', err.message);
        callback(err, null);
    } else {
        const keyHashes = rows.map(row => row.key_hash);
        callback(null, keyHashes);
    }
    });
}

function getRoutes(hash, callback){
    const query = "SELECT disallowed_routes FROM users WHERE (api_key_hash) = (?)";

    db.run(query, [hash], (err, row) => {
        if (err) {
            console.error('Error getting allowed routes from DB: ', err.message);
            callback(err, null);
        } else {
            callback(null, row.disallowed_routes);
        }
    });
}

process.on('exit', () => {
    db.close(err => {
      if (err) {
        return console.error('Error closing database: ', err.message);
      }
      console.log('Closed the SQLite database connection.');
    });
}); */

module.exports = {client, registerHash, getHashes, getRoutes};