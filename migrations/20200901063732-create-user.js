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
        defalutValue: false

      },
      birthday: {
        type: Sequelize.DATE,
      },
      sex: {
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
