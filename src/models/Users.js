import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    likedFilms: [{ type: mongoose.Schema.Types.ObjectId, ref: "films" }],
    dislikedFilms: [{ type: mongoose.Schema.Types.ObjectId, ref: "films" }],
});

export const UserModel = mongoose.model("users", UserSchema);
