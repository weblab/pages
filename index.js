/**
* 圣诞节下雪组件
* 孟坤博客 编写
* 文章地址： https://mkblog.cn/401/
* 当前版本：v1.0
* 更新日期：2016-12-24
**/
var options = {
    minSize: 200,     /* 定义雪花最小尺寸 */
    maxSize: 300,    /* 定义雪花最大尺寸 */
    newOn: 300,     /* 定义密集程度，数字越小越密集，也会导致电脑越卡 */
    randColor: true,        /*是否使用随机颜色，如果选是，则下面的颜色设置无效*/
    flakeColor	: "#AFDAEF",   /* 此处可以定义雪花颜色，若要白色可以改为#FFFFFF */
    musicUrl: "http://p2.music.126.net/hG7Dg7Rv4jbISq1VEKvfeg==/5663584394763948.mp3",      /*背景音乐链接*/
    imgSrc: "/建军节.png",   /*弹窗左侧的图片url*/
    styleHref: "/style.css",           /*弹窗样式文件*/
    popTitle: "欢迎来访",                       /*弹窗标题*/
    popMsg: "Merry Christmas!<br>祝:圣诞快乐~", /*弹窗内容(注：字体大小等样式请前往css中更改)*/
    snow: true,         //是否默认开启下雪
    music: false,       //是否默认开启音乐(注：即使开启了，在手机上也无法自动播放音乐)
    mobile: true      //是否在手机上展现
};

$(function(){
    if(options.mobile === false && !IsPC()) return true;
    
    var tipBoxHtml = "<div id=\"mk-pop-box\">";
    tipBoxHtml += "   <div class=\"mk-pop-title\">";
    tipBoxHtml += options.popTitle;
    tipBoxHtml += "       <span class=\"mk-pop-close\" onclick=\"closePop()\">×</span>";
    tipBoxHtml += "   </div>";
    tipBoxHtml += "   <img class=\"mk-pop-left-img\" src=\""+ options.imgSrc +"\">";
    tipBoxHtml += "   <div class=\"mk-pop-right-msg\">";
    tipBoxHtml += options.popMsg;
    tipBoxHtml += "   </div>";
    tipBoxHtml += "   <div class=\"mk-pop-tool\">";
    tipBoxHtml += "       <span class=\"close-music\" onclick=\"stopMusic()\">开启音乐</span>";
    tipBoxHtml += "       <span class=\"close-snow\" onclick=\"stopSnow()\">开启雪花</span>";
    tipBoxHtml += "   </div>\n";
    tipBoxHtml += "</div>\n";

    $("body").append(tipBoxHtml);
    $("body").append('<audio id="m_bg_music" loop="loop" preload="auto" src="' + options.musicUrl + '" />');
    $("body").append('<link rel="stylesheet" href="'+ options.styleHref +'">');
    
    //$("#m_bg_music")[0].addEventListener('timeupdate',remMusicTime,false);  //根据歌曲进度自动保存(不推荐)
    
    if(getSnowCookie('showSnow') == 'true' || (getSnowCookie('showSnow') === null && options.snow === true))
    {
        snow();
        $('.close-snow').html('关闭雪花');
    }
    
    if(getSnowCookie('playMusic') == 'true' || (getSnowCookie('playMusic') === null && options.music === true))
    {
        $('#m_bg_music')[0].play();
        $('#m_bg_music')[0].currentTime = getSnowCookie('musicTime');   //接着上次的地方播放
        console.log($('#m_bg_music')[0].currentTime);
        $('.close-music').html('关闭音乐');
    }
});

//启动下雪
function snow(){
    var $flake = $('<div id="snowbox" />').css({'position': 'fixed','z-index':'9999', 'top': '-50px'}).html('&#10052;'),
    documentHeight = $(document).height(),
    documentWidth	= $(document).width(),
    interval = setInterval( function(){
        var startPositionLeft = Math.random() * documentWidth - 100,
        startOpacity = 0.5 + Math.random(),
        sizeFlake = options.minSize + Math.random() * options.maxSize,
        endPositionTop = documentHeight - 200,
        endPositionLeft = startPositionLeft - 500 + Math.random() * 500,
        durationFall = documentHeight * 10 + Math.random() * 5000;
        $flake.clone().appendTo('body').css({
            left: startPositionLeft,
            opacity: startOpacity,
            'font-size': sizeFlake,
            color: options.randColor?getRandomColor:options.flakeColor
        }).animate({
            top: endPositionTop,
            left: endPositionLeft,
            opacity: 0.4    //雪花透明度
        },
        durationFall,'linear',function(){
            $(this).remove();
        });
        if(getSnowCookie('showSnow') == 'false') clearInterval(interval);//停止
    }, options.newOn);
}

//关闭弹窗
function closePop(){
    $("#mk-pop-box").toggle(1000);
}

//启动、停止音乐
function stopMusic(){
    if(getSnowCookie('playMusic') == 'false')
    {
        $('.close-music').html('关闭音乐');
        setSnowCookie('playMusic',true);   //更新cookie
        $('#m_bg_music')[0].play();
    }else{
        $('.close-music').html('开启音乐');
        setSnowCookie('playMusic',false);   //更新cookie
        $('#m_bg_music')[0].pause();
    }
}

//启动、停止下雪
function stopSnow(){
    if(getSnowCookie('showSnow') == 'false')
    {
        $('.close-snow').html('关闭雪花');
        setSnowCookie('showSnow',true);   //更新cookie
        snow();
    }else{
        $('.close-snow').html('开启雪花');
        setSnowCookie('showSnow',false);   //更新cookie
    }
}

//获取随机颜色值
var getRandomColor = function(){    
    return  '#' +    
    (function(color){    
        return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])    
        && (color.length == 6) ?  color : arguments.callee(color);    
    })('');    
};

//刷新页面前记录音乐播放时长
window.onunload = function(){
    remMusicTime();
};

//记录播放时长
function remMusicTime(){
    setSnowCookie('musicTime',$('#m_bg_music')[0].currentTime);
}

//写全目录cookies
function setSnowCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path=/";
}

//读Cookie
function getSnowCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

//判断是否是电脑浏览
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
