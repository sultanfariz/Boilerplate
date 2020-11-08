const sequelize = require("sequelize");

const db = new sequelize("crud_nodejs","root","",{
    dialect: "mysql"
});

db.sync({});

module.exports = db;