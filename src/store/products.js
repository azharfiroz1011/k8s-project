'use strict';

// In-memory store — swap for a DB later without touching routes
let products = [
  { id: 1, name: 'Widget A',    description: 'A great widget',   price: 9.99  },
  { id: 2, name: 'Gadget B',    description: 'A useful gadget',  price: 49.99 },
  { id: 3, name: 'Doohickey C', description: 'A fun doohickey',  price: 4.99  },
];
let nextId = 4;

const findById = (id) => products.find((p) => p.id === id);

const getAll  = ()       => [...products];
const getById = (id)     => findById(id);

const create  = (data)   => {
  const product = { id: nextId++, ...data };
  products.push(product);
  return product;
};

const update  = (id, data) => {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { id, ...data };
  return products[idx];
};

const remove  = (id)     => {
  const len = products.length;
  products = products.filter((p) => p.id !== id);
  return products.length < len;
};

module.exports = { getAll, getById, create, update, remove };
