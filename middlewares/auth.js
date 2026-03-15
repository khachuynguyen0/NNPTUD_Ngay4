let jwt = require('jsonwebtoken');
let JWT_SECRET = process.env.JWT_SECRET || 'nnptud-c4-secret-key';

// Middleware xac thuc JWT
function authMiddleware(req, res, next) {
    let token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ message: "Khong co token, truy cap bi tu choi" });
    }

    // Ho tro dinh dang "Bearer <token>"
    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    try {
        let decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ message: "Token khong hop le" });
    }
}

// Middleware kiem tra quyen admin
function adminMiddleware(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).send({ message: "Khong co quyen truy cap" });
    }
}

module.exports = { authMiddleware, adminMiddleware };
