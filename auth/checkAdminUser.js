const UserModel = require(__root + '/models/userModel');


async function checkAdminUser(req, res, next){
    let user = await UserModel.findOne(
        { email: req.user.email }, 
        { admin: 1 }
    );
    if (!user.admin) {
        console.log('not authorised')
        res.redirect('/menu'); // TODO: flash error
        return;
    }
    next();
}

module.exports = { checkAdminUser };