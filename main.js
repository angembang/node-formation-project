const express = require('express');
const session = require('express-session');
const path = require('path');

const userRoutes = require('./controller/userController'); 
const riddleController = require('./controller/riddleController');

const app = express();
// const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'maCléSuperSecrète',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Routes
app.use('/', userRoutes); 
app.use('/', riddleController);

// app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});





