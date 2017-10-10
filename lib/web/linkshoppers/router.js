var express = require('express');
var path = require('path');

var ERR_MAP = {
  'ArticleNotFound': 404,
  'VoteNotAllowed': 403,
  'ScrapeFailed': 500
};

module.exports = function linkshoppersRouter(app) {

  return new express.Router()
    .post('/apps/articles.json', addArticle)
    .use('/apps', express.static(path.join(__dirname, 'public')))

  function listArticles(req, res, next) {
    app
      .listArticles(req.user.id, 15, req.param('fresh'))
      .then(sendList, next);

    function sendList(list) {
      res.json(list);
    }
  }

  function addArticle(req, res, next) {
    app
      .addArticle(req.user.id, req.body.params.url, req.body.params.action, req.body.params.clotheType)
      .then(sendLink, next);

    function sendLink(id) {
      res.json({ url: req.body.params.url});
    }
  }

  function showArticle(req, res, next) {
    app
      .getArticle(req.params.articleId)
      .then(sendArticle, next);

    function sendArticle(article) {
      return res.json(article);
    }
  }

  function upvoteArticle(req, res, next) {
    app
      .addUpvote(req.user.id, req.params.articleId)
      .then(sendLink, next);

    function sendLink(id) {
      return res.json({ link: '/articles/' + id + '.json' });
    }
  }

  function articleErrors(err, req, res, next) {
    var status = ERR_MAP[err.name];
    if (status) err.status = status;
    next(err);
  }
};
