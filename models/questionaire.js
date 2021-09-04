"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Questionaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Question, QuestionaireQuestions }) {
      // define association here
      this.belongsToMany(Question, {
        through: QuestionaireQuestions,
        foreignKey: "questionaire_id",
      });
    }
  }
  Questionaire.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      questionaire_type: {
        type: DataTypes.ENUM(["survey", "assessment"]),
        allowNull: false,
        defaultValue: "survey",
      },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
      auto_assign: { type: DataTypes.BOOLEAN, defaultValue: false },
      access_level: {
        type: DataTypes.ENUM(["Free", "Paid"]),
        defaultValue: "Free",
      },
    },
    {
      sequelize,
      modelName: "Questionaire",
    }
  );
  return Questionaire;
};
