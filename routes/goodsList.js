'use strict';
var express = require('express');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var router = express.Router();

var url = 'mongodb://112.144.208.7:9001/redData';

global.dataCount = "";

var dataTotalCount = function (db, callback) {

    db.collection('redgoodsdetails').find({}).toArray(function (err, result) {
        assert.equal(err, null);

        global.dataCount = result.length;
        callback(result.length)
    });
};

MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    dataTotalCount(db, function () {
        db.close();

    });
});


/* GET home page. */

router.get('/', function (req, res) {
    res.redirect("/goodsList/1");
});

router.get('/:id', function (req, res) {

    var pageList = 30;
    var skipValueId = req.params.id - 1;
    var skipValue = skipValueId * pageList;

    var redData__groupby__id___prdList = function (db, callback) {
        var options = {
            "limit": pageList,
            "skip": skipValue,
            "sort": {_id: -1}
        };

        db.collection('redgoodsdetails').find({}, options).toArray(function (err, result) {
            assert.equal(err, null);
            res.render('goodsList', {
                data: result,
                dataCount: result.length
            });
            callback(result);
        });
    };

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        redData__groupby__id___prdList(db, function () {
            db.close();
        });
    });
});

router.get('/prddetail/:prdId', function (req, res, next) {
    var prdId = req.params.prdId;
    var db = new Db('redData', new Server('112.144.208.7', 9001));
    db.open(function(err, db) {
        var collection = db.collection("redgoods2");
        collection.find({prd_id : prdId}).toArray(function(err, item) {
            if(err) console.log(err);
            res.render('goodsListDetail',{ data : item});
            db.close();
        })
    });
});


router.get('/brand/:berandId', function (req, res, next) {

    var berand_Id = req.params.berandId;

    var redData__groupby_id__push__data___prdDetail = function (db, callback) {
        db.collection('redgoodsdetails').find({"data.brand.id": berand_Id}).toArray(function (err, result) {
            assert.equal(err, null);
            console.log(result);
            res.render('goodsList', {
                data: result,
                dataCount: result.length
            });
            callback(result);
        });
    };

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        redData__groupby_id__push__data___prdDetail(db, function () {
            db.close();
        });
    });


});





router.post('/search', function (req, res, next) {

    var keyword = req.body.keyword;

    var redData__groupby__id__search = function (db, callback) {

        db.collection('redgoods').find({name : {$regex : keyword}}).toArray(function (err, result) {
            assert.equal(err, null);
            console.log(result);
            res.render('goodsList', {
                data: result,
                dataCount: global.dataCount
            });
            callback(result);
        });
    };

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        redData__groupby__id__search(db, function () {
            db.close();

        });
    });
});


module.exports = router;

