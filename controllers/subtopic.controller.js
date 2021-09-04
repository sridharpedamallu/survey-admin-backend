const { Topic, Subtopic, sequelize } = require("../models");
const { Op } = require("sequelize");

const filterOptions = [
  "starts with",
  "contains",
  "ends with",
  "equal",
  "not equal",
  "greater than",
  "less than",
];

exports.getAllSubTopics = async () => {
  return await Subtopic.findAll({
    include: {
      model: Topic,
      attributes: ["id", "topic", "is_active"],
    },
  });
};

exports.ChangeStatus = async (req) => {
  const subtopic = await Subtopic.findByPk(req.params.id);
  if (subtopic) {
    subtopic.is_active = !subtopic.is_active;
    await subtopic.save();
    return await this.getSubTopicById(subtopic.id);
  } else {
    return false;
  }
};

exports.getSubTopicById = async (pkId) => {
  if (!pkId) {
    return false;
  }

  return await Subtopic.findByPk(pkId, {
    include: {
      model: Topic,
      attributes: ["id", "topic", "is_active"],
    },
  });
};
exports.getSubTopicsByFilter = async (filters) => {
  if (!filters) {
    return false;
  }
  const dbStructure = await Subtopic.describe();
  let fields = Object.keys(dbStructure);
  let searchCriteria = filters.filters;

  let whereClause = {};
  for (const [key, value] of Object.entries(searchCriteria)) {
    switch (value.operation.toLowerCase()) {
      case "ends with":
        whereClause[value.column] = {
          [Op.like]: "%" + value.data.toString().toLowerCase(),
        };
        break;
      case "contains":
        whereClause[value.column] = {
          [Op.like]: "%" + value.data.toString().toLowerCase() + "%",
        };
        break;
      case "equal":
        whereClause[value.column] = {
          [Op.eq]: value.data.toString().toLowerCase(),
        };
        break;
      case "not equal":
        whereClause[value.column] = {
          [Op.ne]: value.data.toString().toLowerCase(),
        };
        break;
      case "greater than":
        whereClause[value.column] = {
          [Op.gt]: value.data.toString().toLowerCase(),
        };
        break;
      case "less than":
        whereClause[value.column] = {
          [Op.lt]: value.data.toString().toLowerCase(),
        };
        break;
      default:
        whereClause[value.column] = {
          [Op.like]: value.data.toString().toLowerCase() + "%",
        };
        break;
    }
  }

  return await Subtopic.findAll({
    where: {
      ...whereClause,
    },
  });
};
exports.delSubTopicById = async (pkId) => {
  if (!pkId) {
    return false;
  }
  const delSubTopic = await this.getSubTopicById(pkId);
  if (delSubTopic) {
    await delSubTopic.destroy();
    return true;
  } else {
    return false;
  }
};
exports.storeNewSubTopic = async (input) => {
  try {
    const newsubtopic = await Subtopic.create({
      subtopic: input.subtopic,
      topic_id: input.topic_id,
      is_active: input.is_active,
    });

    return newsubtopic;
  } catch (error) {
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors[0].message;
    } else {
      return "Unexpected error occured";
    }
  }
};

exports.storeBulkTopics = async (req) => {
  const tableName = `subtopics_${Date.now().toString()}`;
  const data = [...req.body.data];
  const tableScript = `create table ${tableName} 
                      select subtopic, topic_id, is_active from subtopics where 1 = 0`;

  const ex = await sequelize.query(tableScript);
  let insertQuery = `insert into ${tableName} (subtopic, topic_id, is_active) values `;

  data.map((row, index) => {
    insertQuery = `${insertQuery}('${row.subtopic}',${row.topic_id}, ${row.is_active})`;

    if (index < data.length - 1) {
      insertQuery = `${insertQuery},`;
    }
  });

  let ins = await sequelize.query(insertQuery);

  insertQuery = `insert into subtopics (subtopic, topic_id, is_active, createdAt, updatedAt) 
                select subtopic, topic_id, is_active, now(), now() from  ${tableName} 
                where (subtopic not in (select subtopic from subtopics))`;
  ins = await sequelize.query(insertQuery);

  return ins;
};

exports.updateSubTopic = async (input, pkId) => {
  const currentSubTopic = await this.getSubTopicById(pkId);

  try {
    await currentSubTopic.update({
      subtopic: input.subtopic,
      topic_id: input.topic_id,
      is_active: input.is_active,
    });

    return await this.getSubTopicById(currentSubTopic.id);
  } catch (error) {
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors[0].message;
    } else {
      return "Unexpected error occured";
    }
  }
};
