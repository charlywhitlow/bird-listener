const UserModel = require(__root + '/models/userModel');

async function checkEmailAvailable(email) {
	const user = await UserModel.findOne({ email : email.toLowerCase() });
	return user;
}

async function checkUsernameAvailable(username) {
	const user = await UserModel.findOne({ username : username.toLowerCase() });
	return user;
}

module.exports = {
    checkEmailAvailable,
    checkUsernameAvailable
};