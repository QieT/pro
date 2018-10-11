// pages/select/index.js
var allList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    count:10
  },
  topicContent: function (e) {
    var that = this;
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
  select:function(e){
    let that=this;
    console.log(e)
    if (e.detail.value){
    wx.request({
      url: 'https://win-east.cn/blog/public/api/search/' + e.detail.value,
      success:function(res){
        if (res.data.art[0]) {
          allList = res.data.art
          for (var i = 0; i < allList.length; i++) {
            allList[i].art_show_click > 10000 && (allList[i].art_show_click = '' + parseInt(allList[i].art_show_click / 10000) + (parseInt(allList[i].art_show_click % 10000 / 1000) < 1 ? '.1' : parseInt(allList[i].art_show_click % 10000 / 1000)) + '万');
          }

          let l = allList.slice(0, 10);
          that.setData({
            list: l
          })
        }
      }
    })
  }else{
      that.setData({
        list: []
      })
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})