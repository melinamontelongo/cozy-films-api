import mongoose from "mongoose";

const FilmSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: Number, required: true },
    genres: { type: String, required: true },
    image: { type: String, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    reviews: { type: Array },
    userOwner: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
});

export const FilmModel = mongoose.model("films", FilmSchema);
