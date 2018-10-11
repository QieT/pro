//index.js
//获取应用实例
var app = getApp();
var allList=[];
Page({
  data: {
    userInfo: {},
    dataCount: 0,
    cid: 0,
    list: [],
    count:10,
    adList: [],// 广告列表
    setIntervalTime: 0,
    adShow: false, // 广告展示
    adList: [] // 广告列表 

  },
  //事件处理函数
  onLoad: function (option) {
    var that = this;
    wx.request({
      url: 'https://win-east.cn/blog/public/api/comart/' + option.cid,
      data:{
        user_id:app.globalData.user_id
      },
      success: function (res) {
        if (res.data.art[0]) {
          allList = res.data.art
          for (var i = 0; i < allList.length; i++) {
            allList[i].art_show_click > 10000 && (allList[i].art_show_click = '' + parseInt(allList[i].art_show_click / 10000) + (parseInt(allList[i].art_show_click % 10000 / 1000) < 1 ? '.1' : parseInt(allList[i].art_show_click % 10000 / 1000)) + '万');
        }

          let l = allList.slice(0,10);        
          that.setData({
            list: l
          })
        }
      }
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
          adShow: 1,
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
    let that = this;
    app.globalData.type = 4;
    wx.navigateTo({
      url: '/pages/detail/index?cid=' + e.currentTarget.dataset.cid
    })
  },

  moreArt: function () {
    let that = this;
    that.setData({
      list: allList.slice(0, that.data.count + 10),
      count: that.data.count + 10
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
