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
      filename: {
        type: String,
      },
      url: {
        type: String,
        default: "https://images.unsplash.com/photo-1707343848552-893e05dba6ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Default value when no image URL is provided
        set: (v) => 
              v === "" 
              ? "https://images.unsplash.com/photo-1707343848552-893e05dba6ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              : v
      },
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
