"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class QuestionaireQuestions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Questionaire, Question }) {
      // define association here
      this.belongsTo(Question, {
        foreignKey: "question_id",
      });
      this.belongsTo(Questionaire, {
        foreignKey: "questionaire_id",
      });
    }
  }
  QuestionaireQuestions.init(
    {
      questionaire_id: DataTypes.INTEGER,
      question_id: DataTypes.INTEGER,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "QuestionaireQuestions",
      tableName: "questionaire_questions",
    }
  );
  return QuestionaireQuestions;
};
