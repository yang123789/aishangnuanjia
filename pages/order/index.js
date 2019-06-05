let App = getApp();
Page({

  data: {
    OrderList:[],
    active:0,
    isNoData:true,
  },


  onLoad: function (options) {
    let that = this;
    //页面启动后 调取首页的数据
    that.setData({
      wxapp: wx.getStorageSync('wxapp')
    });
    App.wx_setcolor(that.data.wxapp);

    if (options.showType){
      that.setData({
        active: options.showType
      });
    }
  },

  onShow: function () {
    //这里拖取 数据
    let that = this;
    App._get('order/my', {}, function (result) {
      console.log(result.data);
      //这里对状态 进行分类
      result.data.forEach(function(item, index, arr){
        if (item.pay_status == "20" && item.order_status == "10" && item.receipt_status == "10" ){
          arr[index].showText="进行中";
          arr[index].showType ="success";
          arr[index].showactive = 2;
          console.log(arr[index])
        }
  
        if (item.pay_status == "10" && item.order_status == "10" && item.receipt_status == "10") {
          
          arr[index].showText = "待付款";
          arr[index].showType = "danger";
          arr[index].showactive = 1;
         // console.log(arr[index])
        }
        if (item.pay_status == "20" && item.order_status == "30" && item.receipt_status == "20") {
          arr[index].showText = "已完成";
          arr[index].showType = "";
          arr[index].showactive = 3;
          //console.log(arr[index])
        }
       
      });

      that.setData({
        OrderList: result.data
      });

      that.check_is_noData();
    });

  },
  bt_url: function (e) {
    wx.navigateTo({
      url: './detail?id=' + e.currentTarget.dataset.id
    })
  },
  //取消订单
  orderoff:function(e){
    var that=this;
    var ordersn = e.currentTarget.dataset.ordersn;
    var OrderList = that.data.OrderList;
    App._get('order/orderoff', { order_sn: ordersn}, function (result) {
      console.log(result);
      if (result==1){
        for (var i = 0; i < OrderList.length;i++){
          if (OrderList[i].order_no == ordersn){
            OrderList.splice(i,1)
            that.setData({
              OrderList: OrderList
            })
            wx.showToast({
              title: '订单取消成功',
              icon: 'none',
              duration: 1000
            })
          }
          
        }
       
      }else{
        wx.showToast({
          title: '订单取消失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  //确认收货
  confirmbtn:function(e){
    var that=this;
    var ordersn = e.currentTarget.dataset.ordersn;
    var OrderList = that.data.OrderList;
    App._get('order/receipt', { order_sn: ordersn }, function (result) {
      if (result == 1) {
        for (var i = 0; i < OrderList.length; i++) {
          if (OrderList[i].order_no == ordersn) {
            OrderList[i].pay_status = '20';
            OrderList[i].order_status = '30';
            OrderList[i].receipt_status = '20';
            OrderList[i].showactive=3;
            OrderList[i].showText = "已完成";
            that.setData({
              OrderList: OrderList,
              active: 3
            })
            wx.showToast({
              title: '确认收货成功',
              icon: 'none',
              duration: 1000
            })
          }
        }
        
      }else{
        wx.showToast({
          title: '确认收货失败',
          icon: 'none',
          duration: 1000
        })
      }
      
    })
  },
  
  onChange: function (e) {
    console.log(e);
    let that = this;
    that.setData({
      active: e.currentTarget.dataset.index
    });
  
    

    //这里计算当前订单列表的长度
    that.check_is_noData();
  },
  check_is_noData: function () {
    let that = this;
    var isnodata = true;
    that.data.OrderList.forEach(function (item, index, arr) {
      if (that.data.active == 0) {
        isnodata = false
      } else {
        if (item.showactive == that.data.active) {
          isnodata = false
        }
      }
    });
    that.setData({
      isNoData: isnodata
    });
  }
 })