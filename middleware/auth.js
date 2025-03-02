const jwt = require('jsonwebtoken');


exports.protect = async (req, res, next) => {
  let token;

  // 1. Vérifier si le token est présent dans les en-têtes
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Si aucun token n'est trouvé
  if (!token) {
    return res.status(401).json({
      message: 'Accès non autorisé. Veuillez vous connecter.',
    });
  }

  try {
    // 3. Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Ajouter l'utilisateur à la requête
    req.user = {
      id: decoded.id,
      role: decoded.role,
      username: decoded.username,
    };

    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    res.status(401).json({
      message: 'Token invalide ou expiré. Veuillez vous reconnecter.',
    });
  }
};

// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Unauthorized access' });
//     }
//     next();
//   };
// };
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Accès interdit pour le rôle ${req.user.role}`
      });
    }
    next();
  };
};