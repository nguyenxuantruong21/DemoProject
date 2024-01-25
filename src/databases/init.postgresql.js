const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("Demo", "postgres", "18102001", {
  host: "localhost",
  dialect: "postgres",
});

class Database {
  constructor() {
    this.connect();
  }
  async connect() {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instancePostgre = Database.getInstance();
module.exports = instancePostgre;
