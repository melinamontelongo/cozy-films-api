import express from "express";
import { FilmModel } from "../models/Films.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

//  Get all films
router.get("/", async (req, res) => {
    try {
        const response = await FilmModel.find({});
        res.json(response);
    } catch (err) {
        res.json(err);
    };
});
//  Get film by Id
router.get("/:filmID", async (req, res) => {
    try {
        const response = await FilmModel.findById(req.params.filmID);
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});
//  Get film by title
router.get("/title/:filmTitle", async (req, res) => {
    const title = req.params.filmTitle
    try {
        const response = await FilmModel.find({ title: { $regex: ".*" + title + ".*", $options: "i" } })
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});
//  Add a new film
router.post("/", verifyToken, async (req, res) => {
    const film = new FilmModel(req.body);
    try {
        const response = await film.save();
        res.json(response);
    } catch (err) {
        res.json(err);
    };
});
router.post("/review", verifyToken, async (req, res) => {
    const film = await FilmModel.findById(req.body.filmID);
    const user = await UserModel.findById(req.body.userID);
    const review = { ...req.body.review, user: { _id: user._id, username: user.username } };
    try {
        film.reviews.push(review);
        await film.save();
        res.json({ film });
    } catch (err) {
        res.status(500).json({ message: "An unexpected error occurred, retry in a few seconds" });
    };
})
//  Like a film
router.put("/", verifyToken, async (req, res) => {
    try {
        const film = await FilmModel.findById(req.body.filmID);
        const user = await UserModel.findById(req.body.userID);
        //  If user already liked film
        if (user.likedFilms.length > 0 && user.likedFilms.filter(f => f.toString() === req.body.filmID).length > 0) return res.status(409).json({ message: "You've already liked this film!" });
        //  If film was disliked 
        if (user.dislikedFilms.filter(f => f.toString() === req.body.filmID).length > 0) {
            user.dislikedFilms = user.dislikedFilms.filter(f => f.toString() !== req.body.filmID);
            if (film.dislikes > 0) film.dislikes -= 1;
        };
        film.likes += 1;
        user.likedFilms.push(film);
        await film.save();
        await user.save();
        res.json({ likedFilms: user.likedFilms });
    } catch (err) {
        res.status(500).json({ message: "An unexpected error occurred, retry in a few seconds" });
    };
});

//  Dislike a film
router.put("/dislike", verifyToken, async (req, res) => {
    try {
        const film = await FilmModel.findById(req.body.filmID);
        const user = await UserModel.findById(req.body.userID);
        //  If user already disliked film
        if (user.dislikedFilms.filter(f => f.toString() === req.body.filmID).length > 0) return res.status(409).json({ message: "You've already disliked this film!" });
        //  If film was liked 
        if (user.likedFilms.filter(f => f.toString() === req.body.filmID).length > 0) {
            user.likedFilms = user.likedFilms.filter(f => f.toString() !== req.body.filmID);
            if (film.likes > 0) film.likes -= 1;
        };
        film.dislikes += 1;
        user.dislikedFilms.push(film);
        await film.save();
        await user.save();
        res.json({ dislikedFilms: user.dislikedFilms });
    } catch (err) {
        res.status(500).json({ message: "An unexpected error occurred, retry in a few seconds" });
    }
});
//  Get liked films ID's
router.get("/likedFilms/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ likedFilms: user?.likedFilms })
    } catch (err) {
        res.status(500).json({ message: "An unexpected error occurred, retry in a few seconds" });
    };
});
//  Get disliked films ID's
router.get("/dislikedFilms/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ dislikedFilms: user?.dislikedFilms })
    } catch (err) {
        res.status(500).json({ message: "An unexpected error occurred, retry in a few seconds" });
    };
});
//  Get all saved films (liked and disliked)
router.get("/savedFilms", async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.userID);
        const savedFilms = await FilmModel.find({ _id: { $in: user.savedRecipes } })
        res.json({ savedFilms })
    } catch (err) {
        res.status(500).json({ message: "An unexpected error occurred, retry in a few seconds" });
    };
})

export { router as filmRouter }
