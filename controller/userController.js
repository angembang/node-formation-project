const express = require('express');
const router = express.Router();

const MongoService = require('../services/mongoService');
const UserRepository = require('../repository/userRepository');
const UserService = require('../services/userService');

router.get('/register', (req, res) => {
    res.render('register', { errors: {}, data: {} });
});

router.get('/login', (req, res) => {
    res.render('login', { errors: {}, data: {} });
});

router.post('/register', async (req, res) => {
    const mongoService = new MongoService();
    const userRepository = new UserRepository(mongoService);
    const userService = new UserService(userRepository);

    try {
        const result = await userService.register(req.body);
        if (!result.success) {
            return res.render('register', { errors: result.errors, data: result.data });
        }

        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    } finally {
        await mongoService.close();
    }
});

router.post('/login', async (req, res) => {
    const mongoService = new MongoService();
    const userRepository = new UserRepository(mongoService);
    const userService = new UserService(userRepository);

    try {
        const { email, password } = req.body;
        const result = await userService.login(email, password);

        if (!result.success) {
            return res.render('login', { errors: result.errors, data: result.data });
        }

        req.session.user = {
            id: result.user._id,
            name: result.user.name,
            email: result.user.email
        };

        res.redirect('/devinette');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    } finally {
        await mongoService.close();
    }
});

module.exports = router;
