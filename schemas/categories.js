/**
 * Created by SHINING on 2017/3/12.
 */

//用户数据库
var mongoose = require('mongoose');

//分类的表结构
module.exports = new mongoose.Schema({

    //分类名
    name:String
});