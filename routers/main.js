/**
 * Created by SHINING on 2017/3/12.
 */

var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
var data;

/*
* 处理通用数据
* */
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,  //分配userInfo给main,让他在index.html中调用
        categories: []
    };

    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    });
});
/*
* 首页
* */
router.get('/',function (req, res, next) {

    data.page = Number(req.query.page || 1);
    data.category = req.query.category || '';
    data.count = 0;
    data.limit = 2;
    data.pages = 0;

    //当url后面有传入category的id时，保存到where里面
    var where = {};
    if(data.category){
        where.category = data.category;
    }
    //读取所有的category数据库信息
    Content.where(where).count().then(function (count) {

        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);

        //取值不能超过pages
        data.page = Math.min( data.page, data.pages );

        //取值不能小于1
        data.page = Math.max( data.page, 1 );

        var skip = (data.page - 1) * data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({addTime: -1});

    }).then(function (contents) {
        data.contents = contents;
        res.render('main/index.html',data);
    })
});

/*
* 阅读全文
* */
router.get('/view',function (req, res) {

    var contentId = req.query.contentid || '';
    
    Content.findOne({
        _id: contentId
    }).populate(['category','user']).then(function (content) {
        data.content = content;

        /*
        * 每点击一次阅读全文，增加一次阅读数
        * */
        content.views++;
        content.save();

        res.render('main/view',data);
    });

});


//返回出去给app.js
module.exports = router;