"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Subtopic, Questionaire, QuestionaireQuestions }) {
      this.belongsTo(Subtopic, { foreignKey: "subtopic_id" });
      this.belongsToMany(Questionaire, {
        through: QuestionaireQuestions,
        foreignKey: "question_id",
      });
    }
  }
  Question.init(
    {
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      question_type: {
        type: DataTypes.ENUM(["survey", "assessment"]),
        allowNull: false,
        defaultValue: "survey",
      },
      subtopic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Question",
    }
  );
  return Question;
};
