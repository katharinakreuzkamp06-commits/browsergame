const express = require("express");
const path = require("path");
const http = require("http");
const mongodb = require("mongodb");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(express.json());

// 🔥 WICHTIG: static muss VOR API stehen
app.use(express.static(path.join(__dirname, "public")));

const mongoClient = new mongodb.MongoClient(process.env.MONGO_URL);

function collection() {
  return mongoClient.db("buecherregal").collection("buecher");
}

// 🔥 ROOT MUSS HTML liefern
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API ROUTES
app.get("/api/books", async (req, res) => {
  const data = await collection().find({}).toArray();
  res.json(data);
});

app.post("/api/addBook", async (req, res) => {
  await collection().insertOne(req.body);
  res.json({ ok: true });
});

app.post("/api/deleteBook", async (req, res) => {
  await collection().deleteOne({
    _id: new mongodb.ObjectId(req.body.id)
  });
  res.json({ ok: true });
});

app.post("/api/deleteByTitle", async (req, res) => {
  await collection().deleteOne({
    titel: { $regex: new RegExp(`^${req.body.titel}$`, "i") }
  });
  res.json({ ok: true });
});

app.post("/api/updateStatus", async (req, res) => {
  await collection().updateOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { gelesen: req.body.gelesen } }
  );
  res.json({ ok: true });
});

async function startServer() {
  await mongoClient.connect();
  console.log("MongoDB verbunden");

  server.listen(process.env.PORT || 3000, () => {
    console.log("Server läuft");
  });
}

startServer();