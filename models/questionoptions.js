"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class QuestionOptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Question }) {
      this.belongsTo(Question, {
        foreignKey: "question_id",
      });
    }
  }
  QuestionOptions.init(
    {
      question_id: DataTypes.INTEGER,
      option: DataTypes.STRING,
      score: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "QuestionOptions",
      tableName: "question_options",
    }
  );
  return QuestionOptions;
};
