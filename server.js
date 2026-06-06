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

// 🔥 FRONTEND (index.html wird geladen)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 API ROUTES
app.get("/api/books", async (req, res) => {
  const data = await col().find({}).toArray();
  res.json(data);
});

app.post("/api/addBook", async (req, res) => {
  await col().insertOne(req.body);
  res.json({ ok: true });
});

app.post("/api/deleteBook", async (req, res) => {
  await col().deleteOne({ _id: new mongodb.ObjectId(req.body.id) });
  res.json({ ok: true });
});

app.post("/api/updateStatus", async (req, res) => {
  await col().updateOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { gelesen: req.body.gelesen } }
  );
  res.json({ ok: true });
});

// 🔥 START SERVER (WICHTIG für Render)
async function start() {
  await client.connect();
  console.log("MongoDB verbunden");

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server läuft auf Port", PORT);
  });
}

start();