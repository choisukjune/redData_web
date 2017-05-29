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
            //console.log(result);
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
var aaa = {}
    var redData__groupby_id__push__data___prdDetail = function (db, callback) {
        db.collection('redgoods2').find({prd_id: prdId}).toArray(function (err, result) {
            assert.equal(err, null);
            aaa.data1 = result
            callback(result);
        });
    };
	var c = function (db, callback) {
		db.collection('redgoodsdetails').find({"data.item.source_id": prdId}).toArray(function (err, result) {
			assert.equal(err, null);
			console.log(result[0].data.brand.id);
			db.collection('red_post_brand_count_2016').find({brand_id : result[0].data.brand.id}).toArray(function (err, bbb) {
			    if(err){console.log(err)}
			    aaa.data2 = bbb
				res.render('goodsListDetail', {
					data: aaa
				});
                
                db.close();
			})
			callback(result);
		});
	};
    
    
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        redData__groupby_id__push__data___prdDetail(db, function () {
            //db.close();
        });
	    c(db, function () {
		   
	    });
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

