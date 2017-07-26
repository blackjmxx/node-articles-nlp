var Horseman = require("node-horseman");
var Promise = require('promise');
var logger = require('logfmt');
var http = require('http');
var superagent = require('superagent');
var scraperjs = require('scraperjs');

var phantomJsCloud = require("phantomjscloud");
var browser = new phantomJsCloud.BrowserApi();
const cheerio = require('cheerio')


/*module.exports = function scrape1(userId, id, url, action) {
    return new Promise(function (resolve, reject) {
        logger.log({type: 'info', msg: 'HEREII'});
        var horseman = new Horseman({timeout: 10000, loadImages: false});
        if (url != undefined) {
            if (action == "ZALANDO") {
                logger.log({type: 'info', msg: 'ZALANDO'});
                    horseman.on('consoleMessage', function (msg) {
                        console.log(msg);
                    })
                    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
                    .open(url)
                    .evaluate(function (selector) {
                        return {
                            price: $(selector[0])[0].outerText,
                            title: $(selector[1])[0].outerText,
                            imgUrl: $(selector[2])[0].src
                        }
                    }, ["div.zvui-product-card-details>div:nth-child(2)>div>span:nth-child(2)", "div.zvui-product-card-details>div:nth-child(1)>h1>span", "img.gallery_image"])
                    .then(function (size) {
                        //response.end(JSON.stringify(size));

                        var data = {
                            price: size.price,
                            title: size.title,
                            imgUrl: size.imgUrl,
                            url: url
                        }
                        superagent
                        //.post('https://linkshopperparse.herokuapp.com/parse/classes/tempurl')
                            .post('http://localhost:1337/parse/classes/tempurl')
                            .send(data)
                            .set('X-Parse-Application-Id', 'APPLICATION_ID')
                            .set('X-Parse-REST-API-Key', 'MASTER_KEY')
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
                    })
                    .catch(function (e) {
                        console.log(e)
                    })
                    .close()
            }

            if (action == "ASOS") {
                logger.log({type: 'info', msg: 'ASOS'});
                logger.log({type: 'info', msg: url});
                horseman.on('loadFinished', function (msg) {
                    console.log('loadFinished', msg);
                })
                    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
                    .open(url)
                    .evaluate(function (selector) {
                        console.log('evaluate');
                        return {
                            price: $(selector[0])[0].outerText,
                            title: $(selector[1]).text(),
                            imgUrl: $(selector[2])[0].src,
                            cat: $(selector[3])[0].innerText
                        }
                    }, ['.current-price', '.product-hero>h1', '.image-thumbnail.mobile-hide.active>a>img', '.product-description>span>a>strong'])
                    .then(function (size) {
                        var data = {
                            price: size.price,
                            title: size.title,
                            imgUrl: size.imgUrl,
                            cat: size.cat,
                            url: url
                        }
                        superagent
                            //.post('https://linkshopperparse.herokuapp.com/parse/classes/tempurl')
                            .post('http://localhost:1337/parse/classes/tempurl')
                            .send(data)
                            .set('X-Parse-Application-Id', 'APPLICATION_ID')
                            .set('X-Parse-REST-API-Key', 'MASTER_KEY')
                            .set('Content-Type', 'application/json')
                            .end(function (err, res) {
                                if (err || !res.ok) {
                                    console.log('Oh no! error');
                                } else {
                                    console.log('yay got ' + JSON.stringify(res.body));
                                }
                                return resolve(JSON.stringify(res.body));
                            });
                    })
                    . finally(function () {
                        horseman.close();
                    })
                    .catch(function (e) {
                        console.log(e)
                    });
            }

            if (action == "ZARA") {
                logger.log({type: 'info', msg: 'ZARA'});
                logger.log({type: 'info', msg: url});
                horseman.on('loadFinished', function (msg) {
                    console.log('loadFinished', msg);
                })
                    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
                    .open(url)
                    .evaluate(function (selector) {
                        console.log('evaluate');
                        return {
                            price: $(selector[0]).text(),
                            title: $(selector[1]).text(),
                            imgUrl: $(selector[2])[0].src
                        }
                    }, [
                        '#product > div.right-container._right-container > div > div > div.price._product' +
                                '-price > span',
                        '#product > div.right-container._right-container > div > div > header > h1',
                        '#main-images > div.media-wrap.image-wrap.nth-child2n > a > img'
                    ])
                    .then(function (size) {
                        var data = {
                            price: size.price,
                            title: size.title,
                            imgUrl: size.imgUrl,
                            cat: size.cat,
                            url: url
                        }
                        superagent
                        //.post('https://linkshopperparse.herokuapp.com/parse/classes/tempurl')
                            .post('http://localhost:1337/parse/classes/tempurl')
                            .send(data)
                            .set('X-Parse-Application-Id', 'APPLICATION_ID')
                            .set('X-Parse-REST-API-Key', 'MASTER_KEY')
                            .set('Content-Type', 'application/json')
                            .end(function (err, res) {
                                if (err || !res.ok) {
                                    console.log('Oh no! error');
                                } else {
                                    console.log('yay got ' + JSON.stringify(res.body));
                                }
                                return resolve(JSON.stringify(res.body));
                            });
                    })
                    . finally(function () {
                        horseman.close();
                    })
                    .catch(function (e) {
                        console.log(e)
                    });
            }

        } else {
            return reject(null);
        }
    }.bind(this));
};*/

