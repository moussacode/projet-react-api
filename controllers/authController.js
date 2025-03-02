const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Inscription utilisateur
exports.register = async (req, res) => {
  console.log(req.body);
  try {
    const { fullName, username, password, role } = req.body;
    
    if (!fullName || !username || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }


    // Création de l'utilisateur
    const user = await User.create({
      fullName,
      username,
      password,
      role,
    });

    // Création du token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      message: error.message.includes('duplicate') 
        ? "Ce nom d'utilisateur existe déjà" 
        : "Erreur lors de la création du compte"
    });
  }
};

// Connexion utilisateur
exports.login = async (req, res) => {
  try {
    console.log("🟢 Tentative de connexion avec:", req.body);
    const { username, password } = req.body;

    // Vérification de l'existence de l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      console.log("🔴 Utilisateur non trouvé");
      return res.status(401).json({ message: "Identifiants invalides" });

    }

    // Vérification du mot de passe
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("🔴 Mot de passe incorrect");
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    console.log("🟢 Connexion réussie !");

    // Génération du token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role , username: user.username, fullName: user.fullName},
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      token
    });

  } catch (error) {
    console.error("❌ Erreur serveur:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};