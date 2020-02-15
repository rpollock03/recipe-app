// express setup
const express = require("express");
const app = express();
const port = 5000;

app.get("/", (req, res) => res.send("Hellow world!"))



app.listen(port, () => console.log(`Server starting on port ${port}!`));

