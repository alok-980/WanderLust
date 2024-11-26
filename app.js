const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

main().then(() => {
    console.log("connection successfull");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.get("/", (req, res) => {
    res.render("../views/listings/root.ejs");
})

app.get("/listing", wrapAsync( async (req, res) => {
    let allListing = await Listing.find();
    res.render("../views/listings/index.ejs", { allListing });
}))

app.get("/listing/new", (req, res) => {
    res.render("../views/listings/new.ejs");
})

app.get("/listing/:id", wrapAsync( async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);
    res.render("../views/listings/show.ejs", { listing });
}))

app.post("/listing", wrapAsync( async (req, res) => {

    if(!req.body) {
        throw new ExpressError(400, "Send valid data for listing")
    }

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
    res.redirect("/listing");
}))

app.get("/listing/:id/edit", wrapAsync( async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("../views/listings/edit.ejs", { listing });
}))

app.put("/listing/:id", wrapAsync( async (req, res) => {

    if(!req.body) {
        throw new ExpressError(400, "Send valid data for listing")
    }

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

    res.redirect(`/listing/${id}`);
}))

app.delete("/listing/:id", wrapAsync( async (req, res) => {
    const { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listing");
}))

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
})

app.use((err, req, res, next) => {
    let {statusCode = 500, message= "something whent wrong"} = err;
    res.status(statusCode).render("../views/error.ejs", {err});
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("server is listening on port 8080");
})