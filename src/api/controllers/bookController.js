

const Book = require('../models/Book');
const async = require('async');
const { body, validationResult } = require('express-validator')

exports.index = (req, res) => {
    async.parallel(
        {
          book_count(callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
          },
        //   book_instance_count(callback) {
        //     BookInstance.countDocuments({}, callback);
        //   },
        //   book_instance_available_count(callback) {
        //     BookInstance.countDocuments({ status: "Available" }, callback);
        //   },
        //   author_count(callback) {
        //     Author.countDocuments({}, callback);
        //   },
        //   genre_count(callback) {
        //     Genre.countDocuments({}, callback);
        //   },
        },
        (err, results) => {
          res.render("index", {
            title: "Local Library Home",
            error: err,
            data: results,
          });
        }
      );
  };
  
  // Display list of all books.
  exports.book_list = (req, res) => { //console.log(req.user)
    let limit = parseInt(req.query.limit) || 10
    let page = parseInt(req.query.page) - 1 || 0
    Book.find({}, "title author")
    .sort({ title: 1 })
    .skip(limit * page)
    .limit(limit)
    .exec(function (err, list_books) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("book_list", { title: "Book List", book_list: list_books });
    });
  };
  
// Display detail page for a specific book.
exports.book_detail = (req, res, next) => {
    async.parallel(
      {
        book(callback) {
          Book.findById(req.params.id)
            // .populate("author")
            // .populate("genre")
            .exec(callback);
        },
        // book_instance(callback) {
        //   BookInstance.find({ book: req.params.id }).exec(callback);
        // },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.book == null) {
          // No results.
          const err = new Error("Book not found");
          err.status = 404;
          return next(err);
        }
        // Successful, so render.
        res.render("book_detail", {
          title: results.book.title,
          book: results.book,
          // book_instances: results.book_instance,
        });
      }
    );
  };
  
  
// Display book create form on GET.
exports.book_create_get = function (req, res, next) {
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel(
    {
      // authors: function (callback) {
      //   Author.find(callback);
      // },
      // genres: function (callback) {
      //   Genre.find(callback);
      // },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      let genres = ['Fantasy', 'Fiction', 'Science', 'Horror']

      if(req.user.role === 'admin'){
        return res.render("book_form", {
          title: "Create Book",
          // authors: results.authors,
          genres: genres,
        });
      }else{
        return res.status(403).send('Forbiden: only Admin can create books')//res.redirect('/catalog')
      }

    }
  );
};

// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => { console.log(req.body)
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          // authors: function (callback) {
          //   Author.find(callback);
          // },
          // genres: function (callback) {
          //   Genre.find(callback);
          // },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          let genres = ['Fantasy', 'Fiction', 'Science', 'Horror']

          // Mark our selected genres as checked.
          for (let i = 0; i < genres.length; i++) {
           //if (book.genre.indexOf(results.genres[i]._id) > -1) {
              genres[i].checked = "true";
            //}
          }
          res.render("book_form", {
            title: "Create Book",
            // authors: results.authors,
            genres: genres,
            book: book,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Save book.
      book.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new book record.
        res.redirect(book.url);
      });
    }
  },
];

// Display book delete form on GET.
exports.book_delete_get = function (req, res, next) {
  async.parallel(
    {
      book: function (callback) {
        Book.findById(req.params.id)
          // .populate("author")
          // .populate("genre")
          .exec(callback);
      },
      // book_bookinstances: function (callback) {
      //   BookInstance.find({ book: req.params.id }).exec(callback);
      // },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        // No results.
        res.redirect("/catalog/books");
      }
      // Successful, so render.
    if(req.user.role === 'admin'){
      res.render("book_delete", {
        title: "Delete Book",
        book: results.book,
        // book_instances: results.book_bookinstances,
      });
    }else{
      return res.sendStatus(403)
    }

    }
  );
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res, next) {
  // Assume the post has valid id (ie no validation/sanitization).

  async.parallel(
    {
      book: function (callback) {
        Book.findById(req.body.id)
          // .populate("author")
          // .populate("genre")
          .exec(callback);
      },
      // book_bookinstances: function (callback) {
      //   BookInstance.find({ book: req.body.id }).exec(callback);
      // },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      // if (results.book_bookinstances.length > 0) {
      //   // Book has book_instances. Render in same way as for GET route.
      //   res.render("book_delete", {
      //     title: "Delete Book",
      //     book: results.book,
      //     // book_instances: results.book_bookinstances,
      //   });
      //   return;
      // } else {
        // Book has no BookInstance objects. Delete object and redirect to the list of books.
        Book.findByIdAndRemove(req.body.id, function deleteBook(err) {
          if (err) {
            return next(err);
          }
          // Success - got to books list.
          res.redirect("/catalog/books");
        });
      //}
    }
  );
};

// Display book update form on GET.
exports.book_update_get = function (req, res, next) {
  // Get book, authors and genres for form.
  async.parallel(
    {
      book: function (callback) {
        Book.findById(req.params.id)
          // .populate("author")
          // .populate("genre")
          .exec(callback);
      },
      // authors: function (callback) {
      //   Author.find(callback);
      // },
      // genres: function (callback) {
      //   Genre.find(callback);
      // },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        // No results.
        var err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      // Mark our selected genres as checked.
      // for (
      //   var all_g_iter = 0;
      //   all_g_iter < results.genre.length;
      //   all_g_iter++
      // ) {
      //   for (
      //     var book_g_iter = 0;
      //     book_g_iter < results.book.genre.length;
      //     book_g_iter++
      //   ) {
      //     if (
      //       results.genres[all_g_iter]._id.toString() ===
      //       results.book.genre[book_g_iter]._id.toString()
      //     ) {
      //       results.genre[all_g_iter].checked = "true";
      //     }
      //   }
      // }

      if(req.user.role === 'admin'){
        return res.render("book_form", {
          title: "Update Book",
          authors: results.book.author,
          genres: results.book.genre,
          book: results.book,
        });
      }else{
        return res.sendStatus(403)
      }
    }
  );
};

// Handle book update on POST.
exports.book_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form
      async.parallel(
        {
          // authors: function (callback) {
          //   Author.find(callback);
          // },
          // genres: function (callback) {
          //   Genre.find(callback);
          // },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (let i = 0; i < results.genres.length; i++) {
            //if (book.genre.indexOf(results.genres[i]._id) > -1) {
              genres[i].checked = "true";
            //}
          }
          res.render("book_form", {
            title: "Update Book",
            authors: results.book.author,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Update the record.
      Book.findByIdAndUpdate(req.params.id, book, {}, function (err, thebook) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to book detail page.
        res.redirect(thebook.url);
      });
    }
  },
];