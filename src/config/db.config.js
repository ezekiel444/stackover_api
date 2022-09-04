const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

const config = require('./index');

dotenv.config();

const sequelize = new Sequelize(config.DB.database, config.DB.username, config.DB.password,
  {
    dialect: 'mysql',
    host: config.DB.hostname,
    define: {
      timestamps: false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

(async () => await sequelize.sync())();

module.exports = sequelize;
