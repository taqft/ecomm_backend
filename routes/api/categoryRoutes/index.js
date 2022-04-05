const router = require('express').Router();
const { Category, Product } = require('../../../models');

router.get('/', async (req, res) => {
  try {
    // Get all product categories, sorted by id
    const allCategories = await Category.findAll({
      include: [{
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
        order: ['id', 'ASC'],
      }, ],
    })
    res.status(200).json(allCategories);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Get data about a specific category
    const id = req.params.id;
    // Validate that the request contains an id
    if (!id) {
      return res.status(400).json({
        error: 'You must provide an id.'
      });
    }
    const category = await Category.findByPk(
      id,
      {
        include: [{
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
        }, ],
      }
    );
    res.status(200).json(category);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.post('/', async (req, res) => {
  try {
    // Create a new category in the database
    const { category_name } = req.body;
    // Validate that the request contains a category_name
    if (!category_name) {
      return res.status(400).json({
        error: 'You must provide a category_name.'
      });
    }
    const newCategory = await Category.create({ category_name });
    res.status(200).json(newCategory);
  } catch (e) {
    res.status(400).json(e);
    console.log(e);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Update an existing category in the database
    const { category_name } = req.body;
    const id = req.params.id;
    // Validate that the request contains an id and new category_name
    if (!category_name || !id) {
      return res.status(400).json({
        error: 'You must provide an id and a new category_name.'
      });
    }
    await Category.update({ category_name }, {
        where: {
          id
        },
      }
    )
    const category = await Category.findByPk(req.params.id);
    res.status(200).json(category);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Delete a category by its id
    const id = req.params.id;
    // Validate that the request contains an id
    if (!id) {
      return res.status(400).json({
        error: 'You must provide an id.'
      });
    }
    const categoryToDelete = await Category.findByPk(id);
    await Category.destroy({
      where: {
        id
      },
    });
    res.status(200).json(categoryToDelete);
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
