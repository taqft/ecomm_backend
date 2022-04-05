const { Tag } = require('../models');

const tagList = [
  {
    tag_name: 'sing along',
  },
  {
    tag_name: 'red',
  },
  {
    tag_name: 'green',
  },
  {
    tag_name: 'yellow',
  },
];

const seedTags = () => Tag.bulkCreate(tagList);

module.exports = seedTags;
