require('dotenv').config();
const {MongoClient} = require('mongodb');
const sqlite3 = require('sqlite3');
//const {generateSecretHash} = require('../utils/apiKey');

if (!process.env.USERNAME || !process.env.PASSWORD || !process.env.CLUSTER){

    // Function to open a SQLite database connection
    const openDatabase = async () => {
        return new sqlite3.Database('db.sqlite3', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                throw err;
            }
            console.log('Connected to the database');
        });
    };

    // Function to create a table in the database
    const createTable = async (db) => {
        return new Promise((resolve, reject) => {
            const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, api_key_hash TEXT);
            `;

            db.run(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                    reject(err);
                } else {
                    console.log('Table created successfully');
                    resolve();
                }
            });
        });
    };

    // Function to close the database connection
    const closeDatabase = async (db) => {
        return new Promise((resolve, reject) => {
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                    reject(err);
                } else {
                    console.log('Database connection closed');
                    resolve();
                }
            });
        });
    };

    // Function to create table in database and register hashes to database
    const registerHash = async (hash) => {
        try {
            const db = await openDatabase();

            // Create the table
            await createTable(db);

            // Insert apikeys
            db.run("INSERT INTO users (api_key_hash) VALUES (?)", [hash]);
            // Close the database connection
            await closeDatabase(db);
        } catch (error) {
            console.error('Main process error:', error);
        }
    };

    //Function to retrieve api keys from db
    const rows = async (db) => {
        return new Promise((resolve, reject) => {
            const selectQuery = 'SELECT api_key_hash FROM users;';
    
            db.all(selectQuery, [], (err, rows) => {
                if (err) {
                    console.error('Error retrieving data:', err.message);
                    reject(err);
                } else {
                    const apiKeys = rows.map(row => row.api_key_hash);
                    resolve(apiKeys);
                }
            });
        });
    };
        //Function to open database and asynchronosly retrieve api keys
        const getHashes = async () => {
        try {
            const db = await openDatabase();

            // retrieve api keys
            const key_hashes = await rows(db);

            await closeDatabase(db);

            return key_hashes;
            
        } catch (error) {
            console.error('Error getting hashes:', error);
        }
    };


    module.exports = {registerHash, getHashes}; 
} else{ 

    //Connect to MongoDB
    const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.CLUSTER}.7l9mzei.mongodb.net/?retryWrites=true&w=majority";`


    // Function to register hashes to mongoDB
    async function registerHash(hash){
        const client = new MongoClient(uri);
        try{
            
            await client.connect();
            console.log('Connected to MongoDB');

            const database = client.db("UserData")
            const users = database.collection("Users")

            const doc = {
                    
                    api_key_hash: hash
            }
        
            const writeConcern = {w: 0, j: true, wtimeout:1000 }
            const result = await users.insertOne(doc, {writeConcern});

        

            } catch (err){
                console.log(`Couldn't register api key. Error: ${error} `);
                
            } finally {
            await client.close();
            console.log('Database connection closed');
            } 
    
    }

    //Function to retrieve api keys from db using mongoDB
    async function getHashes(){
        const client = new MongoClient(uri);
        try{
            
            await client.connect();
            console.log('Connected to MongoDB');

            const database = await client.db("UserData")
            

            if(!database){
                console.log('Cannot connect to database')
                return;
            }

            const users = await database.collection("Users")
            
            
            if (!users){
                console.log('Cannot connect to Collection')
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
            console.log(`Couldn't retrieve api keys from database. Error: ${error}`);

        } finally{

            await client.close();
            console.log('Database connection closed')
        }
    }

    module.exports = {registerHash, getHashes};
}