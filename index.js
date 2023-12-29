const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://azizul:12345@cluster0.13lfhki.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const taskCollection = client.db("technovisionDB").collection("tasks");


    app.get('/tasks', async(req, res)=>{
      const result = await taskCollection.find().toArray()
      res.send(result)
    })
    app.get('/tasks/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await taskCollection.findOne(query)
      res.send(result)
    })
    app.post('/tasks', async(req, res)=>{
      const item = req.body
      const result = await taskCollection.insertOne(item)
      res.send(result)
    })
    app.patch('/tasks/:id', async(req, res) =>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedTask = req.body
      const updateDoc = {
          $set:{

            title:updatedTask.title, 
            title: updatedTask.title,
            description: updatedTask.description,
            priority: updatedTask.priority,
            deadline: updatedTask.deadline,
            status: "todo"
          }
      } 
      const result = await taskCollection.updateOne(filter, updateDoc, options)
      res.send(result)

  })
  app.patch('/tasks/completed/:id', async(req, res)=>{
    const id = req.params.id
    const filter = {_id: new ObjectId(id)}
    const updatedDoc = {
      $set: {
        status: "completed"
      }
    }
    const result = await taskCollection.updateOne(filter, updatedDoc)
    res.send(result)
  })
  app.patch('/tasks/ongoing/:id', async(req, res)=>{
    const id = req.params.id
    const filter = {_id: new ObjectId(id)}
    const updatedDoc = {
      $set: {
        status: "ongoing"
      }
    }
    const result = await taskCollection.updateOne(filter, updatedDoc)
    res.send(result)
  })
  app.patch('/tasks/todo/:id', async(req, res)=>{
    const id = req.params.id
    const filter = {_id: new ObjectId(id)}
    const updatedDoc = {
      $set: {
        status: "todo"
      }
    }
    const result = await taskCollection.updateOne(filter, updatedDoc)
    res.send(result)
  })

    app.delete('/tasks/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await taskCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Technovision Server is running...!')
})

app.listen(port, () => {
  console.log(`Technovision app running on port ${port}`)
})