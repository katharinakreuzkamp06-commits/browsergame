const express = require("express");
const path = require("path");
const mongodb = require("mongodb");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const client = new mongodb.MongoClient(process.env.MONGO_URL);

function col() {
  return client.db("buecherregal").collection("buecher");
}

// API
app.get("/api/books", async (req, res) => {
  res.json(await col().find().toArray());
});

app.post("/api/addBook", async (req, res) => {
  await col().insertOne(req.body);
  res.json({ ok: true });
});

// FRONTEND ROUTE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// IMPORTANT: Render PORT FIX
const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", async () => {
  await client.connect();
  console.log("MongoDB verbunden");
  console.log("Server läuft auf Port", PORT);
});