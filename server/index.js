const { json } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const BookMarks = require("./models/BookMarkSchema")
const cors = require("cors")
require('dotenv').config();

app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
    console.log("Connected to mongodb");
})

app.post("/insert",  (req, res) => {
    let bookmarkTitle = req.body.bookmarkTitle
    let bookmarkTags = req.body.bookmarkTags
    let bookmarkLink = req.body.bookmarkLink
    let bookmarkDescription = req.body.bookmarkDescription

    const newBookMark = new BookMarks({
        bookmarkTitle: bookmarkTitle,
        bookmarkTags: bookmarkTags,
        bookmarkLink: bookmarkLink,
        bookmarkDescription: bookmarkDescription
    })

    try {
        newBookMark.save();
        console.log("saved successfully")
        res.send("saved successFully")
    } catch (err) {
        console.log(err);
    }

})

app.get("/read", (req, res) => {
     BookMarks.find({}, (err, result) => {
        if (err) {
            res.send(err)
        }
        res.send(result)
    })
})

app.put("/update", async (req, res) => {
    const id = req.body.id
    const updateCard = req.body.updatedCard

    try {
        await BookMarks.findById(id, async (err, updatedCard) => {
            if (updatedCard !== null) {
                updatedCard.bookmarkTitle = updateCard.bookmarkTitle
                updatedCard.bookmarkTags = updateCard.bookmarkTags
                updatedCard.bookmarkLink = updateCard.bookmarkLink
                updatedCard.bookmarkDescription = updateCard.bookmarkDescription;
                await updatedCard.save()
                console.log("successfully upddated");
                res.send("updated")
            }
        }).clone().catch(function (err) { console.log(err) })
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

app.delete("/delete/:id", async (req, res) => {
    const id = (req.params.id);
    console.log(req.params);
    console.log(id + "***********");
    await BookMarks.findByIdAndRemove({ _id: id }, async (err, result) => {
        if (err) {
            console.log(err);
        }
    }).clone().catch(function (err) { console.log(err) })

    res.send("deleted");
})

app.listen(3001, () => {
    console.log("server is up and running on port 3001..");
})