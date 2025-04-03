const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
    host: process.env.PG_HOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }
});

const hlist = sequelize.define(
    "hlist",
    {
        surface_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoincrement: true
        },
        vertices: Sequelize.BLOB
    },
    {
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
    }
);

const initialize = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await sequelize.sync();
            console.log(`[PG] Successfully access DB`);
            resolve();
        } catch (err) {
            console.log(`[PG] Fail to initialize: ${err}`);
            reject(err);
        }
    });
};

const getSurfaceBinaryById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await hlist.findAll({
                attributes: ["vertices"],
                where: {
                    surface_id: id
                }
            });
            const vertices = response[0].vertices;
            const result = [];
            for (let i = 0; i < vertices.length; i += 4) {
                result.push(vertices.readFloatLE(i));
            }
            resolve(result);
        } catch(err) {
            console.log(`[getSurfaceBinaryById] Error: ${err}`);
            reject(err);
        }
    });
};

module.exports = {
    initialize,
    getSurfaceBinaryById
};