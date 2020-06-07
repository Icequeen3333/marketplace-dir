const express = require('express');
const logger = require('morgan');
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/foodstuff", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to database")
});

const recipeSchema = new mongoose.Schema({
    dateAdded: Date,
    title: String,
    ingredients: [String],
    method: [String],
    mealType: [String],
    serves: Number,
    time: Number,
    image: { type: String, default: "https://image.flaticon.com/icons/svg/926/926255.svg" },
})

const Recipe = mongoose.model("Recipe", recipeSchema)

const defaultRecipes = require("./defaultRecipes")

app.get("/recipes", function (req, res, next) {
    Recipe.find({}, function (err, recipes) {
        if (recipes.length < 1) {
            const setDefaults = new Promise((resolve, reject) => {
                defaultRecipes.forEach(recipe => {
                    const newRecipe = new Recipe({
                        dateAdded: new Date(),
                        title: recipe.title,
                        ingredients: recipe.ingredients,
                        method: recipe.method,
                        serves: recipe.serves,
                        time: recipe.time,
                        image: recipe.image,
                        mealType: recipe.mealType
                    });
                    newRecipe.save();
                }
                )
                resolve();
            })
            setDefaults.then(() => {
                Recipe.find({}, function (err, recipes) {
                    res.json(recipes);
                })
            });
        } else {
            res.json(recipes);
        }
    });
});

app.post("/recipes/add", function (req, res, next) {
    const recipe = req.body;
    const saveRecipe = new Promise((resolve, reject) => {
        if (recipe.image === "") {
            const newRecipe = new Recipe({
                dateAdded: new Date(),
                title: recipe.title,
                ingredients: recipe.ingredients,
                method: recipe.method,
                serves: recipe.serves,
                time: recipe.time,
                mealType: recipe.mealType
            });
            newRecipe.save();
        } else {
            const newRecipe = new Recipe({
                dateAdded: new Date(),
                title: recipe.title,
                ingredients: recipe.ingredients,
                method: recipe.method,
                serves: recipe.serves,
                time: recipe.time,
                image: recipe.image,
                mealType: recipe.mealType
            });
            newRecipe.save();
        }
        resolve();
    })
    saveRecipe.then(() => {
        Recipe.find({}, function (err, recipes) {
            res.json(recipes);
        })
    })
});

app.get("/recipes/delete-all", function (req, res) {
    Recipe.deleteMany(function (err, note) {
    });
    Recipe.find({}, function (err, recipes) {
        res.json(recipes);
    });
});

app.get("/recipes/delete/:recipeId", function (req, res) {
    const recipeId = req.params.recipeId;
    Recipe.findByIdAndDelete({ _id: recipeId }, () => { })
    Recipe.find({}, function (err, recipes) {
        res.json(recipes);
    });
});

module.exports = app;