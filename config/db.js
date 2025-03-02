const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/tabaskimarket", {
      serverSelectionTimeoutMS: 30000, // 30 secondes pour la sélection du serveur
      socketTimeoutMS: 45000, // 45 secondes pour les opérations socket
      connectTimeoutMS: 30000, // 30 secondes pour la connexion initiale
      maxPoolSize: 10, // Nombre maximum de connexions simultanées
      heartbeatFrequencyMS: 10000 // Maintenance régulière de la connexion
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📚 Database Name: ${conn.connection.name}`);
    console.log(`👤 Pool size: ${conn.connection.maxPoolSize}`);

    // Vérification active de la connexion
    await mongoose.connection.db.admin().ping();
    console.log('🗸 Ping successful to MongoDB cluster');

  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('💻 Error code:', err.code);
    console.error('🔗 Connection URI:', process.env.MONGO_URI);
    process.exit(1);
  }
};

// Événements de connexion
mongoose.connection.on('connected', () => {
  console.log('📚 MongoDB Connection Established');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB Connection Lost');
});

mongoose.connection.on('reconnected', () => {
  console.log('♻️  MongoDB Reconnected');
});

module.exports = connectDB;