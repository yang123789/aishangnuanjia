var App = getApp();
var timer = null;
Page({
  data: {
    wxapp: null,
    active:0,
    id:null,
    detail: [],
    disabled: false,
    state:3,
    dp:1,
    qrimages:'',
    ordernum:'',
    disabled:false
  },

  onLoad: function (options) {
    var that = this;
    //页面启动后 调取首页的数据
    that.setData({
      wxapp:wx.getStorageSync('wxapp'),
      id: options.id
    });
    App.wx_setcolor(that.data.wxapp);
  },

  onShow: function () {
    var that = this;
    that.orderdetail();
    
    
    
  },
  onUnload:function(){
    clearTimeout(timer);
  },
  //获取订单信息
  orderdetail:function(){
    var that=this;
    App._get('order/detail', {
      id: that.data.id
    }, function (result) {
      console.log(result)
      let active = 0;
      //格式化商品状态
      var item = result.data.order;
      if (item.pay_status == "20" && item.order_status == "10" && item.receipt_status == "10") {
        item.showText = "进行中";
        item.BTText = "已付款";
        item.BTtype = 'primary';
        active = 2;
      }

      if (item.pay_status == "10" && item.order_status == "10" && item.receipt_status == "10") {
        item.showText = "待付款";
        item.BTText = "提交订单";
        item.BTtype = 'danger';
        active = 1;
      }
      if (item.pay_status == "20" && item.order_status == "30" && item.receipt_status == "20") {
        item.showText = "已完成";
        item.BTText = "订单已完成";
        item.BTtype = 'default';
        active = 3;
      }
     
      that.setData({
        detail: item,
        active: active
      });
      if (item.type == 1 && active == 2) {
        var qrimages = 'http://test.erp.aishangnuanjia.com/qrcode/build?text=' + item.order_no + '&label=&logo=0&labelhalign=6&labelvalign=1&foreground=%23333333&background=%23ffffff&size=300&padding=10&logosize=50&labelfontsize=14&errorcorrection=medium';
        that.setData({
          qrimages: qrimages
        })

      } else if (item.type == 1 && active == 3) {
        var qrimages = 'http://test.erp.aishangnuanjia.com/qrcode/build?text=' + item.order_no + '&label=&logo=0&labelhalign=6&labelvalign=1&foreground=%23989898&background=%23ffffff&size=300&padding=10&logosize=50&labelfontsize=14&errorcorrection=medium';
        that.setData({
          qrimages: qrimages
        })
      }
      
      if (active == 2 && item.type == 1){
       timer = setTimeout(function () {
         that.orderdetail();
       }, 1000)
      } else if (active == 2 && item.type == 3){
        clearInterval(timer);
      }
    });
  },
  //核销

  TapCancel: function () {
    let that = this;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post('order/cancel', { 'id': that.data.id }, function (result) {
            wx.navigateBack();
          });
        }
      }
    });
  },
  finishButton:function(){
      App._post('order/finish', { 'id': that.data.id }, function (result) {
     
        wx.redirectTo({
          url: './detail?id=' + that.data.id
        })
      
      });
      return;
  },
  onClicktjButton: function () {
    let that = this;
    if (that.data.disabled) {
      return false;
    }
    that.data.disabled = true;

    wx.showLoading({
      title: '正在处理...'
    });

    //如果是确认收货
    // if (that.data.active==2){
    //   App._post('order/finish', { 'id': that.data.id }, function (result) {
    //     console.log('success');
    //     wx.redirectTo({
    //       url: './detail?id=' + that.data.id
    //     })
    //   }, function (result) {
    //     console.log(result);
    //   }, function () {
    //     that.data.disabled = false;
    //   });
    //   return;
    // }

    App._post('order/order_pay', { 'id': that.data.id}, function (result) {
      console.log('success');
      //这里发起支付
      that.wx_pay_fun(result.data);
    }, function (result) {
      console.log(result);
    }, function () {
      that.data.disabled = false;
    });
  },
  wx_pay_fun: function (Rdata) {
    let that = this;
    // 发起微信支付
    wx.requestPayment({
      'timeStamp': Rdata.timestamp,
      'nonceStr': Rdata.nonceStr,
      'package': Rdata.package,
      'signType': Rdata.signType,
      'paySign': Rdata.paySign,
      success: function (res) {
        console.log('支付成功');
        // 跳转到订单展示界面
        wx.request({
          url: 'https://test.static.aishangnuanjia.com/addons/litestore/api.order/huidiao',
          data: {
            order_no: Rdata.order_sn,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            wx.redirectTo({
              url: './detail?id=' + that.data.id
            })
          }
        });
        
      },
      fail: function (res) {
        console.log(res);
        App.showError('订单未支付', function () {
          // 跳转到未付款订单展示界面

        });
      },
    });
  }

})