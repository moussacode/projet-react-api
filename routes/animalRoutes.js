const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Importer le middleware
const {
  getAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getAvailableAnimals
} = require('../controllers/animalController');

// Route publique (sans authentification)
router.get('/available', getAvailableAnimals);
// Appliquer le middleware à toutes les routes
router.use(protect);

router.route('/')
  .get(getAnimals) // req.user sera disponible ici
  .post(createAnimal);

router.route('/:id')
  .put(updateAnimal)
  .delete(deleteAnimal);

module.exports = router;

module.exports = router;