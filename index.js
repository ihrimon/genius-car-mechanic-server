// initial 5 steps for api server
const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
// environment user require
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// user: geniuscar
// password: aK4arL1dWBMrJa6N

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zaiok.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('Connect to database')
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET Single Service
        app.get('services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting specific service', id);
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);;
            res.json(service);
        });
        // POST API 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            // const service = {
            //     "name": "ENGINE DIAGNOSTIC",
            //     "price": "300",
            //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            // }
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            // res.send('post hitted')
            res.json(result);
        });

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running genius server on the ui display');
})

app.get('/hello', (req, res) => {
    res.send('hello update here');
})

app.listen(port, () => {
    console.log('Running Genius Server on Port ', port);
});



/*
One time:
1. heroku account open
2. heroku software install

Every project
1. git init
2. .gitignore (node_modules, .env)
3. push everything to git
4. make sure have this script: "start": "node index.js"
5. make sure: put process.env.PORT in front of your port number
6. heroku login
7. heroku create (only one time for a project)
8. command: git push heroku main

-------------
Update:
1. save everything check locally
1. git add, git commit -m", git push
3. git push heroku main


*/