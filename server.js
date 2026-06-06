const http = require("http");
const mongodb = require("mongodb");
require("dotenv").config();

const mongoClient = new mongodb.MongoClient(process.env.MONGO_URL);

async function startServer() {
  await mongoClient.connect();
  console.log("MongoDB verbunden");

  server.listen(process.env.PORT || 3000, () => {
    console.log("Server läuft");
  });
}

const server = http.createServer(async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const collection = mongoClient.db("buecherregal").collection("buecher");

  // GET
  if (req.method === "GET" && req.url === "/") {
    const data = await collection.find({}).toArray();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(data));
  }

  // ADD
  if (req.method === "POST" && req.url === "/addBook") {
    let body = "";
    req.on("data", chunk => body += chunk);

    req.on("end", async () => {
      await collection.insertOne(JSON.parse(body));
      res.writeHead(201);
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // DELETE BY ID
  if (req.method === "POST" && req.url === "/deleteBook") {
    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", async () => {
      const { id } = JSON.parse(body);

      await collection.deleteOne({
        _id: new mongodb.ObjectId(id)
      });

      res.writeHead(200);
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // DELETE BY TITLE
  if (req.method === "POST" && req.url === "/deleteByTitle") {
    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", async () => {
      const { titel } = JSON.parse(body);

      await collection.deleteOne({
        titel: { $regex: new RegExp(`^${titel}$`, "i") }
      });

      res.writeHead(200);
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // UPDATE STATUS
  if (req.method === "POST" && req.url === "/updateStatus") {
    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", async () => {
      const { id, gelesen } = JSON.parse(body);

      await collection.updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { gelesen } }
      );

      res.writeHead(200);
      res.end(JSON.stringify({ ok: true }));
    });

    return;
  }
});

startServer();
