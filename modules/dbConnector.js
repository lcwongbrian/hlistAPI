const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let mongoDBConnectionString = process.env.MONGO_URL;
let Schema = mongoose.Schema;

const surfaceSchema = new Schema({
    surface_id: Number,
    vertices: [[Number]]
}, {
    collection: "hlist"
});

let Hlist;

module.exports.connect = async () => {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString);

        db.on('error', err => {
            reject(err);
        });

        db.once('open', () => {
            Hlist = db.model("hlist", surfaceSchema);
            resolve();
        });
    });
};

module.exports.getSurfaceById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await Hlist.findOne({
                surface_id: id
            }).exec();
    
            if (res) {
                resolve(res);
            } else {
                console.log("Empty data");
                resolve(false);
            }
        } catch(e) {
            console.log(e);
            reject();
        }
    });    
};