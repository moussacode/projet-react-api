const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User');
const orderRoutes = require('./routes/orderRoutes')
const adminRoutes = require('./routes/adminRoutes')
const bodyParser = require('body-parser');



dotenv.config();

const app = express();

// Augmenter la limite de taille des requêtes JSON à 50 Mo
app.use(bodyParser.json({ limit: '50mb' }));

// Augmenter la limite de taille des requêtes URL-encoded à 50 Mo
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// Middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Correction de l'URI MongoDB + connexion améliorée
const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tabaskimarket';

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log('✅ Connexion MongoDB établie'))
.catch(err => {
  console.error('❌ Erreur de connexion MongoDB:', err.message);
  process.exit(1);
});




// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/animals', require('./routes/animalRoutes'));
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));