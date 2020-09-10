"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.STRING,
      },
      userPassword: {
        type: Sequelize.STRING,
      },
      userName: {
        type: Sequelize.STRING,
      },
      verified: {
        type: Sequelize.BOOLEAN,
<<<<<<< HEAD
        defalutValue: false
=======
        defalutValue: false,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defalutValue: false,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defalutValue: false,
>>>>>>> 2ff4ceb67223cd7f27c988faf2c9453658132fde
      },
      age: {
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.STRING,
      },
      interest: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
