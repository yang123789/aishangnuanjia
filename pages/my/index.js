let App = getApp();

Page({

  data: {
    userInfo: {
      id: 0,
      avatar: '/assets/img/avatar.png',
      nickname: '游客',
      balance: 0,
      score: 0,
      level: 0,
      group_id: 1,
      mobile:"NoLoginData",
    },
    datanum:[],
    noticeList: []
  },

  onLoad: function (options) {
    var that = this;
    App.Log_after_fun(function (ret) {
      if (App.globalData.userInfo) {
        that.setData({ userInfo: App.globalData.userInfo });
      }
    });
    App._get('user/news_list', { page: 1, pagenum: 3 }, function (res) {
      if (res.data.length > 0) {
        that.setData({ noticeList: res.data });
      }
    })
  },
  go:function(e){
    if (App.globalData.userInfo.mobile == "NoLoginData"){
      wx.showModal({
        title: '未登录',
        content: '请前往我的页面登陆',
        success(res) {}
      })
    }else{
      var url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url,
      })
    }
   
  },
  goMdetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mess/messDetail?id=' + id,
    })
  },
  onShow: function () {
    //刷新 订单的数量信息
    let that = this;
    App._get('order/Get_order_num', {}, function (result) {
      that.setData({
        datanum: result.data
      });
    });
  },
  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg);
    console.log(e.detail.userInfo);
    console.log(e.detail.rawData);
    if (e.detail.userInfo == undefined) {
      return;
    }
    //这里先本地赋值;
    App.globalData.userInfo.avatar = e.detail.userInfo.avatarUrl;
    App.globalData.userInfo.nickname = e.detail.userInfo.nickName;
    App.globalData.userInfo.mobile = App.globalData.userInfo.mobile == "NoLoginData" ? '' : App.globalData.userInfo.mobile;
    //提交到 服务器
    var token = wx.getStorageSync('token') || '';
    var that = this;

    wx.request({
      url: App.api_url + 'user/Updata_user_hawk',
      data: {
        userInfo: e.detail.rawData,
        mobile: App.globalData.userInfo.mobile,
        token: token
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (lres) {
        console.log(lres);
        that.setData({ userInfo: App.globalData.userInfo });
      }
    });
  },
 
})