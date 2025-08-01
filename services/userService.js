const bcrypt = require('bcrypt');
const User = require('../models/userModel');

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    validateRegister(user) {
        const errors = {};

        if (!user.name || user.name.trim().length < 2) {
            errors.name = 'Le nom doit contenir au moins 2 caractères';
        }

        if (!user.email || user.email.trim() === '') {
            errors.email = 'L\'adresse mail est requise';
        }

        if (!user.password || user.password.length < 6) {
            errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        return errors;
    }

    async register(data) {
        const user = new User(data);
        const errors = this.validateRegister(user);

        if (Object.keys(errors).length > 0) {
            return { success: false, errors, data };
        }

        const existingUser = await this.userRepository.findByEmail(user.email);
        if (existingUser) {
            return {
                success: false,
                errors: { email: "L'utilisateur avec cette adresse mail existe déjà" },
                data
            };
        }

        await this.userRepository.create(user);
        return { success: true };
    }

    async login(email, password) {
        const errors = {};

        if (!email || email.trim() === '') {
            errors.email = 'Email requis';
        }

        if (!password) {
            errors.password = 'Mot de passe requis';
        }

        if (Object.keys(errors).length > 0) {
            return { success: false, errors, data: { email } };
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return { success: false, errors: { email: 'Utilisateur introuvable' }, data: { email } };
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return { success: false, errors: { password: 'Mot de passe incorrect' }, data: { email } };
        }

        return { success: true, user };
    }
}

module.exports = UserService;





// const fs = require('fs');
// const path = require('path');

// class UserService {
//     constructor() {
//         this.usersFile = path.join(__dirname, '../data/users.json');
//     }

//     // Read users
//     getAllUsers() {
//         const data = fs.readFileSync(this.usersFile, 'utf-8');
//         return JSON.parse(data);
//     }

//     // Add a new user
//     saveUser(user) {
//         const users = this.getAllUsers();
//         users.push(user);
//         fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2), 'utf-8');
//     }

// }

// module.exports = new UserService();
