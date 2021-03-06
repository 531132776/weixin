// pages/home/home.js

import imageLoad from '../../lib/imageLoad.js'
//调用封装ajax获取接口
var network = require("../../utils/http.js")
var imageUtil = require('../../lib/img.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay:true,
    interval:3000,
    duration:300,
    imgUrls:[
      "../../statis/image/1.jpg",
      "../../statis/image/2.jpg",
      "../../statis/image/3.jpg",
    ],
    carLogoList:[],
    autoshowList:[],
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCarLogo();
    this.getAutoShow();//车展
    var _this = this;
    // wx.getSystemInfo({    //获取系统信息
    //   success: function (res) {   //success回调参数当前手机信息
    //     _this.setData({
    //       screenHeight: res.windowHeight,
    //       screenWidth: res.windowWidth,
    //     });
    //   }
    // });
  },
  //动态设置图片大小 imageOn自定义方法在home.wxml中的<image src="{{i.titleImage}}" mode="widthFix" bindload="imageOn"/>
  imageOn: function (e) {
    // console.log(e)
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例
    var viewWidth = 693,           //设置图片显示宽度，
      viewHeight = 693 / ratio;    //计算的高度值   
      _this.setData({
        imgwidth: viewWidth,
        imgheight: viewHeight
      })
  },
  imageLoad: function (e) {
    //获取图片的原始宽度和高度 
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    //let imageSize = Util.imageZoomHeightUtil(originalWidth,originalHeight); 

    //let imageSize = Util.imageZoomHeightUtil(originalWidth,originalHeight,375); 
    let imageSize = imageLoad.imageZoomWidthUtil(originalWidth, originalHeight, 217);

    this.setData({ imgwidth: imageSize.imageWidth, imgheight: imageSize.imageHeight });
  } ,
  //获取车品牌LOGO
  getCarLogo(){
    var that = this;
    var params = {};
    network.POST({
      params: params,
      API_URL: "/brand/getBrandCarSeries",
      success: (res) => {
        console.log(res)
        var oldList = (res.data).slice(0, 10);
        var newList = oldList.map(function(v){return v.brandList});
        for (var i in newList){
          newList[i][0].logo = newList[i][0].logo.replace(/\\/g,'/');
        }
        that.setData({
          carLogoList: newList
        })
        //console.log(this.data.carLogoList)
      },
      fail: function () {
        console.log("error")
      }
    })
  },
  //获取车展
  getAutoShow(){
    var _this = this;
    var obj = {};
    network.POST({
      params: obj,
      API_URL:"/autoshow/getList",
      success:(res) => {
        console.log(res);
        var autoshowList = res.data;
        for (var i in autoshowList){
          // console.log(autoshowList[i].titleImage)
          if (autoshowList[i].titleImage != null && autoshowList[i].titleImage != ""){
            autoshowList[i].titleImage = autoshowList[i].titleImage.replace(/\\/g, '/');
          }else{
            autoshowList[i].titleImage = '';
          }
          
        }
        _this.setData({
          autoshowList: autoshowList
        })
      },fail:function (){
        console.log("error")
      }
    })
  },
  //去车展详情页
  autoshowDetails:function(e){
    var newTime = JSON.stringify(e.currentTarget.dataset.item);
    var id = e.currentTarget.dataset.item.id;
    var name = e.currentTarget.dataset.item.name;
    console.log(newTime)
    wx.navigateTo({
      url: `/pages/autoshowDetails/autoshowDetails?obj=${newTime}`,
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