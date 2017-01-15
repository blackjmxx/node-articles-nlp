var Horseman = require("node-horseman");
var Promise = require('promise');
var logger = require('logfmt');
var http = require('http');
var superagent = require('superagent');

module.exports = function scrape(userId, id, url, action) {
    return new Promise(function (resolve, reject) {
        logger.log({ type: 'info', msg: 'HEREII' });
        var horseman = new Horseman({ timeout: 10000 });

        if (url != undefined) {

            if (action == "ZALANDO") {
                logger.log({ type: 'info', msg: 'ZALANDO' });

                horseman.on('consoleMessage', function (msg) {
                    console.log(msg);
                })
                    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
                    .open(url)
                    .evaluate(function (selector) {
                        console.log('evaluate');

                        return {
                            price: $(selector[0])[0].outerText,
                            title: $(selector[1]).text(),
                            imgUrl: $(selector[2])[0].src
                        }
                    }, ['.zvui_price_priceWrapper', '.z-vegas-ui_article-brand-info_content', '.loaded'])
                    .then(function (size) {
                        //response.end(JSON.stringify(size));

                        var data = {
                            price: size.price,
                            title: size.title,
                            imgUrl: size.imgUrl,
                            url: url
                        }

                        superagent
                            .post('https://linkshopperparse.herokuapp.com/parse/classes/tempurl')
                            //.post('http://localhost:1337/parse/classes/tempurl')
                            .send(data)
                            .set('X-Parse-Application-Id', 'myAppId')
                            .set('X-Parse-REST-API-Key', 'myMasterKey')
                            .set('Content-Type', 'application/json')
                            .end(function (err, res) {
                                if (err || !res.ok) {
                                    console.log('Oh no! error');
                                } else {
                                    console.log('yay got ' + JSON.stringify(res.body));
                                }
                                return resolve(JSON.stringify(res.body));
                            });
                        horseman.close();
                    }).close()
            }

            if (action == "ASOS") {
                logger.log({ type: 'info', msg: 'ASOS' });
                logger.log({ type: 'info', msg: url });
                horseman.on('loadFinished', function (msg) {
                    console.log('loadFinished', msg);
                }).
                    userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
                    .open(url)
                    .evaluate(function (selector) {
                        console.log('evaluate');
                        return {
                            price: $(selector[0])[0].outerText,
                            title: $(selector[1]).text(),
                            imgUrl: $(selector[2])[0].src,
                            cat: $(selector[3]).text()
                        }
                    }, ['.current-price', '.product-hero>h1', '.image-thumbnail.mobile-hide.active>a>img', '#bc3>a'])
                    .log()
                    .then(function (size) {
                        var data = {
                            price: size.price,
                            title: size.title,
                            imgUrl: size.imgUrl,
                            cat: size.cat,
                            url: url
                        }
                        superagent
                            .post('https://linkshopperparse.herokuapp.com/parse/classes/tempurl')
                            .send(data)
                            .set('X-Parse-Application-Id', 'myAppId')
                            .set('X-Parse-REST-API-Key', 'myMasterKey')
                            .set('Content-Type', 'application/json')
                            .end(function (err, res) {
                                if (err || !res.ok) {
                                    console.log('Oh no! error');
                                } else {
                                    console.log('yay got ' + JSON.stringify(res.body));
                                }
                                return resolve(JSON.stringify(res.body));
                            });
                    }).finally(function () {
                        horseman.close();
                    }).catch(function (e) {
                        console.log(e)
                    });
            }
        } else {
            return reject(null);
        }
    }.bind(this));
};

