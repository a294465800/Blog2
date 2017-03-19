/**
 * Created by SHINING on 2017/3/17.
 */
//每页显示两条
var prepage = 2,
//当前页数
    page = 1,
//总页数
    pages = 0,
    comments = [];

//当点击提交按钮的时候，发送ajax请求,提交评论
$('#messageBtn').on('click',function () {
    $.ajax({
        type: 'POST',
        url: '/api/comment/post',
        data: {
            contentid: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        success: function (responseData) {
            $('#messageContent').val('');
            comments = responseData.data.comments.reverse();
            renderCommtent();
        }
    });
});


//每次页面重载的时候获取一下该文章的所有评论
$.ajax({
    url: '/api/comment',
    data: {
        contentid: $('#contentId').val()
    },
    success: function (responseData) {
        comments = responseData.data.reverse();
        renderCommtent();
    }
});

//事件委托，把a委托给pager
$('.pager').delegate('a','click',function () {
    //判断父级的class来辨别上一页还是下一页
    if($(this).parent().hasClass('previous')){
        page--;
    }else{
        page++;
    }
    renderCommtent();
});

/*
* 渲染评论区的方法
* */
function renderCommtent() {

    $('#messageCount').html(comments.length);

    var $lis =$('.pager li');
    //求出总页数
    pages = Math.max(Math.ceil( comments.length / prepage ),1);
    var start = Math.max(0,(page - 1) * prepage),   //注意处理数据，别超出范围！
        end = Math.min(start + prepage,comments.length),
        html = '';

    $lis.eq(1).html( page + '/' + pages);

    if( page <= 1){
        page = 1;
        $lis.eq(0).html('<span>没有上一页了</span>');
    }else{
        $lis.eq(0).html('<a href="javascript:;">上一页</a>');
    }
    if( page >= pages){
        page = pages;
        $lis.eq(2).html('<span>没有下一页了</span>');
    }else{
        $lis.eq(2).html('<a href="javascript:;">下一页</a>');
    }

    if(comments.length == 0){
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>')
    }else{
        for( var i=start; i<end;i++){
            html += '<div class="messageBox">' +
                '<p class="name clear"><span class="fl">'+comments[i].username+'</span><span class="fr">'+formateDate(comments[i].postTime)+'</span></p><p>'+comments[i].content+'</p>'+
                '</div>';
        }
        $('.messageList').html(html);
    }

}


/*
* 转换日期格式
* */
function Turn(str) {
    var newstr = str.toString();
    if(newstr.length < 2){
        newstr = '0' + newstr;
    }
    return newstr;
}

function formateDate(d) {
    var date1 = new Date(d);
    return date1.getFullYear() + '年' + Turn((date1.getMonth()+1)) + '月' + Turn(date1.getDate()) + '日' +
           Turn(date1.getHours()) + ':' + Turn(date1.getMinutes()) + ':' + Turn(date1.getSeconds());
}