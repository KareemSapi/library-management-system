
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookFavouriteSchema = new Schema({
  book_id: { 
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Book', 
     required: true 
    },
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
    },

});

// // Virtual for book's URL
// BookSchema.virtual("url").get(function () {
//   // We don't use an arrow function as we'll need the this object
//   return `/catalog/book/${this._id}`;
// });

// Export model
const BookFavourite = mongoose.model("Book_Favourite", BookFavouriteSchema);

module.exports = BookFavourite;