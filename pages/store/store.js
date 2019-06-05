let App = getApp();
Page({

  data: {
    scrollHeight: null,
    list: {},
    page: 1,
    last_page:null,
    noList: true,
    no_more: false,
    sel_type:"normal",
    c_id: -1,//-1为 搜索名字
    title:'',
    resultList:'',
    moment:[]
  },

  onLoad: function (options) {
    let that = this;

    that.setData({
      c_id: options.shopid,
    });
    //页面启动后 调取首页的数据
    that.setData({
      wxapp: wx.getStorageSync('wxapp')
    });
    App.wx_setcolor(that.data.wxapp);


    // 设置商品列表高度
    that.setListHeight();

    //拖数据
    that.getGoodsList(true);

  },
  
  bindgetdata: function () {
    console.log('拖动到底');
    var price=this.data.price;
    if (this.data.page >= this.data.last_page) {
      this.setData({ no_more: true });
    }else{
      this.getGoodsList(++this.data.page, price||'price');
    }
   
  },
  onChange:function(e){
    var type = e.detail;
    if (type == 2) {
      var price = 'price';
    } else if (type == 1) {
      var price = 'sales_actual';
    } else {
      var price = 'goods_id';
    }
    console.log(this.data.page);
    var page = this.data.page;
    this.setData({
      moment:[],
      price: price,
      page:1
    })
    this.getGoodsList(1, price);
  },
  getGoodsList: function (page, price) {
    let that = this;
   
    App._get('user/shop_detail', { 
      supplierid: that.data.c_id, type: price||'price', page: page || 1
      }, function (result) {
        var momentlist = that.data.moment;
        let resultList = result.data.goods_list
        for (var i = 0; i < resultList.length; i++) {
          momentlist.push(resultList[i]);
        }
        console.log(momentlist)
        // 设置数据
        that.setData({
          moment: momentlist,
          last_page: result.data.count,
          shop: result.data
        })
      
      console.log(result.data);
    });
  },

  onShow: function () {

  },


  setListHeight: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 50
        });
      }
    });
  },

})