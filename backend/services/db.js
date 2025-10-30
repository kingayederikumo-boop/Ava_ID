const { Sequelize, DataTypes } = require('sequelize');

let sequelize;
let models = {};

async function initDB() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set in env');

  sequelize = new Sequelize(url, {
    dialect: 'postgres',
    logging: false,
    pool: { max: 5, min: 0, idle: 10000 }
  });

  // define models
  const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: true },
    displayName: { type: DataTypes.STRING }
  });

  const ID = sequelize.define('ID', {
    title: { type: DataTypes.STRING },
    fileUrl: { type: DataTypes.STRING },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    hederaTx: { type: DataTypes.STRING },
    hypergraphProof: { type: DataTypes.TEXT }
  });

  const Avatar = sequelize.define('Avatar', {
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  });

  const Voice = sequelize.define('Voice', {
    voiceName: DataTypes.STRING,
    voiceId: DataTypes.STRING
  });

  User.hasMany(ID);
  User.hasMany(Avatar);
  await sequelize.sync({ alter: true });

  models = { sequelize, User, ID, Avatar, Voice };
  module.exports.User = User;
  module.exports.ID = ID;
  module.exports.Avatar = Avatar;
  module.exports.Voice = Voice;
  module.exports.sequelize = sequelize;
  return models;
}

module.exports = { initDB };
