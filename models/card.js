"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Card.belongsTo(models.User, {
        foreignKey: "user_Id",
        as: "User",
        targetKey: "id"

      });
      Card.hasMany(models.Comment, {
        foreignKey: "card_id",
        as: "Comment",
        onDelete: "CASCADE",

      });
    }
  }
  Card.init(
    {
      text: DataTypes.STRING,
      tags: DataTypes.STRING,
      cheered: DataTypes.INTEGER,
      done: DataTypes.BOOLEAN,
      DLC: DataTypes.STRING,
      user_Id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Card",
    }
  );
  return Card;
};
