const {
  Topic,
  Subtopic,
  Question,
  QuestionOptions,
  sequelize,
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

exports.getAllQuestions = async () => {
  return await Question.findAll({
    include: [
      {
        model: Subtopic,
        required: true,
        attributes: ["id", "subtopic"],
        include: [
          {
            model: Topic,
            required: true,
            attributes: ["id", "topic"],
          },
        ],
      },
    ],
  });
};

exports.ChangeStatus = async (req) => {
  const question = await Question.findByPk(req.params.id);
  if (question) {
    question.is_active = !question.is_active;
    await question.save();
    return await this.getQuestionById(req.params.id);
  } else {
    return false;
  }
};

exports.getQuestionById = async (pkId) => {
  if (!pkId) {
    return false;
  }

  return await Question.findByPk(pkId, {
    include: [
      {
        model: Subtopic,
        required: true,
        attributes: ["id", "subtopic"],
        include: [
          {
            model: Topic,
            required: true,
            attributes: ["id", "topic"],
          },
        ],
      },
    ],
  });
};
exports.delQuestionById = async (pkId) => {
  if (!pkId) {
    return false;
  }
  const delQuestion = await this.getQuestionById(pkId);
  if (delQuestion) {
    delQuestion.destroy();
    return true;
  } else {
    return false;
  }
};
exports.storeNewQuestion = async (input) => {
  try {
    const newquestion = await Question.create({
      question: input.question,
      question_type: input.question_type,
      subtopic_id: input.subtopic_id,
      is_active: input.is_active,
    });

    this.storeQuestionOptions(input, newquestion.id);

    return newquestion;
  } catch (error) {
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors[0].message;
    } else {
      return "Unexpected error occured";
    }
  }
};

exports.storeQuestionOptions = async (input, question_id) => {
  const tempOptions = [...input.options];
  const updatedOptions = tempOptions.map((opt) => ({
    option: opt.option,
    score: opt.score === "" ? 0 : opt.score,
    question_id,
  }));
  await QuestionOptions.destroy({
    where: {
      question_id,
    },
  });
  await QuestionOptions.bulkCreate([...updatedOptions]);
  return true;
};

exports.storeBulkTopics = async (req) => {
  // const tableName = `questions_${Date.now().toString()}`;
  // const data = [...req.body.data];
  // const tableScript = `create table ${tableName}
  //                       select question, option1, option2, option3, option4,
  //                       option1_score,option2_score, option3_score, option4_score,
  //                       subtopic_id, is_active from questions where 1 = 0`;

  // const ex = await sequelize.query(tableScript);
  // let insertQuery = `insert into ${tableName} (
  //                     question, option1, option2, option3, option4,
  //                     option1_score,option2_score, option3_score, option4_score,
  //                     subtopic_id, is_active) values `;

  // data.map((row, index) => {
  //   insertQuery = `${insertQuery} (
  //                     '${row.question}', '${row.option1}', '${row.option2}', '${row.option3}', '${row.option4}',
  //                     ${row.option1_score},${row.option2_score}, ${row.option3_score}, ${row.option4_score},
  //                     '${row.subtopic_id}',${row.is_active})`;
  //   if (index < data.length - 1) {
  //     insertQuery = `${insertQuery},`;
  //   }
  // });

  // let ins = await sequelize.query(insertQuery);

  // insertQuery = `insert into questions (question, option1, option2, option3, option4,
  //                 option1_score,option2_score, option3_score, option4_score,
  //                 subtopic_id, is_active, createdAt, updatedAt)
  //                 select question, option1, option2, option3, option4,
  //                 option1_score,option2_score, option3_score, option4_score,
  //                 subtopic_id, is_active, now(), now() from ${tableName}`;
  // ins = await sequelize.query(insertQuery);

  // return ins;
  return "to be implemented...";
};

exports.updateQuestion = async (input, pkId) => {
  const currentQuestion = await this.getQuestionById(pkId);

  try {
    await currentQuestion.update({
      question: input.question,
      question_type: input.question_type,
      subtopic_id: input.subtopic_id,
      is_active: input.is_active,
    });

    this.storeQuestionOptions(input, pkId);

    return currentQuestion;
  } catch (error) {
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors[0].message;
    } else {
      return "Unexpected error occured";
    }
  }
};

exports.getQuestionOptions = async (pkId) => {
  const options = await QuestionOptions.findAll({
    where: {
      question_id: pkId,
    },
  });
  return options;
};

exports.getAllQuestionsByType = async (type) => {
  const questions = await Question.findAll({
    where: {
      question_type: type,
    },
    include: [
      {
        model: Subtopic,
        required: true,
        attributes: ["id", "subtopic"],
        include: [
          {
            model: Topic,
            required: true,
            attributes: ["id", "topic"],
          },
        ],
      },
    ],
  });
  return questions;
};
