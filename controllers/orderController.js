const mongoose = require('mongoose');
const Order = require('../models/Order');
const Animal = require('../models/Animal');

exports.createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { items } = req.body;
      const userId = req.user.id;
  
      // Validation des entrées
      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('Le panier est vide');
      }
  
      const itemsMap = new Map();
      const errors = [];
  
      // Valider et regrouper les items
      items.forEach((item, index) => {
        if (!item.animalId || !mongoose.Types.ObjectId.isValid(item.animalId)) {
          errors.push(`Item ${index + 1}: ID animal invalide`);
        }
        if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1) {
          errors.push(`Item ${index + 1}: Quantité invalide`);
        }
  
        const key = item.animalId;
        itemsMap.set(key, (itemsMap.get(key) || 0) + item.quantity);
      });
  
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }
  
      // Vérification du stock
      let totalAmount = 0;
      const orderItems = [];
      const stockUpdates = [];
  
      for (const [animalId, quantity] of itemsMap) {
        const animal = await Animal.findById(animalId).session(session);
        
        if (!animal) throw new Error(`Animal ${animalId} introuvable`);
        if (animal.stock < quantity) throw new Error(`Stock insuffisant pour ${animal.name}`);
  
        totalAmount += animal.price * quantity;
        orderItems.push({
          animal: animalId,
          quantity,
          price: animal.price
        });
  
        stockUpdates.push({
          updateOne: {
            filter: { _id: animalId },
            update: { $inc: { stock: -quantity } }
          }
        });
      }
  
      // Mise à jour atomique du stock
      await Animal.bulkWrite(stockUpdates, { session });
  
      // Création de la commande
      const order = new Order({
        user: userId,
        items: orderItems,
        totalAmount,
        status: 'completed'
      });
  
      await order.save({ session });
      await session.commitTransaction();
  
      res.status(201).json(order);
  
    } catch (error) {
      await session.abortTransaction();
      res.status(400).json({ 
        message: error.message,
        errorType: error.name // Ajout du type d'erreur
      });
    } finally {
      session.endSession();
    }
  };

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: 'items.animal',
        select: 'name type price image'
      })
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};