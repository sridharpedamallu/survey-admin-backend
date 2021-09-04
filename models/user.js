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
      // define association here
    }
  }
  User.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      gender: DataTypes.ENUM(["male", "female", "other"]),
      birth_year: DataTypes.INTEGER,
      user_type: DataTypes.ENUM(["guest", "user", "admin"]),
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      uuid: DataTypes.UUID,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  return User;
};
