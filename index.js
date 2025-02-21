const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5200;

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
    const tasksCollection = client.db("TasksDB").collection("tasks");

    // Add Task (POST)
    app.post("/tasks", async (req, res) => {
      const { userId, title, description, category } = req.body;
      try {
        const task = {
          userId,
          title,
          description,
          category,
          timestamp: new Date().toISOString(),
        };
        const result = await tasksCollection.insertOne(task);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to add task" });
      }
    });

    // Get Tasks (GET)
    app.get("/tasks", async (req, res) => {
      const { userId } = req.query;
      try {
        const tasks = await tasksCollection.find({ userId }).toArray();
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
      }
    });

    // Update Task (PUT)
    app.put("/tasks/:id", async (req, res) => {
      const { title, description, category } = req.body;
      const { id } = req.params;
      try {
        const result = await tasksCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { title, description, category } }
        );
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to update task" });
      }
    });

    // app.put("/tasks/:id", async (req, res) => {
    //     const { id } = req.params;
    //     const { category } = req.body;
      
    //     try {
    //       await Task.updateOne({ _id: id }, { category });
    //       res.status(200).send("Task category updated");
    //     } catch (err) {
    //       res.status(500).send("Error updating task category");
    //     }
    //   });

    // Delete Task (DELETE)
    app.delete("/tasks/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
      }
    });

    app.get("/", (req, res) => {
      res.send("Your app is running properly.");
    });

    console.log("Connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`Server running on port ${port}`));
