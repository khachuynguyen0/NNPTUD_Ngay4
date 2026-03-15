let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "ten khong duoc rong"]
    },
    email: {
        type: String,
        unique: [true, "email khong duoc trung"],
        required: [true, "email khong duoc rong"]
    },
    password: {
        type: String,
        required: [true, "mat khau khong duoc rong"]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ma hoa mat khau truoc khi luu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// So sanh mat khau
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = new mongoose.model('user', userSchema);
