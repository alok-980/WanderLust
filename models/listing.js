const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review.js");

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
    },

    image: {
      url: String,
      filename: String
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to zero'],
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
    },

    country: {
      type: String,
      required: [true, 'Country is required'],
    },

    review: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: {$in: listing.review}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
