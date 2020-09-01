module.exports = {
  "development": {
<<<<<<< HEAD:config/config.json
    "username": "root",
    "password": "akwldrk4424!@",
    "database": "development",
    "host": "127.0.0.1",
=======
    "username": "admin",
    "password": process.env.CHEERUPDBPASSWORD,
    "database": "cheerup_database",
    "host":"cheerupdatabase.cx7gp3irwp5f.ap-northeast-2.rds.amazonaws.com",
>>>>>>> 1d0c81b555820a6ce075e403809c74cf94796249:config/config.js
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
