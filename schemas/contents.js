/**
 * Created by SHINING on 2017/3/12.
 */

//用户数据库
var mongoose = require('mongoose');

//内容的表结构
module.exports = new mongoose.Schema({

    //关联字段，就是说和其他表单是一个关联的关系，不能随便给类型
    //内容分类的id
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },

    //内容标题
    title: String,

    //关联字段 - 用户id
    user: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },

    //阅读量
    views:{
        type: Number,
        default: 0
    },

    //添加时间
    addTime:{
        type: Date,
        default: new Date()
    },

    //简介
    description: {
        type: String,
        default: ''
    },

    //内容
    content: {
        type: String,
        default: ''
    },

    //评论
    comments:{
        type: Array,
        default: []
    }
});