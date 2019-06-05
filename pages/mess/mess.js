// pages/mess/mess.js
let App = getApp();
var page=1;
var isfinish = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isfinish:false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
 loadmore:function(that) {
    if(that.data.isfinish) return;
    wx.showLoading({
      title: '正在加载中',
    });
   App._get('user/news_list', { page: page, pagenum: 10 }, function (res) {
     wx.hideLoading();
     console.log(res.data.length)
     if (res.data.length > 0) {
       var list = that.data.list;
       for (var i = 0; i < res.data.length; i++) {
         list.push(res.data[i]);
       }
       that.setData({ list: list });
       page++;

     } else {
       isfinish=true;
       wx.showToast({
         title: '已经 到底了~',
         icon: 'none',
         duration: 1000
       })
       
     }
     wx.stopPullDownRefresh();
   });
  },

  onLoad: function (options) {
    
  },
  godetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'messDetail?id='+id,
    })
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
    var that = this;
    that.setData({ list: [] });
    page=1;
    that.loadmore(that);
    
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
    var that = this;
   that.loadmore(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})