const express = require("express");
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', { 
  useUnifiedTopology: true,
  useNewUrlParser: true 
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get((req, res) => {
    Article.find({})
      .then(foundArticles => {
        res.send(foundArticles);
      })
      .catch(err => {
        res.send(err);
      });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.query.title,
      content: req.query.content
    });
    newArticle.save()
    .then(() => {
      res.send("Article added.");
    })
    .catch(err => {
      res.send(err);
    })
  })
  .delete((req, res) => {
    Article.deleteMany({})
      .then(() => {
        res.send("All articles deleted.");
      })
      .catch(err => {
        res.send(err);
      });
  });

app.route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({title: req.params.articleTitle})
      .then(foundArticle => {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles found.")
        }
      })
      .catch(err => {
        res.send(err);
      })
  })
  .put((req, res) => {
    Article.replaceOne({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content}, {overwrite: true})
      .then(() => {
        res.send("Replaced article.");
      })
      .catch(err => {
        res.send(err);
      })
  })
  .patch((req, res) => {
    Article.updateOne({title: req.params.articleTitle}, {$set: req.body}, {overwrite: true})
      .then(() => {
        res.send("Patched article.");
      })
      .catch(err => {
        res.send(err);
      })
  })
  .delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle})
      .then(() => {
        res.send("Deleted article.");
      })
      .catch(err => {
        res.send(err);
      })
  });

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});