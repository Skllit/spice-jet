// backend/middleware/admin.js
exports.admin = (req, res, next) => {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message:'Admin only' });
    next();
  };
  