//index.js
//获取应用实例
var app = getApp();
var api = require("../../../utils/api.js");
Page({
    data: {
        userInfo: {},
        info: {}

    },
    //事件处理函数
    timestampToTime: function(timestamp) {
        let date = new Date(timestamp * 1000), //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            Y = date.getFullYear() + '-',
            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
            D = date.getDate() + ' ',
            h = date.getHours() + ':',
            m = date.getMinutes() + ':',
            s = date.getSeconds();
        return Y + M + D + h + m + s;
    },
    onLoad: function(option) {


    },
    onShow: function() {
        var that = this;
        if (!app.globalData.user_id) {
            wx.showToast({
                title: '请授权后查看',
                icon: 'none',
                duration: 1000
            })
            return
        }
        wx.request({
            url: 'https://win-east.cn/blog/public/api/getcom/' + app.globalData.user_id + '/0',
            success: function(res) {
                console.log(res)
                for (let i = 0; i < res.data.comment.length; i++) {
                    res.data.comment[i].com_time = that.timestampToTime(res.data.comment[i].com_time)
                }
                that.setData({
                    info: res.data.comment
                })
            }
        })
    }

})