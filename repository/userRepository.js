const bcrypt = require('bcrypt');
const User = require('../models/userModel');

class UserRepository {
    constructor(mongoService) {
        this.mongoService = mongoService;
        this.collectionName = 'users';
    }

    async findByEmail(email) {
        const users = await this.mongoService.getCollection(this.collectionName);
        const userData = await users.findOne({ email });

        // if exists, return an instance of user, otherwise, return null
        return userData ? new User(userData) : null;
    }

    async create(user) {
        if (!(user instanceof User)) {
            throw new Error('L\'objet fourni doit être une instance de User');
        }

        const users = await this.mongoService.getCollection(this.collectionName);
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const result = await users.insertOne({
            name: user.name,
            email: user.email,
            password: hashedPassword
        });

        return result.insertedId;
    }

}

module.exports = UserRepository;
