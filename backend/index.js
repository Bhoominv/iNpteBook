const connectToMongo = require('./db');
const express = require('express')

const cors = require('cors');
const app = express();

app.use(cors())

connectToMongo();

const port = 5000;

app.use(express.json());

// //Available routes

app.use("/api/auth",require("./routes/auth"));
app.use("/api/notes",require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})