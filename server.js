const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnector = require("./modules/dbConnector");

dotenv.config();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const run = async () => {
    try {
        await dbConnector.connect();
        app.listen(HTTP_PORT, () => {
            console.log("API listening on: " + HTTP_PORT)
        });
    } catch (err) {
        console.log("unable to start the server: " + err);
        process.exit();
    }
};

app.get("/hlist/getSurfaceById/:id", async (req, res) => {
    try {
        const data = await dbConnector.getSurfaceById(req.params.id);
        res.json(data);
    } catch (msg) {
        res.status(404).json({ error: msg });
    }
});

run();