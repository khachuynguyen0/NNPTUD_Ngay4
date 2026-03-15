var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// ===================== USER CRUD =====================

// READ ALL - Lấy tất cả user chưa bị xóa mềm
router.get('/', async function (req, res, next) {
    try {
        let result = await userModel.find({ isDeleted: false }).populate('role');
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// READ ONE - Lấy 1 user theo ID
router.get('/:id', async function (req, res, next) {
    try {
        let result = await userModel.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "User không tồn tại" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// CREATE - Tạo user mới
router.post('/', async function (req, res, next) {
    try {
        let newUser = new userModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            status: req.body.status,
            role: req.body.role,
            loginCount: req.body.loginCount
        });
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// UPDATE - Cập nhật user theo ID
router.put('/:id', async function (req, res, next) {
    try {
        let updated = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updated) {
            res.send(updated);
        } else {
            res.status(404).send({ message: "User không tồn tại" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// DELETE - Xóa mềm (soft delete) user theo ID
router.delete('/:id', async function (req, res, next) {
    try {
        let updated = await userModel.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (updated) {
            res.send({ message: "Đã xóa mềm user", user: updated });
        } else {
            res.status(404).send({ message: "User không tồn tại" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// ===================== YÊU CẦU 2 =====================
// POST /users/enable - Kích hoạt user (status = true)
// Body: { email, username }
router.post('/enable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).send({ message: "Cần truyền lên email và username" });
        }
        // Tìm user khớp cả email lẫn username và chưa bị xóa mềm
        let user = await userModel.findOne({ email, username, isDeleted: false });
        if (!user) {
            return res.status(404).send({ message: "Thông tin email hoặc username không đúng" });
        }
        user.status = true;
        await user.save();
        res.send({ message: "Đã kích hoạt tài khoản", user });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// ===================== YÊU CẦU 3 =====================
// POST /users/disable - Vô hiệu hóa user (status = false)
// Body: { email, username }
router.post('/disable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).send({ message: "Cần truyền lên email và username" });
        }
        let user = await userModel.findOne({ email, username, isDeleted: false });
        if (!user) {
            return res.status(404).send({ message: "Thông tin email hoặc username không đúng" });
        }
        user.status = false;
        await user.save();
        res.send({ message: "Đã vô hiệu hóa tài khoản", user });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
