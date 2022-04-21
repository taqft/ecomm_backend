const router = require('express').Router();
const { Category, Product, Tag, ProductTag } = require('../../../models');

router.get('/', async (req, res) => {
  // Get all products along with Category and Tag data
  try {
    const products = await Product.findAll({
      include: [{
          model: Category,
          attributes: ['category_name'],
        },
        {
          model: Tag,
          attributes: ['tag_name'],
        }
      ],
    })
    res.status(200).json(products);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.get('/:id', async (req, res) => {
  // Get a single product by its id along with Category and Tag data
  const id = req.params.id;
  try {
    const product = await Product.findByPk(id, {
        include: [{
            model: Category,
            attributes: ['id', 'category_name']
          },
          {
            model: Tag,
            attributes: ['tag_name']
          }
        ],
      }
    );
    res.status(200).json(product);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.post('/', (req, res) => {
  // Create a new product
  const { product_name, price, stock, tagIds } = req.body;
  // Validate that the required info to create a new product was passed
  if(!product_name || !price || !stock || !tagIds ) {
    return res.status(400).json({
      error: `You must provide the product_name, price, stock, and tagIds in the following format:
    {
      product_name: "Juicy New Item",
      price: 99.99,
      stock: 10,
      tagIds: [1, 2, 3]
    }`
    });
  }
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      } else {
        res.status(200).json(product);
      }
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((e) => {
      console.log(e);
      res.status(400).json(e);
    });
});

router.put('/:id', (req, res) => {
  // Update a product by its id
  Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    .then((product) => {
      return ProductTag.findAll({
        where: {
          product_id: req.params.id
        }
      });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({
        tag_id
      }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({
          id
        }) => id);

      return Promise.all([
        ProductTag.destroy({
          where: {
            id: productTagsToRemove
          }
        }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))

    .catch((e) => {
      res.status(400).json(e);
    });
});

router.delete('/:id', async (req, res) => {
  // Delete a product by its id
  try {
    const deletedProduct = await Product.findByPk(req.params.id);
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(deletedProduct);
  } catch (e) {
    res.status(400).json(e)
  }
});

module.exports = router;
