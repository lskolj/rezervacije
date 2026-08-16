const jwt = require('jsonwebtoken');

function provjeriPrijavu(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 

  if (!token) {
    return res.status(401).json({ error: 'Niste prijavljeni.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token nije valjan.' });
    }
    req.user = user; // 
    next();
  });
}

function provjeriAdmina(req, res, next) {
  if (req.user.uloga !== 'administrator') {
    return res.status(403).json({ error: 'Nemate ovlasti za ovu akciju.' });
  }
  next();
}

module.exports = { provjeriPrijavu, provjeriAdmina };