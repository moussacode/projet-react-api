const Animal = require('../models/Animal');

// Get all animals for current seller
exports.getAnimals = async (req, res) => {
  console.log('Utilisateur authentifié:', req.user);
  try {
    const animals = await Animal.find({ seller: req.user.id });
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



// Create new animal
exports.createAnimal = async (req, res) => {
  try {
    const animal = await Animal.create({ ...req.body, seller: req.user.id });
    res.status(201).json(animal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update animal
exports.updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(animal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete animal
exports.deleteAnimal = async (req, res) => {
  try {
    await Animal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Animal supprimé' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get available animals
exports.getAvailableAnimals = async (req, res) => {
  try {
    const { type, maxPrice } = req.query;

    const filter = { 
      status: 'available',
      stock: { $gt: 0 }
    };

    if (type) filter.type = type;
    if (maxPrice) filter.price = { $lte: maxPrice };

    const animals = await Animal.find(filter)
      .populate('seller', 'fullName')
      .sort('-createdAt');

    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

