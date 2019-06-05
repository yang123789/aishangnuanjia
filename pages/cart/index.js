// pages/footprint/footprint.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    footlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
 
   
  },
  gogoods: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/index?goods_id=' + id,
    })
  },
  settlement: function (e) {
   
    var id = e.currentTarget.id;
    App._get('cart/doadd', { id: id }, function (res) {
      wx.navigateTo({
        url: '/pages/cart/checout?type=' + 'cart',
      })
    })
  },
  //删除商品
  del:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    
    App._get('cart/deletecart', { id: id }, function (res) {
      var footlist = that.data.footlist;
that.onShow();
      
    })
    
   
  },
  //商品减
  minus:function(e){
    var that=this;
    var id = e.currentTarget.dataset.id;
    var footlist=that.data.footlist;
    for (var i in footlist){
      var arr = footlist[i].list;
      for (var j in arr){
        if (id == arr[j].id){
          console.log(arr[j].id)
          var goodsid = arr[j].id;
         
          if (arr[j].goods_num<=1){
            wx.showToast({
              title: '商品数量不能小于1',
              icon: 'none',
              duration: 1000
            })
          }else{
            arr[j].goods_num = arr[j].goods_num - 1;
            App._get('cart/reduce', { id: id ,type: 2}, function (res) {
              that.setData({
                footlist: footlist
              })
            })
          }
          
        }
      }
    }
    
  },
  //商品数量增加
  plus: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var footlist = that.data.footlist;
    App._get('cart/reduce', { id: id, type: 1 }, function (res) {
      //console.log(res)
      if (res == 1) {
        wx.showToast({
          title: '商品库存不足',
          icon: 'none',
          duration: 1000
        })
      } else {
        for (var i in footlist) {
          var arr = footlist[i].list;
          for (var j in arr) {
            if (id == arr[j].id) {
              var goodsid = arr[j].id;
              arr[j].goods_num = arr[j].goods_num+1;
              that.setData({
                footlist: footlist
              })
            }
          }
        }
       
       
      }

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
    if (App.globalData.userInfo.mobile == "NoLoginData") {
      var that = this;
      that.setData({
        footlist: ''
      })
      wx.showModal({
        title: '未登录',
        content: '请前往我的页面登陆',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/my/index',
            })
          }
        }
      })
    }else{
      var that = this;
      App._get('cart/clear', {}, function (res) {

      });
      App._get('cart/getlists2', {}, function (res) {
        console.log(res.data)
        that.setData({
          footlist: res.data
        })
      })
    }

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