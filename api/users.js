const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');
const router = express.Router();
const userController = require('../controllers/users');


// check-username-available
router.post('/api/users/check-username-available', asyncMiddleware( async (req, res, next) => {
	const username = req.body.username.toLowerCase();
	const user = await userController.checkUsernameAvailable(username);
	if (!user) {
		res.status(200).json({ 
			'status': 'ok',
			'message' : 'Username available' 
		});				
	}else{
		res.status(401).json({ 
			'message': 'Username taken' 
		});
	}
}));

// check-email-available
router.post('/api/users/check-email-available', asyncMiddleware( async (req, res, next) => {
	const email = req.body.email.toLowerCase();
	const user = await userController.checkEmailAvailable(email);
	if (!user) {
		res.status(200).json({ 
			'status': 'ok',
			'message': 'Email available' 
		});				
	}else{
		res.status(401).json({ 
			'message': 'Email already registered' 
		});
	}
}));

// signup
router.post('/api/users/signup', asyncMiddleware( async (req, res, next) => {
	const username = req.body.username.toLowerCase();
	const email = req.body.email.toLowerCase();
	const { password } = req.body;

	// check username and email available
	let email_check = await userController.checkEmailAvailable(email);
	let username_check = await userController.checkUsernameAvailable(username);
	if (email_check) {
		res.status(401).json({ 
			'message': 'Email already registered, please login or try again'
		});
	}else if (username_check) {
		res.status(401).json({ 
			'message': 'Username taken, please try again' 
		});
	}else {
		// attempt create user
		await UserModel.create({ 
			username: username, 
			email: email, 
			password 
		});
		res.status(200).json({ 
			'status': 'ok', 
			'message': 'User created' 
		});
	}
}));

// login
router.post('/api/users/login', asyncMiddleware(async (req, res, next) => {
	const username = req.body.username.toLowerCase();
	const { password } = req.body;

	// check given value against username and email fields
	let user = await UserModel.findOne({ username : username });
	if (!user) {
		user = await UserModel.findOne({ email : username });
	}
	if (!user) {
		res.status(401).json({
			'message': 'User not found' 
		});
		return;
	}
	const validate = await user.isValidPassword(password);
	if (!validate) {
		res.status(401).json({ 
			'message': 'Incorrect password'
		});
		return;
	}
	res.status(200).json({ 
		'status': 'ok',
		'message': 'User logged in',
		'user': {
			_id: user._id, 
			username: user.username, 
			// email: user.email, 
			// password: user.password
		}
	});
}));

module.exports = router;
