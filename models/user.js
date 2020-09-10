"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Card, {
        foreignKey: "user_Id",
        as: "Card",
        onDelete: "CASCADE",
<<<<<<< HEAD
        sourceKey: 'id',
=======
        sourceKey: "id",
      });
      User.hasOne(models.VerifyingToken, {
        foreignKey: "user_Id",
        as: "VerifyingToken",
        sourceKey: "id",
>>>>>>> 2ff4ceb67223cd7f27c988faf2c9453658132fde
      });
      User.hasOne(models.VerifyingToken, {
        foreignKey: "user_Id",
        as: "VerifyingToken",
        sourceKey: "id"
      })
    }
  }
  User.init(
    {
      userId: DataTypes.STRING,
      userPassword: DataTypes.STRING,
      userName: DataTypes.STRING,
<<<<<<< HEAD
      verified : {
        type : DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
=======
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
>>>>>>> 2ff4ceb67223cd7f27c988faf2c9453658132fde
      },
      age: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      interest: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
