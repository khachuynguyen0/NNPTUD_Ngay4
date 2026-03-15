var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/categories');
let { authMiddleware } = require('../middlewares/auth');
const { default: slugify } = require('slugify');

// READ ALL - Lay tat ca danh muc chua bi xoa
router.get('/', async function (req, res, next) {
    let result = await categoryModel.find({ isDeleted: false });
    res.send(result);
});

// READ ONE - Lay 1 danh muc theo ID
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await categoryModel.findOne({ isDeleted: false, _id: id });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// CREATE - Them danh muc moi (yeu cau xac thuc)
router.post('/', authMiddleware, async function (req, res, next) {
    try {
        let newCate = new categoryModel({
            name: req.body.name,
            slug: slugify(req.body.name, {
                replacement: '-',
                remove: undefined,
                lower: true,
                strict: false,
            }),
            description: req.body.description,
            image: req.body.image,
        });
        await newCate.save();
        res.send(newCate);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// UPDATE - Cap nhat danh muc theo ID (yeu cau xac thuc)
router.put('/:id', authMiddleware, async function (req, res, next) {
    try {
        let id = req.params.id;
        if (req.body.name) {
            req.body.slug = slugify(req.body.name, {
                replacement: '-',
                remove: undefined,
                lower: true,
                strict: false,
            });
        }
        let updatedItem = await categoryModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        res.send(updatedItem);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// DELETE - Xoa mem danh muc theo ID (yeu cau xac thuc)
router.delete('/:id', authMiddleware, async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await categoryModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!updatedItem) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        res.send(updatedItem);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

module.exports = router;
