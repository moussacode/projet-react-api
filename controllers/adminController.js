const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const Animal = require('../models/Animal');
const bcrypt = require('bcryptjs');

// Gestion des utilisateurs
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -__v');
  res.json(users);
});

const createUser = asyncHandler(async (req, res) => {
  const { fullName, username, password, role } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await User.create({
    fullName,
    username,
    password: hashedPassword,
    role
  });

  res.status(201).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    role: user.role
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['fullName', 'username', 'role', 'active'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Mise à jour non autorisée' });
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password -__v');

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  res.json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  res.json({ message: 'Utilisateur supprimé avec succès' });
});

// Gestion des animaux
const getAdminAnimals = asyncHandler(async (req, res) => {
  const animals = await Animal.find()
    .populate('seller', 'fullName')
    .select('-__v')
    .sort('-createdAt');

  res.json(animals);
});

const deleteAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findByIdAndDelete(req.params.id);
  
  if (!animal) {
    return res.status(404).json({ message: 'Animal non trouvé' });
  }

  res.json({ message: 'Animal supprimé avec succès' });
});

// controllers/adminController.js
const createAnimal = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Non authentifié');
      }
    const { name, type, price, stock } = req.body;
    
    const animal = await Animal.create({
      name,
      type,
      price,
      stock,
      seller: req.user._id // Supposons que l'admin soit le vendeur
    });
  
    res.status(201).json(animal);
  });
  
  const updateAnimal = asyncHandler(async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'type', 'price', 'stock'];
    const isValid = updates.every(update => allowedUpdates.includes(update));
  
    if (!isValid) {
      return res.status(400).json({ message: 'Mise à jour non autorisée' });
    }
  
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    if (!animal) {
      return res.status(404).json({ message: 'Animal non trouvé' });
    }
  
    res.json(animal);
  });

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
    createAnimal,
    updateAnimal,
  getAdminAnimals,
  deleteAnimal
};