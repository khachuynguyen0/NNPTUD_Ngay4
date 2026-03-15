var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');
let { authMiddleware, adminMiddleware } = require('../middlewares/auth');

/* GET users listing - Chi admin moi xem duoc */
router.get('/', authMiddleware, adminMiddleware, async function (req, res, next) {
    let users = await userModel.find({ isDeleted: false }).select('-password');
    res.send(users);
});

/* GET user by ID */
router.get('/:id', authMiddleware, async function (req, res, next) {
    try {
        let id = req.params.id;
        // Chi cho phep xem thong tin cua chinh minh hoac admin
        if (req.user._id.toString() !== id && req.user.role !== 'admin') {
            return res.status(403).send({ message: "Khong co quyen truy cap" });
        }
        let user = await userModel.findOne({ _id: id, isDeleted: false }).select('-password');
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

module.exports = router;
