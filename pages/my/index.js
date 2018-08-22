//index.js
//获取应用实例
var app = getApp();
var api = require("../../utils/api.js");
Page({
    data: {
        show: 1
    },
    //事件处理函数
    onGotUserInfo: function(e) {
        let that = this;
        wx.login({
            success: function(r) {
                wx.request({
                    url: 'https://win-east.cn/blog/public/api/init/' + r.code,
                    method: 'GET',
                    success: function(openIdRes) {
                        console.info("登录成功返回的openId：", openIdRes);
                        // 判断openId是否获取成功
                        if (openIdRes.data.user_id) {
                            // 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
                            wx.getUserInfo({
                                success: function(data) {
                                    // 自定义操作
                                    // 绑定数据，渲染页面
                                    app.globalData.user_id = openIdRes.data.user_id;
                                    that.setData({
                                        show: 0
                                    })
                                },
                                fail: function(failData) {
                                    console.info("用户拒绝授权");
                                }
                            });
                        } else {
                            wx.request({
                                url: 'https://win-east.cn/blog/public/api/adduser',
                                method: 'POST',
								header: {
									'content-type': 'application/x-www-form-urlencoded' // 默认值
								},
                                data: {
                                    openId: openIdRes.data.openid,
                                    userData: e.detail.rawData
                                },
                                success: function(res) {
									console.log('添加用户',res)
                                    app.globalData.user_id = res.data.user_id
                                    that.setData({
                                        show: 0
                                    })
                                }
                            })
                        }
                    },
                    fail: function(error) {
                        console.info("获取用户openId失败");
                        console.info(error);
                    }
                })
            },
            fail: function(err) {
                console.error("wx.login失败", err);
                reject('wx.login失败');
            }
        })
    },
    onLoad: function(option) {
        var that = this;

        //调用应用实例的方法获取全局数据
        // app.getUserInfo().then(function(userInfo){
        //   that.setData({ 
        //     userInfo: userInfo
        //   })
        // })

        // this.setData({
        //   bankId: option.bank_id,
        //   supportLogo: app.globalData.supportLogo,
        //   supportText: app.globalData.supportText
        // });

        // app.globalData.bankId = option.bank_id ? option.bank_id : '';



    },
    onShow: function() {
		var that=this;
        if (app.globalData.user_id) {
            that.setData({
                show: 0
            })
        }
    }
})