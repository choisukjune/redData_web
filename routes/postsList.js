'use strict';
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var router = express.Router();

var url = 'mongodb://localhost:27017/redData';

global.dataCount = "";

var dataTotalCount = function (db, callback) {

	db.collection('redposts').aggregate(
		[{
			$group: {
				_id: "$id"
			}
		}],
		{
			allowDiskUse: true
		}
	).toArray(function (err, result) {
		assert.equal(err, null);
		//console.log(result.length);
		global.dataCount = result.length;
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
	res.redirect("/postsList/1");
});

router.get('/:id', function (req, res) {

	var pageList = 30;
	var skipValueId = req.params.id - 1;
	var skipValue = skipValueId * pageList;

	var redData__groupby__id___prdList = function (db, callback) {

		db.collection('redposts').find({}).skip(skipValue).limit(pageList).toArray(function (err, result) {
			assert.equal(err, null);
			console.log(result);
			res.render('postsList', {
				data: result,
				dataCount: global.dataCount
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

	var redData__groupby_id__push__data___prdDetail = function (db, callback) {
		db.collection('redposts').aggregate(
			[{
				$group: {
					_id: "$id",
					Stock: {
						$push: {
							total: "$total",
							crawlingDate: "$crawlingDate",
							discount_price: "$discount_price"
						}
					}
				}
			}, {
				$match: {
					_id: prdId
				}
			}]).toArray(function (err, result) {
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

		db.collection('redposts').find({desc: {$regex: keyword}}).sort({crawlingDate: 1}).toArray(function (err, result) {
			assert.equal(err, null);
			console.log(result);
			res.render('postsList', {
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

