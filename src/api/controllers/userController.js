

const passport = require('passport');
const User = require('../models/User');
const async = require('async');


exports.user_detail =  (req, res, next) => {
	async.parallel(
		{
		  user(callback) {
			User.findById(req.params.id)
			  .exec(callback);
		  },
		},
		(err, results) => {
		  if (err) {
			return next(err);
		  }
		  if (results.user == null) {
			// No results.
			const err = new Error("User not found");
			err.status = 404;
			return next(err);
		  }
		  // Successful, so render.
		  res.render("user_detail", {
			title: results.user.name,
			user: results.user,
		  });
		}
	  );
}

exports.user_list = (req, res) => {
    User.find({}, "title author")
    .sort({ name: 1 })
    .exec(function (err, list_users) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("book_list", { title: "Book List", user_list: list_users });
    });
  };

//delete a user by id
exports.delete_user = async (req, res) => {

    const id = req.body.id;

try {   
	    const USER = await User.findOne({id: req.user.id})

		if(USER.role !== "admin"){ return res.sendStatus(403) }
		
	    const USER_TO_DELETE = await User.findOne({id: id})
	
	    if(!USER_TO_DELETE){ return res.send('Something went wrong!!!')}
	
	    USER_TO_DELETE.deleteOne()
	
	    return res.send('success');

} catch (error) {
	console.log(error);
    return res.status(400).send('Something went wrong!!!')
}
}