const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

const validateListing = (req, res, next) => {
    const {error} = listingSchema.validate(req.body);
    
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Index Route
router.get("/", wrapAsync( async (req, res) => {
    let allListing = await Listing.find();
    res.render("../views/listings/index.ejs", { allListing });
}))

// New Route
router.get("/new", (req, res) => {
    res.render("../views/listings/new.ejs");
})

// Show Route
router.get("/:id", wrapAsync( async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id).populate("review");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("../views/listings/show.ejs", { listing });
}))

router.post("/",
    validateListing,
    wrapAsync( async (req, res) => {

    let { title, description, url, price, location, country } = req.body;
    const newListing = new Listing({
        title: title,
        description: description,
        image: {
            url: url
        },
        price: price,
        location: location,
        country: country
    })

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
}))

router.get("/:id/edit", wrapAsync( async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("../views/listings/edit.ejs", { listing });
}))

router.put("/:id",
    validateListing,
    wrapAsync( async (req, res) => {

    const { id } = req.params;
    const { title, description, url, price, location, country } = req.body;
    const updateListing = await Listing.findByIdAndUpdate(id,
        {
            title: title,
            description: description,
            image: {
                url: url
            },
            price: price,
            location: location,
            country: country
        },
        { runValidators: true, new: true }
    )

    req.flash("success", "Changes Saved Succesfully");

    res.redirect(`/listing/${id}`);
}))

router.delete("/:id", wrapAsync( async (req, res) => {
    const { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deleteListing);
    res.redirect("/listing");
}))

module.exports = router;