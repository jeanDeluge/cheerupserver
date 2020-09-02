"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      userCard.belongsTo(models.User, {
        foreignKey: "userId",
        as: "User",
      });
      userCard.belongsTo(models.Card, {
        foreignKey: "cardId",
        as: "Card",
      });
    }
  }
  userCard.init(
    {
      userId: DataTypes.INTEGER,
      cardId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "userCard",
    }
  );
  return userCard;
};
