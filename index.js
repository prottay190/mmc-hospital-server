const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

//middleWare
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tz5xn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
         await client.connect();
         console.log('db connect')
         const database = client.db('hospital-info')
         const doctorsCollection = database.collection('doctors')

      //get data
      app.get('/doctors', async (req, res) =>{
        //   console.log(req.query);
        const cursor = doctorsCollection.find({});
        const page = req.query.page;
        const size = parseInt(req.query.size);
        let doctors;
        const count = await cursor.count();
        if(page){
            doctors = await cursor.skip(page*size).limit(size).toArray();
        }
        else{
            doctors = await cursor.toArray();
        }
        
       
        res.send({
            doctors,
            count
        })
      })
         
    }
    finally{
        // await client.close()
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running')
});

app.listen(port, () =>{
    console.log('running g', port)
})