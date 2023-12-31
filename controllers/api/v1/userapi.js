const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function (req, res) {
    try {

        let user = await User.findOne({ email: req.body.email });
        if (!user || user.password != req.body.password) {
            return res.json(422, {
                message: "Invalid Username and Password"
            });
        }
        return res.json(200, {
            message: "Sign In Successfully, here is token keep it safe",
            data: {
                token: jwt.sign(user.toJSON(), "slcode", { expiresIn: '100000' })
            }
        })

    } catch (err) {

        console.log('Error in userapi***', err);
        return res.json(500, {
            message: "Internal server Error"
        })
    }
}