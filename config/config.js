module.exports = {
  development: {
    username: "root",
    password: "Qkwldrk4424!@",
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "admin",
    password: process.env.CHEERUPDBPASSWORD,
    database: "database_test",
    host: "cheerupdatabase.cx7gp3irwp5f.ap-northeast-2.rds.amazonaws.com",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
