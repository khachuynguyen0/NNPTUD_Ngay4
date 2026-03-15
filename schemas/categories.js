let mongoose = require('mongoose');
let categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "ten khong duoc trung"],
        required: [true, "ten khong duoc rong"]
    },
    slug: {
        type: String,
        unique: [true, "slug khong duoc trung"],
        required: [true, "slug khong duoc rong"]
    },
    description: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: "https://i.imgur.com/ZANVnHE.jpeg"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
module.exports = new mongoose.model('category', categorySchema);
