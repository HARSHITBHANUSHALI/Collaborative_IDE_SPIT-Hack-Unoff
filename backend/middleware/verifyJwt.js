const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
   let token = req.headers['authorization']?.split(' ')[1] || req.cookies?.jwt;
   
   if (!token) {
       return res.status(401).json({ message: 'No token provided' });
   }

   try {
       const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
       
       req.user = {
           id: decoded.id,
           name: decoded.name,
           email: decoded.email, 
       };
       
       next();
   } catch (error) {
       return res.status(403).json({ message: 'Invalid or expired token' });
   }
};

module.exports = verifyJWT;