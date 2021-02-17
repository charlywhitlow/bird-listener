function checkAdminUser(req, res, next){
    if (!req.user.admin) {
        res.redirect('/menu'); // TODO: flash error
        return;
    }
    next();
}

module.exports = { checkAdminUser };