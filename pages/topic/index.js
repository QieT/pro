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
  onLoad: function () {

    var that = this;

    if (app.globalData.topicAdNav == 1) { 
      that.setData({
        adShow: false
      })
      return; 
    }
	  wx.request({
		  url: 'https://win-east.cn/blog/public/api/popp',
		  success: function (data) {
			  // 没有广告，广告页不显示
			  console.log(12345,data)
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
  },
  
  onShow:function () {
	  var that = this;
	  wx.request({
		  url: 'https://win-east.cn/blog/public/api/col',
		  success:function(data){
			  console.log(data)
			  that.setData({
				  columnArray: data.data.column
			  });
		  }
	  })
    console.log('app.globalData.column_id===', app.globalData.column_id);


    // column_id: 0,
    // column_source: 0, // 0 点击底部导航，1 点击水滑动的专栏
    // supportBack: 0, // 0 1 版权信息页面返回


    if (app.globalData.column_source == 1) {

      // 水滑动的专栏
      console.log('-------水滑动专栏进入,column_id-------' + app.globalData.column_id);
      this.common(app.globalData.column_id);
    } else if (app.globalData.supportBack == 1) {

      console.log('-------版权信息页面返回,column_id-------' + app.globalData.column_id);
      app.globalData.supportBack = 0;
      this.common(app.globalData.column_id);
    } else if (app.globalData.column_source == 0) {


      // 跳转到广告页面
      app.globalData.type = 2;


      // 底部导航进入
      console.log('-------底部导航进入,column_id-------' + app.globalData.column_id);
      api.request('/mina/wensi/index/index', 'GET', {}).then(function(data) {

        app.globalData.column_id = data.merge_c[0].id;
        that.common(app.globalData.column_id);
      })
    }
  },

  common: function (obj) {

    var that = this;
    api.request('/mina/wensi/index/getCategory', 'GET', {column_id: obj}).then(function(data) {
      that.setData({
        columnArray: data
      });
    })
  },

  navigateFun:function (e) {

    wx.navigateTo({
      url: '/pages/topic1/index?cid=' + e.currentTarget.dataset.cid
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
  }
})
