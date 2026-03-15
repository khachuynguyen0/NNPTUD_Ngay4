var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products');
let { authMiddleware } = require('../middlewares/auth');
const { default: slugify } = require('slugify');

// READ ALL - Lay tat ca san pham chua bi xoa
router.get('/', async function (req, res, next) {
    let result = await productModel.find({ isDeleted: false }).populate('category');
    res.send(result);
});

// READ ONE - Lay 1 san pham theo ID
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await productModel.findOne({ isDeleted: false, _id: id }).populate('category');
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// CREATE - Them san pham moi (yeu cau xac thuc)
router.post('/', authMiddleware, async function (req, res, next) {
    try {
        let newProduct = new productModel({
            title: req.body.title,
            slug: slugify(req.body.title, {
                replacement: '-',
                remove: undefined,
                lower: true,
                strict: false,
            }),
            price: req.body.price,
            description: req.body.description,
            images: req.body.images,
            category: req.body.category,
        });
        await newProduct.save();
        res.send(newProduct);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// UPDATE - Cap nhat san pham theo ID (yeu cau xac thuc)
router.put('/:id', authMiddleware, async function (req, res, next) {
    try {
        let id = req.params.id;
        if (req.body.title) {
            req.body.slug = slugify(req.body.title, {
                replacement: '-',
                remove: undefined,
                lower: true,
                strict: false,
            });
        }
        let updatedItem = await productModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        res.send(updatedItem);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// DELETE - Xoa mem san pham theo ID (yeu cau xac thuc)
router.delete('/:id', authMiddleware, async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await productModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!updatedItem) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        res.send(updatedItem);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

module.exports = router;
