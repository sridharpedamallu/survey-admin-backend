const fs = require("fs");
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const {
  Question,
  Questionaire,
  QuestionaireQuestions,
  Topics,
  SubTopics,
} = require("../models");

const filterOptions = [
  "starts with",
  "contains",
  "ends with",
  "equal",
  "not equal",
  "greater than",
  "less than",
];

exports.getAllQuestionaires = async () => {
  return await Questionaire.findAll({
    include: {
      model: Question,
    },
  });
};

exports.ChangeStatus = async (req) => {
  const questionaire = await Questionaire.findByPk(req.params.id);
  if (questionaire) {
    questionaire.is_active = !questionaire.is_active;
    await questionaire.save();
    return await this.getQuestionaireById(req.params.id);
  } else {
    return false;
  }
};

exports.getQuestionaireById = async (pkId) => {
  if (!pkId) {
    return false;
  }

  return await Questionaire.findByPk(pkId, {
    include: {
      model: Question,
    },
  });
};

exports.delQuestionaireById = async (pkId) => {
  if (!pkId) {
    return false;
  }
  const delQuestionaire = await this.getQuestionaireById(pkId);
  if (delQuestionaire) {
    delQuestionaire.destroy();
    return true;
  } else {
    return false;
  }
};

exports.storeNewQuestionaire = async (input) => {
  try {
    const newquestionaire = await Questionaire.create({
      title: input.title,
      description: input.description,
      access_level: input.access_level,
      questionaire_type: input.questionaire_type,
      auto_assign: input.auto_assign,
      is_active: input.is_active,
    });

    return newquestionaire;
  } catch (error) {
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors[0].message;
    } else {
      return "Unexpected error occured";
    }
  }
};

exports.updateQuestionaire = async (input, pkId) => {
  const currentQuestionaire = await this.getQuestionaireById(pkId);

  try {
    await currentQuestionaire.update({
      title: input.title,
      description: input.description,
      access_level: input.access_level,
      questionaire_type: input.questionaire_type,
      auto_assign: input.auto_assign,
      is_active: input.is_active,
    });

    return currentQuestionaire;
  } catch (error) {
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors[0].message;
    } else {
      return "Unexpected error occured";
    }
  }
};

exports.getAssignedQuestions = async (questionaireId) => {
  if (questionaireId) {
    let questionaire = await Questionaire.findByPk(questionaireId);
    if (questionaire) {
      const [results, metadata] = await sequelize.query(
        "SELECT * FROM `vw_getquestionairequestions` WHERE `questionaire_id` = " +
          questionaireId.toString()
      );

      return results;
    } else {
      return "Questionaire not found";
    }
  } else {
    return "Questionaire id is required";
  }
};

exports.assignQuestions = async (questions, questionaireId) => {
  if (questionaireId) {
    let questionaire = await Questionaire.findByPk(questionaireId);
    if (questionaire) {
      QuestionaireQuestions.destroy({
        where: {
          questionaire_id: questionaireId,
        },
      });

      questions.map(async (question) => {
        console.log(question, questionaireId);
        await QuestionaireQuestions.create({
          question_id: question,
          questionaire_id: questionaireId,
        });
      });

      return "Success";
    } else {
      return "Questionaire not found";
    }
  } else {
    return "Questionaire id is required";
  }
};

exports.getAll = async () => {
  const total_questions = await getTotalQuestions();
  const total_questionaires = await getTotalQuestionaires();
  const total_topics = await getTotalTopics();
  const total_subtopics = await getTotalSubtopics();

  return {
    ...total_questionaires,
    ...total_questions,
    ...total_topics,
    ...total_subtopics,
  };
};

getTotalQuestions = async () => {
  const total_questions = await sequelize.query(
    "select count(*) as total_questions from questions",
    { type: Sequelize.QueryTypes.SELECT }
  );
  return total_questions[0];
};
getTotalQuestionaires = async () => {
  const total_questionaires = await sequelize.query(
    "select count(*) as total_questionaires from questionaires",
    { type: Sequelize.QueryTypes.SELECT }
  );
  return total_questionaires[0];
};
getTotalTopics = async () => {
  const total_topics = await sequelize.query(
    "select count(*) as total_topics from topics",
    { type: Sequelize.QueryTypes.SELECT }
  );
  return total_topics[0];
};
getTotalSubtopics = async () => {
  const total_subtopics = await sequelize.query(
    "select count(*) as total_subtopics from subtopics",
    { type: Sequelize.QueryTypes.SELECT }
  );
  return total_subtopics[0];
};
