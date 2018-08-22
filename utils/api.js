// 通用API封装
var Promise = require("../libs/es6-promise.min.js");

// 正式接口地址
var url = "http://www.win-east.cn/wins/";
// var url = "https://apib7s.wboll.com";
 // var url = "http://192.168.1.25:8000";

function exec(uri, method, params, cb) {
  var cb = typeof cb === "function" ? cb : function() {};
  console.log(uri)
  wx.request({
    url: url + uri,
    dataType: "json",
    data: params,
    method: method,
    header: {
      // 'Content-Type': 'application/json'
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
        cb(res.data);

    },
    fail: function(r) {
      console.log("调用api.exec()失败", arguments);
      wx.showToast({
        title: '发生错误',
        icon: 'loading',
        duration: 2000
      });
    }
  })
}

// callback 方式
exports.exec = exec;

// Promose 获取API
exports.request = function(uri, method, params) {
  return new Promise(function(resolve, reject) {
    getApp().getUserInfo().then(function(userInfo) {

      // 注入access token
      params.token = userInfo.token;

      wx.request({
        url: url + uri,
        dataType: "json",
        data: params,
        method: method,
        header: {
          // 'Content-Type': 'application/json'
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
            resolve(res.data.body);
        },
        fail: function(r) {
          reject('调用api.exec()失败');
          console.error("调用api.exec()失败", arguments);
          wx.showToast({
            title: '发生错误',
            icon: 'loading',
            duration: 2000
          });
        }
      });

    }).catch(function(err) {
      reject(err);
    });

  });
}
