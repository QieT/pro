var Promise = require("libs/es6-promise.min.js");

App({
  // 全局对象
  globalData: {
    wid: 1999,
    // wid: 100019160,
    userInfo: null,
    column_id: 0,

    column_source: 0, // 0 点击底部导航，1 点击水滑动的专栏
    supportBack: 0, // 0 1 版权信息页面返回

    indexAdNav: 0, // 0 首页 广告没有跳转， 1 跳转了
    topicAdNav: 0, // 0 专栏页 广告没有跳转， 1 跳转了
    listAdNav: 0, // 0 图文列表页 广告没有跳转， 1 跳转了
    detailAdNav: 0, // 0 图文详情页 广告没有跳转， 1 跳转了
    type: 1, // 跳过广告 去哪个页面

    supportText: '微播易道提供技术支持',
    supportLogo: '/image/youka/wboll-logo.png'
  },
  onShow: function() {
    // var route = getCurrentPages()[getCurrentPages().length-1];
    // if ( route != 'pages/login/login' ) {
    //   if( !wx.getStorageSync('storeInfo') ) {
    //     wx.redirectTo({
    //       url: '/pages/login/login'
    //     })
    //   }
    // }
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    if (extConfig.wid) {
      this.globalData.wid = extConfig.wid;
    }
  },




  onLaunch: function () {
	  var that = this;
	  this.globalData.fkInfo = '';
	  var storeInfo = wx.getStorageSync('storeInfo');
	  return new Promise((resolve, reject) => {
		  var userInfo = this.globalData.userInfo;

		  // 从缓存中得到相关信息

		  // 调用登录接口
		  wx.login({ 
			  success: function (r) {
				  wx.request({
					  url: 'https://win-east.cn/blog/public/api/init/' + r.code,
					  method: 'GET',
					  success: function (openIdRes) {
						  console.info("登录成功返回的openId：", openIdRes);
						  // 判断openId是否获取成功
						  if (openIdRes.data.user_id) {
							  // 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
							  wx.getUserInfo({
								  success: function (data) {
									  // 自定义操作
									  // 绑定数据，渲染页面
									  that.globalData.user_id = openIdRes.data.user_id
								  },
								  fail: function (failData) {
									  console.info("用户拒绝授权");
								  }
							  });
						  } else {
							  wx.getUserInfo({
								  success: function (data) {
									  wx.request({
										  url: 'https://win-east.cn/blog/public/api/adduser',
										  method: 'POST',
										  header: {
											  'content-type': 'application/x-www-form-urlencoded' // 默认值
										  },
										  data: {
											  openId: openIdRes.data.openid,
											  userData: data.rawData
										  },
										  success: function (res) {
											  that.globalData.user_id = res.data.user_id
										  }
									  })
								  },
								  fail: function (failData) {
									  console.info("用户拒绝授权");
								  }
							  });
							  console.info("获取用户openId失败");
						  }
					  },
					  fail: function (error) {
						  console.info("获取用户openId失败");
						  console.info(error);
					  }
				  })
			  },
			  fail: function (err) {
				  console.error("wx.login失败", err);
				  reject('wx.login失败');
			  }
		  })
	  });
  },

  getUserInfo: function() {
   
  },

  logIn: function() {
    var that = this;
    this.globalData.storeInfo = '';

    return new Promise((resolve, reject) => {
      var storeInfo = this.globalData.storeInfo;
      if( storeInfo && typeof storeInfo.name != 'undefined') {
        resolve(storeInfo);
      } else {
        reject('没有登录');
      }
    })
  }

})