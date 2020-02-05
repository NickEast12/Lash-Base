
//? Redering the first page and handeling no route
exports.index = (req, res) => {
    res.render('homepage');
}
//? Redering the homepage
exports.homepage = (req, res) => {
    res.render("homepage", { title: 'LashBase' });
};

//? Sending user to user login page 
exports.userLogin = (req, res) => {
    res.render('userLogin', { title: 'userLogin' });
};

exports.sellerLogin = (req, res) => {
    res.render('sellerLogin', { title: 'Welcome Back' });
};

exports.back = (req, res) => {
    res.redirect('/');
}

//! 404 Error handeling


