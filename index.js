

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors =require('cors')
const express =require('express')
const cookieParser = require("cookie-parser");
require("dotenv").config()
const jwt = require("jsonwebtoken");
const app = express()
const port = process.env.PORT || 5000

// middler
app.use(express.json())
app.use(cors())
app.use(cookieParser());

// mongodb connections 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f4ofb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

// database collections name 

    const Database= client.db("ResturantSystem").collection("ResturantCollections")
    // const ShoppinData =client.db("ResturantSystem" ).collection("ShoppingCollections")
    // const Users=client.db("ResturantSystem").collection("UsersCollections")
    const reviewDatabase = client.db("ResturantSystem").collection("reviewData")
    const cartCollection = client.db("ResturantSystem").collection("carts")
    const UsersCollections = client.db("ResturantSystem").collection("users")

//  get menuData

app.get('/menu', async(req, res) => {
const result = await Database.find().toArray()
 res.send(result)
})
  

// get reviewData

app.get("/review",async(req,res)=>{

const result = await reviewDatabase.find().toArray()
res.send(result)

})


// post carts
app.post('/carts', async(req, res) => {

const cart = req.body;
const result=await cartCollection.insertOne(cart)
res.send(result)
})

// get carts
// app.get('/carts/:email', async(req, res) => {
//   const email =req.params.email;
//   console.log(email)
//   const result = await cartCollection.find({email: email}).toArray()
//   res.send(result)
// })
app.get('/carts/:email', async (req, res) => {
  const email = req.params.email;
  console.log("Looking for carts of:", email); // Debug
  const result = await cartCollection.find({ email: email }).toArray();
  res.send(result);
});



// delete 

app.delete("/carts/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await cartCollection.deleteOne(query);
  res.send(result);
});


// UsersCollections
app.post('/user', async(req, res) => {

const users =req.body;

  // default role
  users.role = "user";

const result = await UsersCollections.insertOne(users)
res.send(result)
})









 
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('resturant server running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
