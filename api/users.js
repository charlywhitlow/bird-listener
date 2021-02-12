const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const router = express.Router();
const userCheck = require('../util/userCheck');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET, REFRESH_SECRET } = require('../config/config');

const tokenList = {}; // temp stored locally, TODO: add to db
const tokenExpiry = 300; // 5 mins (user token valid for 5 mins, updated by refreshToken route)
const refreshTokenExpiry = 86400; // 1 day

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
			// log user in
			let {token, refreshToken} = await login(user, res);

			return res.status(200).json({ 
				"message" : 'signup successful',
				token, 
				refreshToken
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
				let {token, refreshToken} = await login(user, res);
	
				// Send token back to the user
				return res.status(200).json({ 
					"message" : "ok",
					token, 
					refreshToken
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
		email: user.email
	};
	const token = jwt.sign({ user: body }, TOKEN_SECRET, { expiresIn: tokenExpiry });
	const refreshToken = jwt.sign({ user: body }, REFRESH_SECRET, { expiresIn: refreshTokenExpiry });

	// store tokens in cookie
	res.cookie('jwt', token);
	res.cookie('refreshJwt', refreshToken);
	res.cookie('username', user.username);
	
	// store tokens in memory
	// Note: for this tutorial, we are storing these tokens in memory, but in practice 
	// you would want to store this data in some type of persistent storage (mongodb sessions table?)
	tokenList[refreshToken] = {
		token,
		refreshToken,
		username: user.username,
		_id: user._id
	};

	return {
		'token' : token,
		'refreshToken': refreshToken
	}
}

// refresh token route
router.post('/api/users/token', (req, res) => {
	const { username, refreshToken } = req.body;

	// if token is valid, update jwt in db and cookie
	if ((refreshToken in tokenList) && (tokenList[refreshToken].username === username)) {
		const body = { username, _id: tokenList[refreshToken]._id };
		const token = jwt.sign({ user: body }, TOKEN_SECRET, { expiresIn: tokenExpiry });
		res.cookie('jwt', token);
	  	tokenList[refreshToken].token = token;
		res.status(200).json({ token });		
	} else {
		// clear cookies and return error
		clearAppCookies(res);
		res.status(401).json({ 
			message: 'Unauthorized'
		});
	}
});

// logout route
router.post('/logout', (req, res) => {
	if (req.cookies) {
		deleteTokens(req);
		clearAppCookies(res);
	}
	res.status(200).json({ message: 'logged out' });
});
function clearAppCookies(res){
	res.clearCookie('refreshJwt');
	res.clearCookie('jwt');
	res.clearCookie('username');
}
function deleteTokens(req){
	const refreshToken = req.cookies['refreshJwt'];
	if (refreshToken in tokenList) delete tokenList[refreshToken] // TODO: db
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
