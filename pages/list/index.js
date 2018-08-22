//index.js
//获取应用实例
var app = getApp();
var api = require("../../utils/api.js");
Page({
	data: {
		userInfo: {},
		dataCount: 0,
		cid: 0,
		list: [],

		adList: [],// 广告列表
		setIntervalTime: 0,
		adShow: false, // 广告展示
		adList: [] // 广告列表 

	},
	//事件处理函数
	onLoad: function (option) {
		var that = this;
		wx.request({
			url: 'https://win-east.cn/blog/public/api/allart/' + option.cid,
			success: function (res) {
				console.log(res)
				that.setData({
					list: res.data.special
				})
			}
		})
		api.request('/mina/wensi/index/getSource', 'GET', { page: 1, pagecount: 20, cid: option.cid }).then(function (data) {
			that.setData({
				cid: option.cid,
				dataCount: data.data_count,
				list: data.data
			});
		})


		if (app.globalData.listAdNav == 1) {
			return;
		}

		wx.request({
			url: 'https://win-east.cn/blog/public/api/popp',
			success: function (data) {
				// 没有广告，广告页不显示
				if (data.data.status == 10000) {
					return;
				}
				that.setData({
					adShow:1,
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
	},

	topicContent: function (e) {
		var that = this;
		app.globalData.type = 4;
		wx.navigateTo({
			url: '/pages/detail/index?cid=' + e.currentTarget.dataset.cid
		})
	},



	// 广告关闭按钮
	close: function () {
		this.setData({
			adShow: false
		});

		// 跳转过来把全局变量 变成1 (判断是否是第一次进入广告)
		app.globalData.listAdNav = 1;
		clearInterval(this.data.setIntervalTime);
	},


})