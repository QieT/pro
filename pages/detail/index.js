//index.js
//获取应用实例
var app = getApp();
var api = require("../../utils/api.js");
var WxParse = require('../../wxParse/wxParse.js');
Page({
    onReady: function(e) {
        // 使用 wx.createAudioContext 获取 audio 上下文 context
        this.audioCtx = wx.createAudioContext('myAudio');
        this.videoContext = wx.createVideoContext('myVideo');
        // this.audioCtx = wx.createAudioContext('audio')
    },
    data: {
        info: {},
        id: 0,
        cid: 0,
        userInfo: {},
        loginNum: 0, // 首次进入
        clickNum: 0, // 判断音频播放，暂停
        // totleTime: '00:00', // 音频总时长
        totleTime: '', // 音频总时长
        showTime: '00:00', // 音频播放时长
        animationData: {}, // 音频动画
        progress: 0, // 进度条

        title: '', // 文章标题，传递给后台

        adList: [], // 广告列表
        setIntervalTime: 0,
        source_click: 0,
        adShow: false, // 广告展示
        adList: [] // 广告列表 
    },
    timestampToTime: function(timestamp) {
        let date = new Date(timestamp * 1000), //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            Y = date.getFullYear() + '-',
            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
            D = date.getDate() + ' ',
            h = date.getHours() + ':',
            m = date.getMinutes() + ':',
            s = date.getSeconds();
        return Y + M + D + h + m + s;
    },
    onLoad: function(options) {
		wx.showLoading({
			title: '加载中',
		})
        var that = this;
        that.setData({
            art_id: options.cid
        })
        if (app.globalData.user_id) {
            wx.request({
                url: 'https://win-east.cn/blog/public/api/isart/' + options.cid + '/' + app.globalData.user_id,
                success: function(res) {
                    console.log('1', res.data.msg)
                    if (res.data.msg) {
                        that.setData({
                            source_click: 1
                        })
                    }
                }
            })
        }

        wx.request({
            url: 'https://win-east.cn/blog/public/api/getartcom/' + options.cid + '/' + app.globalData.user_id + '/0',
            success: function(res) {
                console.log(2, res);
                if (!res.data.comment) {
                    return
                }
                for (let i = 0; i < res.data.comment.length; i++) {
                    res.data.comment[i].com_time = that.timestampToTime(res.data.comment[i].com_time);
                }
                that.setData({
                    comment: res.data.comment
                })
            }
        })
        wx.request({
            url: 'https://win-east.cn/blog/public/api/art/' + options.cid,
            success: function(res) {
				if (!res.data.art){
					that.setData({
						show:0
					})
					return
				}
				WxParse.wxParse('article', 'html', res.data.art.art_content, that);				
				that.setData({
					info: res.data.art,
					show:1
                });
				wx.hideLoading()
            }
        })
    },

    onUnload: function() {
        app.globalData.type = 1;
    },


    // 渲染文章列表页

    audioPlayPause: function(e) {

        this.data.clickNum++;
        if (this.data.clickNum % 2 == 0) {
            console.log('点击-pause', e);
            return this.audioCtx.pause()
        }
        this.audioCtx.play();

        this.data.loginNum++;


        // 首次点击 播放比较慢，加载资源
        if (this.data.loginNum == 1) {
            wx.showLoading({
                title: '加载中',
            })
        }
    },


    bindtimeupdate: function(e) {
        var that = this;

        if (this.data.loginNum == 1) {
            wx.hideLoading();
        }

        // 设置音频时间
        console.log('currentTime=', e.detail.currentTime);
        console.log('duration=', e.detail.duration);

        var totMinute = Math.floor(e.detail.duration / 60);
        var totSecond = Math.ceil(e.detail.duration - totMinute * 60);

        var curMinute = Math.floor(e.detail.currentTime / 60);
        var curSecond = Math.ceil(e.detail.currentTime - curMinute * 60);

        this.zero(curMinute);
        this.zero(curSecond);
        this.zero(totMinute);
        this.zero(totSecond);

        var progress = (e.detail.currentTime / e.detail.duration) * 100 + '%'
        this.setData({
            showTime: this.zero(curMinute) + ':' + this.zero(curSecond),
            totleTime: this.zero(totMinute) + ':' + this.zero(totSecond),
            progress: progress
        })
    },

    // 音乐播放完成
    bindended: function() {
        console.log('结束');
    },
    // 音频时间补 0 
    zero: function(pro) {
        if (pro < 10) {
            pro = '0' + pro;
        }
        return pro;
    },

    // 留言
    liuyanNav: function(e) {
		if (!app.globalData.user_id) {
			wx.showToast({
				title: '请授权后操作',
				icon: 'none',
				duration: 1000
			})
			return
		}
        if (this.data.info.video) {
            this.videoContext.pause();
        }

        if (this.data.info.audio) {
            this.audioCtx.pause();
        }
        wx.navigateTo({
            url: '/pages/liuyan/index?title=' + e.currentTarget.dataset.title + '&cid=' + e.currentTarget.dataset.cid
        })
    },

    // 素材点赞 
    topicZan: function() {
        var that = this;
		if (!app.globalData.user_id){
			wx.showToast({
				title: '请授权后操作',
				icon: 'none',
				duration: 1000
			})
			return
		}
        if (this.data.source_click == 1) {
			wx.request({
				url: 'https://win-east.cn/blog/public/api/repoint/art/' + app.globalData.user_id + '/' + that.data.art_id,
				success: function (res) {
					console.log(res)
					if (res.data.status == 10001) {
						that.data.info.art_show_like--;
						that.setData({
							info: that.data.info,
							source_click: 0
						})
					}
				}
			})
            return
        }
        wx.request({
            url: 'https://win-east.cn/blog/public/api/agree/' + that.data.art_id + '/' + app.globalData.user_id,
            success: function(data) {
				that.data.info.art_show_like ++;
                that.setData({
					info: that.data.info,
                    source_click: 1
                })
            }
        })

    },

    // 评论列表点赞 
    clickZan: function(e) {
        var that = this;
		if (!app.globalData.user_id) {
			wx.showToast({
				title: '请授权后操作',
				icon: 'none',
				duration: 1000
			})
			return
		}
        var liuyanNum = e.currentTarget.dataset.num;
        var liuyanNo = e.currentTarget.dataset.no;
        console.log('liuyanNum=', liuyanNum);

        var comment = that.data.comment;

        // 评论点赞过
        if (comment[liuyanNo].is_agree == 1) {
			wx.request({
				url: 'https://win-east.cn/blog/public/api/repoint/com/' + app.globalData.user_id + '/' + liuyanNum,
				success: function (res) {
					console.log(res)
					if (res.data.status==10001){
					comment[liuyanNo].is_agree = 0;
					comment[liuyanNo].com_approve--;
					that.setData({
						comment: comment
					})
					}
				}
			})
            return
        }
        wx.request({
            url: 'https://win-east.cn/blog/public/api/comagree/' + liuyanNum + '/' + app.globalData.user_id,
            success: function(res) {
                console.log(res)
                comment[liuyanNo].is_agree = 1;
                comment[liuyanNo].com_approve++;
                that.setData({
                    comment: comment
                })
            }
        })
    },

    // 广告关闭按钮
    // close: function () {
    //   this.setData({
    //     adShow: false
    //   });

    //   // 跳转过来把全局变量 变成1 (判断是否是第一次进入广告)
    //   app.globalData.detailAdNav = 1;
    //   clearInterval(this.data.setIntervalTime);
    // },

    // 转发
    onShareAppMessage: function(res) {


        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(1111, res.target)
        }
        return {
			title: this.data.info.art_title,
            path: '/pages/detail/index?cid=' + this.data.art_id,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }


})