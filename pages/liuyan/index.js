//index.js
//获取应用实例
var app = getApp();
var api = require("../../utils/api.js");
Page({
  onReady: function(e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  data: {
    userInfo: {},
    content: '',
    title: '',
    id: 0,
    cid: 0
  },
  //事件处理函数
  onLoad: function(option) {
    this.setData({
      title: option.title,
      cid: option.cid
    })
  },

  bindTextAreaBlur: function(e) {
    console.log(11, e.detail.value)
  },
  bindFormSubmit: function(e) {
    var that = this;
    console.log(22, e.detail.value.textarea)

    if (!e.detail.value.textarea) {
      wx.showToast({
        title: '留言不能为空',
        icon: 'loading',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: 'https://win-east.cn/blog/public/api/addcom',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        art_id: that.data.cid,
        user_id: app.globalData.user_id,
        com_art_title: that.data.title,
        com_content: e.detail.value.textarea
      },
      success: function(res) {
        console.log(res)
        if (res.data.status == 10001) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            complete: function() {
              wx.redirectTo({
                url: '/pages/detail/index?cid=' + that.data.cid,
              })
            }
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '格式错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

})