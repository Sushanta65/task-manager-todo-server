const express = require("express");
const cors = require("cors");
require("dotenv").config();

//task-manager
// task-manager12
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5200;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uksn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

   
    app.get("/", (req, res) => {
      res.send("You app is running properly.");
    });




    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`Server running on port ${port}`));
