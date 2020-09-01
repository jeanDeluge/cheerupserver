module.exports = {
  "development": {
    "username": "admin",
    "password": process.env.CHEERUPDBPASSWORD,
    "database": "cheerup_database",
    "host":"cheerupdatabase.cx7gp3irwp5f.ap-northeast-2.rds.amazonaws.com",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "abcde",
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
