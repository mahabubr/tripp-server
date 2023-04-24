require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');


// middle were
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Tripp Server Running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vlhy1ml.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const Database = client.db('tripp')

        const categoryCollection = Database.collection('category')
        const airportCollection = Database.collection('airport')

        app.get('/category', async (req, res) => {
            const query = {}
            const result = await categoryCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/airport', async (req, res) => {
            const query = {}
            const result = await airportCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/sort-airport', async (req, res) => {
            const query = {}
            const cursor = airportCollection.find(query).sort({ _id: -1 })
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })

    } catch (e) {
        console.log(e.message);
    }
}

run()

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))