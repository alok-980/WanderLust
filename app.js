const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main().then(() => {
    console.log("connection successfull");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

// app.get("/", (req, res) => {
//     res.send("root");
// })

app.get("/listing", async (req, res) => {
    let allListing = await Listing.find();
    res.render("../views/listings/index.ejs", {allListing});
})

app.get("/listing/new", (req, res) => {
    res.render("../views/listings/new.ejs");
})

app.get("/listing/:id", async (req, res) => {
    const {id} = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);
    res.render("../views/listings/show.ejs", {listing});
})

app.post("/listing", async (req, res) => {
    let {title, description, filename, price, location, country} = req.body;
    const newListing = new Listing({
        title: title,
        description: description,
        image: {
            filename: filename
        },
        price: price,
        location: location,
        country: country
    })

    await newListing.save();
    res.redirect("/listing");
})

app.get("/listing/:id/edit", async (req, res) => {
    const {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("../views/listings/edit.ejs", {listing});
})

app.put("/listing/:id", async (req, res) => {
    const {id} = req.params;
    const {title, description, filename, price, location, country} = req.body;
    const updateListing = await Listing.findByIdAndUpdate(id,
        {
            title: title,
            description: description,
            image: {
                filename: filename
            },
            price: price,
            location: location,
            country: country
        },
        {runValidators: true, new: true}
    )

    res.redirect(`/listing/${id}`);
})

app.delete("/listing/:id", async (req, res) => {
    const {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listing");
})

app.listen(8080, () => {
    console.log("server is listening on port 8080");
})