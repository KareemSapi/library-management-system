

const passport = require('passport');
const User = require('../models/User');
const async = require('async');
const {body, validationResult} = require('express-validator');


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
		  if(req.user.role === 'admin'){
			res.render("user_detail", {
				title: results.user.name,
				user: results.user,
			  });
		  }else{
			return res.redirect('/catalog')
		  }
		}
	  );
}

exports.user_list = (req, res) => {
    User.find({}, "name email")
    .sort({ name: 1 })
    .exec(function (err, list_users) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      if(req.user.role === 'admin'){
		return res.render("user_list", { title: "User List", user_list: list_users });
	  }else{
		return res.redirect('/catalog')
	  }
    });
  };

//delete a user by id
// exports.delete_user = async (req, res) => {

//     const id = req.body.id;

// try {   
// 	    const USER = await User.findOne({id: req.user.id})

// 		if(USER.role !== "admin"){ return res.sendStatus(403) }
		
// 	    const USER_TO_DELETE = await User.findOne({id: id})
	
// 	    if(!USER_TO_DELETE){ return res.send('Something went wrong!!!')}
	
// 	    USER_TO_DELETE.deleteOne()
	
// 	    return res.send('success');

// } catch (error) {
// 	console.log(error);
//     return res.status(400).send('Something went wrong!!!')
// }
// }


// Display User delete form on GET.
exports.user_delete_get = function (req, res, next) {
	async.parallel(
	  {
		User: function (callback) {
		  User.findById(req.params.id).exec(callback);
		},
	  },
	  function (err, results) { //console.log(results)
		if (err) {
		  return next(err);
		}
		if (results.User == null) {
		  // No results.
		  res.redirect("/user/");
		}
		// Successful, so render.
		if(req.user.role === 'admin'){
			return res.render("user_delete", {
				title: "Delete User",
				user: results.User,
			  });
		}else{
			return res.sendStatus(403)
		}
	  }
	);
  };
  
  // Handle User delete on POST.
  exports.user_delete_post = function (req, res, next) {
	async.parallel(
	  {
		User: function (callback) {
		  User.findById(req.body.id).exec(callback);
		},
	  },
	  function (err, results) {
		if (err) {
		  return next(err);
		}
		// Success.
		//if (results.Users_books.length > 0) {
		  // User has books. Render in same way as for GET route.
		//   res.render("User_delete", {
		// 	title: "Delete User",
		// 	user: results.user,
		
		//   });
		  //return;
		//} else {
		  // User has no books. Delete object and redirect to the list of Users.
		  User.findByIdAndRemove(req.body.id, function deleteUser(err) {
			if (err) {
			  return next(err);
			}
			// Success - go to User list.
			res.redirect("/user/");
		  });
		//}
	  }
	);
  };
  
  // Display User update form on GET.
  exports.user_update_get = function (req, res, next) {
	User.findById(req.params.id, function (err, user) {
	  if (err) {
		return next(err);
	  }
	  if (user == null) {
		// No results.
		var err = new Error("User not found");
		err.status = 404;
		return next(err);
	  }
	  // Success.
	  if(req.user.role === 'admin'){
		return res.render("user_form", { title: "Update User", user: user });
	  }else{
		return res.sendStatus(403)
	  }
	});
  };
  
  // Handle User update on POST.
  exports.user_update_post = [
	// Validate and santize fields.
	body("name")
	  .trim()
	  .isLength({ min: 1 })
	  .escape()
	  .withMessage("First name must be specified."),
	body("email")
	  .trim()
	  .isEmail()
	  .withMessage("Wrong email.")
	  .isLength({ min: 1 })
	  .escape()
	  .withMessage("Email must be specified."),
  
	// Process request after validation and sanitization.
	(req, res, next) => {
	  // Extract the validation errors from a request.
	  const errors = validationResult(req);
  
	  // Create User object with escaped and trimmed data (and the old id!)
	  var user = new User({
		name: req.body.name,
		email: req.body.email,
		_id: req.params.id,
	  });
  
	  if (!errors.isEmpty()) {
		// There are errors. Render the form again with sanitized values and error messages.
		res.render("User_form", {
		  title: "Update User",
		  user,
		  errors: errors.array(),
		});
		return;
	  } else {
		// Data from form is valid. Update the record.
		User.findByIdAndUpdate(
		  req.params.id,
		  user,
		  {},
		  function (err, user) {
			if (err) {
			  return next(err);
			}
			// Successful - redirect to genre detail page.
			res.redirect(user.url);
		  }
		);
	  }
	},
  ];