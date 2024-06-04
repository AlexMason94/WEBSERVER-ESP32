const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'operator'], required: true },
    isActivate: { type: Boolean, default: true }, // Campo para manejar la eliminación lógica
    createdAt: { type: Date, default: Date.now }, // Fecha de registro
    loggedOutAt: { type: Date, default: null } // Fecha de último deslogueo
});

userSchema.pre('save', async function(next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 8);
        }
        next();
    } catch (error) {
        next(error); // Pass the error to Express error handling middleware
    }
});

// Método para comparar la contraseña ingresada con la hasheada
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
