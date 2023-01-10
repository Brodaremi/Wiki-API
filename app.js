const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const mongoose= require("mongoose");
const Article = require("./model/article");
const app = express();

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://0.0.0.0:27017/wikiDB', {useNewUrlParser: true,  useUnifiedTopology: true})
.then(()=>{
    console.log("Mongoose connection open");
})
.catch(err=>{
    console.log("Oh no error");
    console.log(err);
})


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(morgan("tiny"));


//////ROUTE FOR AALL ARTICLES////////
app.route("/articles")
    .get(async (req, res)=>{
        const foundArticle = await Article.find({});
        if (!foundArticle) {
            res.json("Data not found")
        }else{
            res.json(foundArticle);
        }
    })

    .post(async (req, res) => {
        const {title, content} = req.body;
        const newArticle = await new Article({
            title: title,
            content: content
        });
        await newArticle.save();
        if (!newArticle) {
            res.json("There was an error creating an article")
        }else{
            console.log("succesfully added a new article");
            res.json(newArticle)
        };
    })

    .delete(async (req, res) => {
        const deleteArticle = await Article.deleteMany({});
        if (!deleteArticle) {
            res.json("Error deleting all article")
        }else{
            res.json("Succesfully deleted all articles")
        }
    });

////////ROUTE FOR SPECIFIC ARTICLES/////////
app.route("/articles/:articleTitle")
    .get(async (req, res) => {
        const {articleTitle} = req.params;
        const foundArticle = await Article.find({title: articleTitle});
        if (!foundArticle) {
            res.json("No article matching that title was found")
        }else{
            res.json(foundArticle)
        }
    })

    .patch(async (req, res) => {
        const {articleTitle} = req.params;
        const updatedArticle = await Article.update({title: articleTitle}, {$set: req.body});
        if (!updatedArticle) {
            res.json("Failed to update the article")
        }else{
            res.json(updatedArticle)
        }
    })

    .delete(async (req, res) => {
        const {articleTitle} = req.params;
        const deletedArticle = await Article.deleteOne({title: articleTitle});
        if (!deletedArticle) {
            res.json("Failed to delete article")
        }else{
            res.json("succesfully deleted article")
        }
    })

app.listen(3000, ()=>{
    console.log("App is listening on port 3000");
})