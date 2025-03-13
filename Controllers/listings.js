const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    let allListing = await Listing.find();
    res.render("../views/listings/index.ejs", { allListing });
}

module.exports.renderNewForm = (req, res) => {
    res.render("../views/listings/new.ejs");
}

module.exports.showListingDetails = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({
            path: "review",
            populate: {
                path: "author",
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    console.log(listing);
    res.render("../views/listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    let { title, description, price, location, country } = req.body;
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
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
}

module.exports.showEditForm = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150")
    res.render("../views/listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {

    const { id } = req.params;
    const { title, description, price, location, country } = req.body;

    const updateListing = await Listing.findByIdAndUpdate(id,
        {
            title: title,
            description: description,
            price: price,
            location: location,
            country: country
        },
        { runValidators: true, new: true }
    )

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updateListing.image = { url, filename };
        await updateListing.save();
    }

    req.flash("success", "Changes Saved Succesfully");

    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deleteListing);
    res.redirect("/listing");
}