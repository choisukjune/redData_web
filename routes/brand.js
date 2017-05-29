/**
 * Created by june on 2016-12-11.
 */
'use strict';
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var router = express.Router();

var url = 'mongodb://localhost:27017/redData';

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

    var pageList = 30;
    var skipValueId = req.params.id - 1;
    var skipValue = skipValueId * pageList;

    var brand_list_get = function (db, callback) {
        var options = {
           // "limit": pageList,
           // "skip": skipValue,
            "sort": {_id: -1}
        };

        db.collection('red_brand').find({}, options).toArray(function (err, result) {
            assert.equal(err, null);
            //console.log(result);
            res.render('brand', {
                data: result,
                dataCount: global.dataCount
            });
            callback(result);
        });
    };

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        brand_list_get(db, function () {
            db.close();
        });
    });
});


router.get('/prddetail/:prdId', function (req, res, next) {

    var prdId = req.params.prdId;

    var redData__groupby_id__push__data___prdDetail = function (db, callback) {
        db.collection('redgoods').find({prd_id: prdId}).toArray(function (err, result) {
            assert.equal(err, null);
            console.log(result);
            res.render('goodsListDetail', {
                data: result
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

