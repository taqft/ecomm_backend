const { Product } = require('../models');

const productsList = [{
    product_name: 'David Juice Jersey',
    price: 19.99,
    stock: 70,
    category_id: 1,
  },
  {
    product_name: '"Runnin\' From the Juice" Shorts',
    price: 14.99,
    stock: 50,
    category_id: 2,
  },
  {
    product_name: 'Now That\'s What I Call Juice',
    price: 8.99,
    stock: 50,
    category_id: 3,
  },
  {
    product_name: 'Watermelon Hat',
    price: 24.99,
    stock: 40,
    category_id: 4,
  },
  {
    product_name: 'Juicy Joggers',
    price: 79.0,
    stock: 20,
    category_id: 5,
  },
];

const seedProducts = () => Product.bulkCreate(productsList);

module.exports = seedProducts;
