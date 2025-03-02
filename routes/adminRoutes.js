// routes/adminRoutes.js
const express = require('express');
const { protect } = require('../middleware/auth');
// const { adminCheck } = require('../middleware/adminCheck'); // À créer


const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAdminAnimals,
  createAnimal,
  updateAnimal, 
  deleteAnimal
} = require('../controllers/adminController');

const router = express.Router();

// Middlewares globaux
 router.use(protect);
// router.use(adminCheck); // Vérification du rôle admin

// Routes utilisateurs
router.route('/users')
  .get(getAllUsers)
  .post(createUser);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

// Routes animaux
router.route('/animals')
  .get(getAdminAnimals)
  .post(createAnimal); // Ajouté

router.route('/animals/:id')
  .put(updateAnimal) // Ajouté
  .delete(deleteAnimal);

module.exports = router;