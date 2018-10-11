// pages/doctorself/index.js
var app = getApp();
var allList=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    artlist: [],
    toggle: '',
    doctor: {},
    count: 10
  },
  moreArt: function(){
    let that=this;
    that.setData({
      artlist: allList.slice(0,that.data.count+10),
      count:that.data.count+10
    })
  },
  todetail: function(e) {
    wx.navigateTo({
      url: '/pages/detail/index?cid=' + e.currentTarget.dataset.id
    })
  },
  changetoggle: function() {
    let that = this;
    that.setData({
      toggle: that.data.toggle ? '' : '1'
    })
    console.log(that.data.toggle)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.request({
      url: 'https://win-east.cn/blog/public/api/expdtl/',
      data: {
        exp_id: options.id,
        user_id: app.globalData.user_id
      },
      success: function(res) {
        let doctor = res.data.detail;
        doctor.read_total > 10000 && (doctor.read_total = '' + parseInt(doctor.read_total / 10000) + (parseInt(doctor.read_total % 10000 / 1000) < 1 ? '.1' : parseInt(doctor.read_total % 10000 / 1000)) + '万');
        if (res.data.art[0]) {
          let l;
          allList = res.data.art;  
          for (var i = 0; i < allList.length; i++) {
            allList[i].art_show_click > 10000 && (allList[i].art_show_click = '' + parseInt(allList[i].art_show_click / 10000) + (parseInt(allList[i].art_show_click % 10000 / 1000) < 1 ? '.1' : parseInt(allList[i].art_show_click % 10000 / 1000)) + '万');
          }
          if (allList.length > that.data.count) {
            l = allList.slice(0, that.data.count);
          } else {
            l = res.data.art;
          }
          that.setData({
            artlist: l
          })
        }
        that.setData({
          id: options.id,
          doctor: doctor
        })
        console.log(1, res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    if (!that.data.id) {
      return
    }
    wx.request({
      url: 'https://win-east.cn/blog/public/api/expdtl/',
      data: {
        exp_id: that.data.id,
        user_id: app.globalData.user_id
      },
      success: function(res) {
        let doctor = res.data.detail;
        doctor.read_total > 10000 && (doctor.read_total = '' + parseInt(doctor.read_total / 10000) + (parseInt(doctor.read_total % 10000 / 1000) < 1 ? '.1' : parseInt(doctor.read_total % 10000 / 1000)) + '万');
        if (res.data.art[0]) {
          let l;
          allList = res.data.art;  
          for (var i = 0; i < allList.length; i++) {
            allList[i].art_show_click > 10000 && (allList[i].art_show_click = '' + parseInt(allList[i].art_show_click / 10000) + (parseInt(allList[i].art_show_click % 10000 / 1000) < 1 ? '.1' : parseInt(allList[i].art_show_click % 10000 / 1000)) + '万');
          }
          if (allList.length > that.data.count) {
            l = allList.slice(0, that.data.count);
          } else {
            l = res.data.art;
          }
          that.setData({
            artlist: l
          })
        }
        that.setData({
          doctor: doctor
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})