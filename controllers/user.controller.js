const { User } = require("../models");
const { v4: uuidv4 } = require("uuid");

const filterOptions = [
  "starts with",
  "contains",
  "ends with",
  "equal",
  "not equal",
  "greater than",
  "less than",
];

exports.getAllUsers = async () => {
  return await User.findAll();
};

exports.ChangeStatus = async (req) => {
  const user = await this.getUserById(req.params.id);
  if (user) {
    user.is_active = !user.is_active;
    await user.save();
    return await this.getUserById(user.uuid);
  } else {
    return false;
  }
};

exports.getUserById = async (pkId) => {
  if (!pkId) {
    return false;
  }

  return await User.findOne({
    where: {
      uuid: pkId,
    },
  });
};
exports.getUsersByFilter = async (filters) => {
  if (!filters) {
    return false;
  }
  const dbStructure = await User.describe();

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

  return await User.findAll({
    where: {
      ...whereClause,
    },
  });
};
exports.delUserById = async (pkId) => {
  if (!pkId) {
    return false;
  }
  const delUser = await this.getUserById(pkId);
  if (delUser) {
    await delUser.destroy();
    return true;
  } else {
    return false;
  }
};
exports.storeNewUser = async (input) => {
  try {
    const newuser = await User.create({
      uuid: uuidv4(),
      first_name: input.first_name,
      last_name: input.last_name,
      gender: input.gender,
      birth_year: input.birth_year,
      email: input.email,
      phone: input.phone,
      is_active: input.is_active,
    });

    return newuser;
  } catch (error) {
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors[0].message;
    } else {
      return "Unexpected error occured";
    }
  }
};

// exports.storeBulkTopics = async (req) => {
//   const tableName = `topics_${Date.now().toString()}`;
//   const data = [...req.body.data];
//   const tableScript = `create table ${tableName}
//                         select topic, is_active from topics where 1 = 0`;

//   const ex = await sequelize.query(tableScript);
//   let insertQuery = `insert into ${tableName} (topic, is_active) values `;

//   data.map((row, index) => {
//     insertQuery = `${insertQuery} ('${row.topic}',${row.is_active})`;
//     if (index < data.length - 1) {
//       insertQuery = `${insertQuery},`;
//     }
//   });

//   let ins = await sequelize.query(insertQuery);

//   insertQuery = `insert into topics (topic, is_active, createdAt, updatedAt)
//                   select topic, is_active, now(), now() from ${tableName}
//                   where (topic not in (select topic from topics))`;
//   ins = await sequelize.query(insertQuery);

//   return ins;
// };

exports.updateUser = async (input, pkId) => {
  const currentUser = await this.getUserById(pkId);

  try {
    await currentUser.update({
      first_name: input.first_name,
      last_name: input.last_name,
      gender: input.gender,
      birth_year: input.birth_year,
      email: input.email,
      phone: input.phone,
      is_active: input.is_active,
    });

    return await this.getUserById(currentUser.uuid);
  } catch (error) {
    console.log(error);
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors[0].message;
    } else {
      return "Unexpected error occured";
    }
  }
};
