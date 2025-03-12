const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../Controllers/listings.js");

router
    .route("/")
    .get(wrapAsync(listingController.index)) // index route
    .post(                                   // create route
        isLoggedIn,
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router
    .route("/:id")
    .get(wrapAsync(listingController.showListingDetails)) // Show Route
    .put(                                                 // update
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(                                               //delete
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

//edit
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.showEditForm)
)

module.exports = router;