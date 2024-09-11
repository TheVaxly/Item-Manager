const express = require('express');
const router = express.Router();
const Item = require('../models/Items');

// @route   POST /api/items
// @desc    Create a new item
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newItem = new Item({
      name,
      description,
    });
    const item = await newItem.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/items
// @desc    Get all items or filter by favorite status
router.get('/', async (req, res) => {
  const { favorite } = req.query;
  const filter = {};

  if (favorite === 'true') {
    filter.isFavorite = true;
  }

  try {
    const items = await Item.find(filter);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/items/:id
// @desc    Update an item
router.put('/:id', async (req, res) => {
  const { name, description, isFavorite } = req.body;
  try {
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.isFavorite = isFavorite !== undefined ? isFavorite : item.isFavorite;

    item = await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete an item
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Attempting to delete item with id: ${req.params.id}`);

    // Find the item
    const item = await Item.findById(req.params.id);
    if (!item) {
      console.log('Item not found');
      return res.status(404).json({ error: 'Item not found' });
    }

    // Delete the item
    await Item.deleteOne({ _id: req.params.id });
    console.log('Item removed successfully');
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Error during delete operation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// @route   PATCH /api/items/:id/favorite
// @desc    Toggle favorite status of an item
router.patch('/:id/favorite', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    item.isFavorite = !item.isFavorite; // Toggle the favorite status
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/items/:id/favorite
// @desc    Remove item from favorites
router.delete('/:id/favorite', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (item.isFavorite) {
      item.isFavorite = false; // Remove from favorites
      await item.save();
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/items/:id
// @desc    Get a single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
