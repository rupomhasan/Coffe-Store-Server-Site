const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const prot = process.env.PROT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r44bh6t.mongodb.net/?retryWrites=true&w=majority`;

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
      res.send("coffe making server is running");
    });

    const coffeeCollections = client.db("ProductDB").collection("Coffee");

    app.get("/products", async (req, res) => {
      const coffees = coffeeCollections.find();
      const result = await coffees.toArray();
      res.send(result);
    });
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollections.findOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await coffeeCollections.insertOne(product);
      res.send(result);
      // console.log(result);
    });

    app.patch("/product/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      console.log(id, coffee);

      const filter = { _id: new ObjectId(id) };
      const updatedCoffee = {
        $set: {
          name: coffee.name,
          supplier: coffee.supplier,
          category: coffee.category,
          chef: coffee.chef,
          taste: coffee.taste,
          price: coffee.price,
          photo_url: coffee.photo_url,
        },
      };
      const result = await coffeeCollections.updateOne(filter, updatedCoffee);
      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollections.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(prot);
