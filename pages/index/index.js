var app = getApp()

var order = ['red', 'yellow', 'blue', 'green', 'red']
var l=[];
var GetList = function (that) {
	that.setData({
		hidden: true
	});
	wx.request({
		url: 'https://win-east.cn/blog/public/api/recomart',
		success: function (data) {
			console.log('11111',data)
			if(data.data.status==10001){
        l = data.data.art;
				for (var i = 0; i < l.length; i++) {
          l[i].art_show_click > 10000 && (l[i].art_show_click =''+ parseInt(l[i].art_show_click / 10000) + (parseInt(l[i].art_show_click % 10000 / 1000) < 1 ? '.1' : parseInt(l[i].art_show_click % 10000 / 1000))+'万');
				}
				that.setData({
          list: l.slice(0,10)
				});
        console.log('ll',l)
			}
		}
	})
}


Page({

	// 页面的初始数据
	data: {
		userInfo: {},
		page: 1,
    count:10,
		// loadingHidden: false,
		// support: '',  //技术支持文字，

		// tab
		slide: [],
		category: [], // 专栏
		column: [],  // 专题
		indicatorActiveColor: '#ffce08',
		indicatorColor: '#cdcdcd',
		indicatorDots: true,
		autoplay: true,
		interval: 5000,
		duration: 1000,
		recommendTopic:[
		],

		// title: '精选专栏',
		fixImg: '',

		hidden: true,
		list: [],
		lower: false,
		scrollHeight: 0,

		adList: [],// 广告列表
		setIntervalTime: 0,
		adShow: false, // 广告展示
		adList: [] // 广告列表 
	},
	onLoad: function (options) {
		var that = this;

		if (app.globalData.indexAdNav == 1) {
			return;
		}
		wx.request({
			url: 'https://win-east.cn/blog/public/api/midp',
			success: function (data) {
				// 没有广告，广告页不显示
				if (data.data.status == 10000) {
					
					return;
				}
				that.setData({
					adShow: true,					
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
  navigateFun: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/list/index?cid=' + e.currentTarget.dataset.id
    })
  },
	onShow: function () {
		var that = this;

		// 请求广告接口 
		// this.getAdList();

		app.globalData.column_id = 0;
		app.globalData.column_source = 0;
		app.globalData.supportBack = 0;
    wx.request({
      url: 'https://win-east.cn/blog/public/api/recomspe',
      success:function(res){
        that.setData({
          recommendTopic: res.data.special
        })
        console.log('10',res.data.special)
      }
    })
		wx.request({
			url: 'https://win-east.cn/blog/public/api/pol',
			success: function (data) {
				that.setData({
					slide: data.data.pol
				})
			}
		})
		wx.request({
			url: 'https://win-east.cn/blog/public/api/recom',
			success: function (res) {
				that.setData({
					merge_c: res.data.column
				})
				console.log(res)
			}
		})
		wx.request({
			url: 'https://win-east.cn/blog/public/api/mid',
			success: function (res) {
				that.setData({
					fixImg: res.data.advert.advert_img_url
				})
				console.log(res)
			}
		})
		wx.getSystemInfo({
			success: function (data) {
				// var minWindowHeight = data.windowHeight - 90;
				var minWindowHeight = data.windowHeight;
				that.setData({
					scrollHeight: minWindowHeight
				});
			}
		});

		this.setData({
			page: 1
		});

		GetList(that);
	},


	changeIndicatorDots: function (e) {
		this.setData({
			indicatorDots: !this.data.indicatorDots
		})
	},

	changeAutoplay: function (e) {
		this.setData({
			autoplay: !this.data.autoplay
		})
	},


	mergeNav: function (e) {
		// category
		if (e.currentTarget.dataset.id) {
			wx.navigateTo({
				url: '/pages/list1/index?cid=' + e.currentTarget.dataset.id
			})
		}
	},



	// 广告关闭按钮
	close: function () {
		this.setData({
			adShow: false
		});

		// 跳转过来把全局变量 变成1 (判断是否是第一次进入广告)
		app.globalData.indexAdNav = 1;
		clearInterval(this.data.setIntervalTime);
	},

	// 文章跳转
	topicNav: function (e) {
		app.globalData.type = 4;

		// 本地存储 文章详情页的 分类id， 文章id
		wx.setStorage({
			key: 'detailCid',
			data: e.currentTarget.dataset.cid
		})

		wx.setStorage({
			key: "detailId",
			data: e.currentTarget.dataset.id
		})

		wx.navigateTo({
			url: '/pages/detail/index?cid=' + e.currentTarget.dataset.id 
		})
	},


	bindDownLoad: function () {
		let that = this;
    that.setData({
      list:l.slice(0,that.data.count+10),
      count:that.data.count+10
    })
	}

})