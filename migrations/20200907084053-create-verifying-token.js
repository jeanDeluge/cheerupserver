<<<<<<< HEAD
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('VerifyingTokens', {
=======
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("VerifyingTokens", {
>>>>>>> 2ff4ceb67223cd7f27c988faf2c9453658132fde
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
<<<<<<< HEAD
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING
=======
        type: Sequelize.INTEGER,
      },
      token: {
        type: Sequelize.STRING,
>>>>>>> 2ff4ceb67223cd7f27c988faf2c9453658132fde
      },
      user_Id: {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
<<<<<<< HEAD
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('VerifyingTokens');
  }
};
=======
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("VerifyingTokens");
  },
};
>>>>>>> 2ff4ceb67223cd7f27c988faf2c9453658132fde
