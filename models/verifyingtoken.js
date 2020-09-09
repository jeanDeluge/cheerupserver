'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VerifyingToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VerifyingToken.belongsTo(models.User,{
        foreignKey: "userId",
        as: "User",
        targetKey: "id"
      })
    }
  };
  VerifyingToken.init({
    token: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'VerifyingToken',
  });
  return VerifyingToken;
};