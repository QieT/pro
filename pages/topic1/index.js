//index.js
//获取应用实例
var app = getApp();
var api = require("../../utils/api.js");
Page({
	data: {
		userInfo: {},
		columnArray: [],
		navGlobalColumnId: 0,

		adList: [],// 广告列表
		setIntervalTime: 0,
		adShow: false, // 广告展示
		adList: [] // 广告列表 
	},
	//事件处理函数
	onLoad: function (option) {

		var that = this;

		if (app.globalData.topicAdNav == 1) {
			that.setData({
				adShow: false
			})
			return;
		}
		wx.request({
			url: 'https://win-east.cn/blog/public/api/colp',
			success: function (data) {
				console.log('111',data)
				// 没有广告，广告页不显示
				if (data.data.status == 10000) {
					that.setData({
						adShow: false
					})
					return;
				}
				that.setData({
					adShow: true
				})
				that.setData({
					adList: data.data.advert
				})


				// 广告定时器
				var time = 4;
				that.data.setIntervalTime = setInterval(function () {

					time--;
					console.log(222, time);
					if (time <= 0) {
						that.setData({
							adShow: false
						});

						// 跳转过来把全局变量 变成1 (判断是否是第一次进入广告)
						app.globalData.indexAdNav = 1;
						clearInterval(that.data.setIntervalTime);
					}
				}, 1000);
			}
		})
		wx.request({
			url: 'https://win-east.cn/blog/public/api/spe/' + option.cid,
			success: function (data) {
				console.log(data)
				that.setData({
					columnArray: data.data.special
				});
			}
		})
	},
	navigateFun: function (e) {

		app.globalData.type = 3;

		wx.navigateTo({
			url: '/pages/list/index?cid=' + e.currentTarget.dataset.cid
		})
	},



	// 广告关闭按钮
	close: function () {
		this.setData({
			adShow: false
		});

		// 跳转过来把全局变量 变成1 (判断是否是第一次进入广告)
		app.globalData.topicAdNav = 1;
		clearInterval(this.data.setIntervalTime);
	},


	// 版权信息跳转
	supportNav: function () {
		wx.navigateTo({
			url: '/pages/companyinfo/index?column_id=' + app.globalData.column_id
		})
	}

})
