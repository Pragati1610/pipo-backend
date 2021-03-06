const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const schema = {
  postId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  image: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  description: { type: DataTypes.STRING(2000) },
  badgeName: { type: DataTypes.STRING },
  postNumber: { type: DataTypes.INTEGER },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), default: [] },
  upvotes: { type: DataTypes.ARRAY(DataTypes.UUID), default: [] }
}

const options = {
  timestamps: true,
  createdAt: 'createDate',
  updatedAt: 'updatedDate'
}

const post = sequelize.define('Post', schema, options)

module.exports = post
