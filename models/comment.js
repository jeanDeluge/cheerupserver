"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.Card, {
        foreignKey: "card_id",
        as: "Card",
      });
      Comment.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "User",
        onDelete: "CASCADE",
      });
    }
  }
  Comment.init(
    {
      text: DataTypes.STRING,
      card_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
