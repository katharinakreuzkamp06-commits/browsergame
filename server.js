const express = require("express");
const path = require("path");
const http = require("http");
const mongodb = require("mongodb");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const mongoClient = new mongodb.MongoClient(process.env.MONGO_URL);

async function startServer() {
  await mongoClient.connect();
  console.log("MongoDB verbunden");

  server.listen(process.env.PORT || 3000, () => {
    console.log("Server läuft");
  });
}

const collection = () =>
  mongoClient.db("buecherregal").collection("buecher");


// GET ALL
app.get("/api/books", async (req, res) => {
  const data = await collection().find({}).toArray();
  res.json(data);
});

// ADD
app.post("/api/addBook", async (req, res) => {
  await collection().insertOne(req.body);
  res.json({ ok: true });
});

// DELETE BY ID
app.post("/api/deleteBook", async (req, res) => {
  await collection().deleteOne({
    _id: new mongodb.ObjectId(req.body.id)
  });
  res.json({ ok: true });
});

// DELETE BY TITLE
app.post("/api/deleteByTitle", async (req, res) => {
  await collection().deleteOne({
    titel: { $regex: new RegExp(`^${req.body.titel}$`, "i") }
  });
  res.json({ ok: true });
});

// UPDATE STATUS
app.post("/api/updateStatus", async (req, res) => {
  await collection().updateOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { gelesen: req.body.gelesen } }
  );
  res.json({ ok: true });
});

startServer();