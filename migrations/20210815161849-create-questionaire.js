"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("questionaires", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      questionaire_type: {
        type: Sequelize.ENUM(["survey", "assessment"]),
        allowNull: false,
        defaultValue: "survey",
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      auto_assign: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      access_level: {
        type: Sequelize.ENUM(["Free", "Paid"]),
        defaultValue: "Paid",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("questionaires");
  },
};
