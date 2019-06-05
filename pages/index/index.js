let App = getApp();
Page({
  data: {
    // banner轮播组件属性
    indicatorDots: true, // 是否显示面板指示点	
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长
    wxapp:[],
    newlist:[],
    randomlist: [],
    banner:[],
    category:[],
    re_value: '',
    noticeList: [],
    pos:'',
    yzarray:[],
    pindex:''
  },
  onLoad: function (options) {
    //页面启动后 调取首页的数据
    let that = this;
    App.getStorageSyncwxapp(function (ret) {
      that.setData({
        wxapp: ret
      });
      wx.setNavigationBarTitle({
        title: ret.LiteName
      });
    });
    that.apilist(1);
    that.getUserLocation();
    that.yzlist();
  },
  getlocation:function(){
    var that=this;
    that.getUserLocation();
  },
  yzvalue: function (e) {
    var _this=this;
    _this.setData({
      pindex: e.detail.value
    })
    var yzarray = _this.data.yzarray;
    for (var i = 0; i < yzarray.length;i++){
      if (i == e.detail.value){
        _this.apilist(yzarray[i].id);
        wx.setStorageSync('pos', yzarray[i]);
      }
    }
  },

//驿站列表
yzlist:function(){
  var that=this;
  App._post('user/stationlist', {}, function (res) {
    that.setData({
      yzarray: res.data
    })
  });
},
  //定位方法
  getUserLocation: function () {
    var _this = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.geo();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.geo();
        }
        else {
          console.log('授权成功')
          //调用wx.getLocation的API
          _this.geo();
        }
      }
    })

  },

  // 获取定位城市
  geo: function () {
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        var speed = res.speed;
        var accuracy = res.accuracy;
       
        App._post('user/getdistance', { lat1: latitude, lng1: longitude}, function (result) {
          _this.setData({
            pos: result.data
          });
          
          wx.setStorageSync('pos', result.data);
          var yzarray = _this.data.yzarray
          for (var i = 0; i < yzarray.length;i++){
            if (result.data.id == yzarray[i].id){
              console.log(i+'ppppp')
              _this.setData({
                pindex:i
              })
            }
          }
          _this.apilist(result.data.id)
        });
       
      }
    })
  },
  apilist: function (supplierid){
    var that=this;
    App._post('index/index', { supplierid: supplierid }, function (result) {
     that.setData({
       newlist: result.data.NewList,
       randomlist: result.data.Randomlist,
       banner: result.data.bannerlist
     });

   });

    App._get('user/news_list', { page: 1, pagenum: 3, supplierid: supplierid }, function (res) {
     if (res.data.length > 0) {
       that.setData({ noticeList: res.data });
     }
   })
 },
  onShow: function () {
    //这里获得最近的商品数据 随机商品数据
    let that = this;
    App._get('category/Showlist', {}, function (result) {
      that.setData({
        category: result.data.categorydata
      })
      
    });

  },
  goclassify:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id;
    App.globalData.activeid = id;
    wx.switchTab({
      url: '/pages/category/index',
    })
  },
  onSearchchange: function (event) {
    this.setData({
      re_value: event.detail
    })
  },
  goMdetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mess/messDetail?id=' + id,
    })
  },
  onSearch: function (event) {
    console.log(this.data.re_value);
    //这里跳转到  搜索页
    wx.navigateTo({
      url: '/pages/category/list?rename=1&name=' + this.data.re_value
    })
  },
  onShareAppMessage: function () {
    return {
      title: "小程序商城首页",
      desc: "",
      path: "/pages/index/index"
    };
  }
})