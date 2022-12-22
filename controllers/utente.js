const Utente = require('../models/utente'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const crypto = require('crypto');

// login
const login = async (req, res) => {
	// find the user
	let user = await Utente.findOne({ username: req.body.username }).exec()

	// user not found
	if (user.length == 0) {
		console.log("User not found");
		res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });
	}

	// check if password hashes match
	let hash = crypto.createHash('sha256').update(req.body.password).digest('hex');

	if (user.hash_password != hash) {
		res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
	}

	// if user is found and password is right create a token
	var payload = {
		username: user.username,
		id: user._id
		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	res.status(200).json({
		success: true,
		message: 'Enjoy your token!',
		token: token
	});

};

// signup
const signup = async (req, res) => {
	if (!req.body.username || !req.body.password || !req.body.email || !req.body.numero_tel) {
		res.status(400).json({ success: false, message: 'Please, pass a username, password, email and phone number.' });
		return;
	}
	// check if username is already taken
	let user;
	await Utente.findOne({ username: req.body.username }).exec().then((result) => {
		user = result;
	}).catch((err) => {
		res.status(500).json({ Error: "Internal server error: " + err });
	});

	if (user) {
		res.status(409).json({ success: false, message: 'Username already taken.' });
		return;
	}

	// create a new user
	let newUser = new Utente({
		username: req.body.username,
		hash_password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
		email: req.body.email,
		numero_tel: req.body.numero_tel,
		ruolo: "user",
		nomi_organizzazioni: []
	});

	// save the user
	newUser.save((err) => {
		if (err) {
			res.status(500).json({ Error: "Internal server error: " + err });
		}
		res.status(201).json({ success: true, message: 'User created successfully.' });
	});
};

const tokenChecker = function (req, res, next) {
	// header or url parameters or post parameters
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (!token) res.status(401).json({ success: false, message: 'No token provided.' })
	// decode token, verifies secret and checks expiration
	jwt.verify(token, process.env.SUPER_SECRET, function (err, decoded) {
		if (err) res.status(403).json({ success: false, message: 'Token not valid' })
		else {
			// if everything is good, save in req object for use in other routes
			req.loggedUser = decoded;
			next();
		}
	});
};

const logout = (req, res) => {
	// TODO
};

const getUtenteById = (req, res) => {
	// TODO
};

module.exports = {
	login: login,
	signup: signup, 
	tokenChecker:tokenChecker,
	logout: logout,
	getUtenteById: getUtenteById
};