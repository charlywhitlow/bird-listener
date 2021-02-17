const express = require('express');
const asyncMiddleware = require(__root + '/middleware/asyncMiddleware');
const router = express.Router();
const userCheck = require(__root + '/util/userCheck');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require(__root + '/config/config');
const tokenExpiry = 86400; // 1 day

// signup route
router.post('/api/users/signup', async (req, res, next) => {
	passport.authenticate('signup', 
	async (err, user, info) => {
		try {
			if (err || !user) {
				return res.status(401).json({ 
					"message" : info.message
				});
			}
			// log user in after signup
			let {token} = await login(user, res);
			return res.status(200).json({ 
				"message" : 'signup successful',
				token
			});
		} catch (error) {
			return next(error);
	  	}
	})(req, res, next);
});

// login route
router.post('/api/users/login', async (req, res, next) => {
	passport.authenticate('login', 
	async (err, user, info) => {
		try {
			if (err || !user) {
				return res.status(401).json({ 
					"message" : info.message
				});
			}
			req.login(user, { session: false }, async (error) => {
				if (error) {
					return next(error);
				}
				let {token} = await login(user, res);
	
				// Send token back to the user
				return res.status(200).json({ 
					"message" : "ok",
					token
				});
			});
		} catch (error) {
			return next(error);
	  	}
	})(req, res, next);
});
function login(user, res){
	const body = {
		_id: user._id,
		admin: user.admin
	};
	const token = jwt.sign({ user: body }, TOKEN_SECRET, { expiresIn: tokenExpiry });
	
	// store token and username in cookie
	res.cookie('jwt', token);
	res.cookie('username', user.username);
	return {
		'token' : token
	}
}

// logout route
router.post('/logout', (req, res) => {
	if (req.cookies) {
		clearAppCookies(res);
	}
	res.status(200).json({ message: 'logged out' });
});
function clearAppCookies(res){
	res.clearCookie('jwt');
	res.clearCookie('username');
}

// check-username-available
router.post('/api/users/check-username-available', asyncMiddleware( async (req, res, next) => {
	const username = req.body.username.toLowerCase();
	const user = await userCheck.checkUsernameAvailable(username);
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
	const user = await userCheck.checkEmailAvailable(email);
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


module.exports = router;
