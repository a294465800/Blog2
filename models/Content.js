/**
 * Created by SHINING on 2017/3/12.
 */

var mongoose = require('mongoose');
var contentsSchema = require('../schemas/contents');  //默认自带js后缀

module.exports = mongoose.model('Content',contentsSchema);