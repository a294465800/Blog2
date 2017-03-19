/**
 * Created by SHINING on 2017/3/12.
 */

/*
* 所有ajax的接口都在这里
* */

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');

//统一返回格式
var responseData;

//初始定下格式
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    };

    next();
});

/*
* 用户注册
*   注册逻辑
*
*   1.用户名不能为空
*   2.密码不能为空
*   3，两次输入密码必须一致
*
*   1.用户名是否已经被注册
*           数据库查询
* */
router.post('/user/register',function (req, res, next) {

    //对传进来的用户数据进行处理
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    //用户名是否为空
    if( username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return ;
    }
    //密码是否为空
    if( password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return ;
    }
    //两次输入的密码不一致
    if( password !== repassword){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return ;
    }

    //用户名是否已经被注册，如果数据库中已经存在和我们要注册的用户名同名的数据，表示该用户名已经被注册了
    User.findOne({
        username: username
    }).then(function (userInfo) {
        if(userInfo){
            //表示数据库中有该记录
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return ;
        }
        //保存用户注册的信息到数据库中
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function (newUserInfo) {  //这个newUserInfo就是保存的数据本体
        responseData.message = '注册成功!';
        res.json(responseData);
    });//promise对象使用ECMA6的方法，找教程看
    /*
    * 正常情况下密码是需要加密的，可以搜索nodeJs加密模块去了解
    * */
});

/*
* 登录
* */
router.post('/user/login',function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if(username == '' || password == ''){
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData);
        return ;
    }

    //查询数据库中相同用户名和密码的记录是否存在，如果存在则登陆了成功
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        //用户名和密码是正确的
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        };
        //发送一个登录信息给浏览器，保存。以头信息发送
        req.cookies.set('userInfo', JSON.stringify({   //保存成字符串，存在userInfo里面
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
        return ;

    })
});


/*
* 退出
* */
router.get('/user/logout',function (req, res) {
    req.cookies.set('userInfo', null);
    res.json(responseData);
    return ;
});

/*
*获取指定文章的所有评论
* */
router.get('/comment',function (req, res) {
    var contentId = req.query.contentid || '';

    Content.findOne({
        _id: contentId
    }).then(function(content){
        responseData.data = content.comments;
        res.json(responseData);  //返回给前端，完成交互
    })
});


/*
* 评论提交
* */
router.post('/comment/post',function (req, res) {

    //内容的id
    var contentId = req.body.contentid || '';
    var postData = {
        username: req.userInfo.username,  //这个其实是cookies获取的
        postTime: new Date(),
        content: req.body.content
    };

    //查询当前这篇内容的信息
    Content.findOne({
        _id: contentId
    }).then(function(content){
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message = '评论成功';
        responseData.data = newContent;
        res.json(responseData);  //返回给前端，完成交互
    });
});

//返回出去给app.js
module.exports = router;