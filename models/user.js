'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    userId: DataTypes.STRING,
    userPassword: DataTypes.STRING,
    userName: DataTypes.STRING,
    birthday: DataTypes.DATE,
    sex: DataTypes.STRING,
    interest: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};