var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');
let jwt = require('jsonwebtoken');

let JWT_SECRET = process.env.JWT_SECRET || 'nnptud-c4-secret-key';

// REGISTER - Dang ky tai khoan moi
router.post('/register', async function (req, res, next) {
    try {
        let { name, email, password } = req.body;
        let existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "Email da ton tai" });
        }
        let newUser = new userModel({ name, email, password });
        await newUser.save();
        res.status(201).send({
            message: "Dang ky thanh cong",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// LOGIN - Dang nhap va nhan token
router.post('/login', async function (req, res, next) {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email, isDeleted: false });
        if (!user) {
            return res.status(401).send({ message: "Email hoac mat khau khong dung" });
        }
        let isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ message: "Email hoac mat khau khong dung" });
        }
        let token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.send({
            message: "Dang nhap thanh cong",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
