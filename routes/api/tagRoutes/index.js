const router = require('express').Router();
const { Tag, Product } = require('../../../models');

router.get('/', async (req, res) => {
  // Get all tags along with product data
  try {
    const allTags = await Tag.findAll({
      include: [{
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
        order: ['id', 'ASC'],
      }, ],
    });
    res.status(200).json(allTags)
  } catch (e) {
    res.status(400).json(e);
  }
});

router.get('/:id', async (req, res) => {
  // Get a single tag by its id along with product data
  try {
    const tag = await Tag.findByPk(
      req.params.id, {
        include: [{
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
        }]
      });
    res.status(200).json(tag);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.post('/', async (req, res) => {
  // Create a new tag
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.put('/:id', async (req, res) => {
  // Update a tag by its id
  try {
    await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    const tag = await Tag.findByPk(req.params.id);
    res.status(200).json(tag);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.delete('/:id', async (req, res) => {
  // Delete a tag by its id
  try {
    const deletedTag = await Tag.findByPk(req.params.id);
    await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(deletedTag);
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;