

const passport = require('passport');
const User = require('../models/User');


exports.get_user = async (req, res) => {
    const id = req.params.id;

try {
	    const USER = await User.findOne({$where: {id: id}})
	
	    if(!USER){ return res.send('Something went wrong!!!')}
	
	    return USER

} catch (error) {
	console.log(error);
    return res.status(400).send('Something went wrong!!!')
}
}

//delete a user by id
exports.delete_user = async (req, res) => {

    const id = req.body.id;

try {
	    const USER = await User.findOne({$where: {id: id}})
	
	    if(!USER){ return res.send('Something went wrong!!!')}
	
	    USER.deleteOne()
	
	    return res.send('success');

} catch (error) {
	console.log(error);
    return res.status(400).send('Something went wrong!!!')
}
}