module.exports = function scrape(userId, id, url, action) {
    return new Promise(function (resolve, reject) {
        if (url != undefined) {
            if (action == "ZALANDO") {

                browser.requestSingle({
                    url: url,
                    renderType: "html",
                    outputAsJson: true,
                    requestSettings: {"ignoreImages": true}
                }).then(function(userResponse) {

                    const $ = cheerio.load(userResponse.content.data);

                    const data = {
                            price: $('div.zvui-product-card-details>div:nth-child(2)>div>span:nth-child(2)')[0].children[0].data,
                            title: $('div.zvui-product-card-details>div:nth-child(1)>h1>span')[0].children[0].data,
                            imgUrl: $('img.gallery_image')[0].attribs.src,
                            url: url
                        };

                    logger.log({type: 'info',msg:  data});

                    superagent
                        //.post('https://linkshopperparse.herokuapp.com/parse/classes/tempurl')
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
                })
            }

            if(action == "ASOS"){

                browser.requestSingle({
                    url: url,
                    renderType: "html",
                    outputAsJson: true,
                    requestSettings: {"ignoreImages": true}
                }).then(function(userResponse) {

                    const $ = cheerio.load(userResponse.content.data);

                    const data = {
                            price: $('.current-price')[0].children[0].data,
                            title: $('.product-hero>h1')[0].children[0].data,
                            imgUrl: $('.image-thumbnail.mobile-hide.active>a>img')[0].attribs.src,
                            url: url
                        };

                    logger.log({type: 'info',msg:  data});

                    superagent
                        //.post('https://linkshopperparse.herokuapp.com/parse/classes/tempurl')
                        .post('https://linkshopperparse.herokuapp.com/parse/classes/tempurl')
                        .send(data)
                        .set('X-Parse-Application-Id', 'APPLICATION_ID')
                        .set('X-Parse-REST-API-Key', 'MASTER_KEY')
                        .set('Content-Type', 'application/json')
                        .end(function (err, res) {
                            if (err || !res.ok) {
                                console.log('Oh no! error');
                            } else {
                                console.log('yay got ' + JSON.stringify(res.body));
                            }
                            return resolve(JSON.stringify(res.body));
                        });
                })
                
            }

            if(action == "ZARA"){
                    browser.requestSingle({
                    url: url,
                    renderType: "html",
                    outputAsJson: true,
                    requestSettings: {"ignoreImages": false}
                }).then(function(userResponse) {

                    const $ = cheerio.load(userResponse.content.data);

                    const data = {
                            price: $('#product > div.right-container._right-container > div > div > div.price._product-price > span')[0].children[0].data,
                            title: $('#product > div.right-container._right-container > div > div > header > h1')[0].children[0].data,
                            imgUrl: $('#main-images > div:nth-child(1) > a > img')[0].attribs.src,
                            url: url
                        };

                    logger.log({type: 'info',msg:  data});

                    superagent
                        //.post('https://linkshopperparse.herokuapp.com/parse/classes/tempurl')
                        .post('https://linkshopperparse.herokuapp.com/parse/classes/tempurl')
                        .send(data)
                        .set('X-Parse-Application-Id', 'APPLICATION_ID')
                        .set('X-Parse-REST-API-Key', 'MASTER_KEY')
                        .set('Content-Type', 'application/json')
                        .end(function (err, res) {
                            if (err || !res.ok) {
                                console.log('Oh no! error');
                            } else {
                                console.log('yay got ' + JSON.stringify(res.body));
                            }
                            return resolve(JSON.stringify(res.body));
                        });
                })
            }
            

        } else {
            return reject(null);
        }
    }.bind(this));
};