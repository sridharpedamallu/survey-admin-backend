const { Topic, sequelize } = require("../models");

const filterOptions = [
  "starts with",
  "contains",
  "ends with",
  "equal",
  "not equal",
  "greater than",
  "less than",
];

exports.getAllTopics = async () => {
  return await Topic.findAll();
};

exports.ChangeStatus = async (req) => {
  const topic = await Topic.findByPk(req.params.id);
  if (topic) {
    topic.is_active = !topic.is_active;
    await topic.save();
    return await this.getTopicById(topic.id);
  } else {
    return false;
  }
};

exports.getTopicById = async (pkId) => {
  if (!pkId) {
    return false;
  }

  return await Topic.findByPk(pkId);
};
exports.getTopicsByFilter = async (filters) => {
  if (!filters) {
    return false;
  }
  const dbStructure = await Topic.describe();

  let fields = Object.keys(dbStructure);
  let searchCriteria = {};

  for (const [key, value] of Object.entries(fields)) {
    if (filters[value]) {
      searchCriteria[value] = filters[value];
    }
  }

  for (const [key, value] of Object.entries(searchCriteria)) {
    if (!value?.operation || !filterOptions.includes(value.operation)) {
      searchCriteria[key] = {
        ...searchCriteria[key],
        operation: "starts with",
      };
    }
  }

  let whereClause = {};
  for (const [key, value] of Object.entries(searchCriteria)) {
    switch (value.operation.toLowerCase()) {
      case "ends with":
        whereClause[key] = { [Op.like]: "%" + value.value.toLowerCase() };
        break;
      case "contains":
        whereClause[key] = { [Op.like]: "%" + value.value.toLowerCase() + "%" };
        break;
      case "equal":
        whereClause[key] = { [Op.eq]: value.value.toLowerCase() };
        break;
      case "not equal":
        whereClause[key] = { [Op.ne]: value.value.toLowerCase() };
        break;
      case "greater than":
        whereClause[key] = { [Op.gt]: value.value.toLowerCase() };
        break;
      case "less than":
        whereClause[key] = { [Op.lt]: value.value.toLowerCase() };
        break;
      default:
        whereClause[key] = { [Op.like]: value.value + "%" };
        break;
    }
  }

  return await Topic.findAll({
    where: {
      ...whereClause,
    },
  });
};
exports.delTopicById = async (pkId) => {
  if (!pkId) {
    return false;
  }
  const delTopic = await this.getTopicById(pkId);
  if (delTopic) {
    await delTopic.destroy();
    return true;
  } else {
    return false;
  }
};
exports.storeNewTopic = async (input) => {
  try {
    const newtopic = await Topic.create({
      topic: input.topic,
      is_active: input.is_active,
    });

    return newtopic;
  } catch (error) {
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors[0].message;
    } else {
      return "Unexpected error occured";
    }
  }
};

exports.storeBulkTopics = async (req) => {
  const tableName = `topics_${Date.now().toString()}`;
  const data = [...req.body.data];
  const tableScript = `create table ${tableName} 
                        select topic, is_active from topics where 1 = 0`;

  const ex = await sequelize.query(tableScript);
  let insertQuery = `insert into ${tableName} (topic, is_active) values `;

  data.map((row, index) => {
    insertQuery = `${insertQuery} ('${row.topic}',${row.is_active})`;
    if (index < data.length - 1) {
      insertQuery = `${insertQuery},`;
    }
  });

  let ins = await sequelize.query(insertQuery);

  insertQuery = `insert into topics (topic, is_active, createdAt, updatedAt) 
                  select topic, is_active, now(), now() from ${tableName} 
                  where (topic not in (select topic from topics))`;
  ins = await sequelize.query(insertQuery);

  return ins;
};

exports.updateTopic = async (input, pkId) => {
  const currentTopic = await this.getTopicById(pkId);

  try {
    await currentTopic.update({
      topic: input.topic,
      is_active: input.is_active,
    });

    return await this.getTopicById(currentTopic.id);
  } catch (error) {
    console.log(error);
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors[0].message;
    } else {
      return "Unexpected error occured";
    }
  }
};
