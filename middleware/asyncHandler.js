// Middleware pour gérer les erreurs async/await
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error(err.stack);
      res.status(500).json({ 
        success: false,
        message: err.message || 'Erreur serveur' 
      });
    });
  };
  
  module.exports = asyncHandler;