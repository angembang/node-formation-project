const express = require('express');
const router = express.Router();

const RiddleService = require('../services/riddleService');
const riddleService = new RiddleService();

// Check if the user is connected
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    return res.redirect('/login');
}

// Route GET /devinette
router.get('/devinette', isAuthenticated, (req, res) => {
    res.render('devinette', {
        message: null,
        isWin: false,
        guessedNumber: null,
        user: req.session.user 
    });
});

// Route POST /devinette
router.post('/devinette', isAuthenticated, (req, res) => {
    const { number } = req.body;
    const result = riddleService.checkNumber(number);

    res.render('devinette', {
        message: result.message,
        isWin: result.isWin || false,
        guessedNumber: result.guessedNumber || null,
        user: req.session.user
    });
});

module.exports = router;