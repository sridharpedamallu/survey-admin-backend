"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subtopic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Topic, Question }) {
      this.belongsTo(Topic, { foreignKey: "topic_id" });
      this.hasMany(Question, { foreignKey: "subtopic_id" });
    }
  }
  Subtopic.init(
    {
      subtopic: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      topic_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Subtopic",
      tableName: "subtopics",
    }
  );
  return Subtopic;
};
