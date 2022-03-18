// pages/home-music/index.js
Page({

  data: {

  },

  // 生命周期函数
  onLoad: function (options) {
  },

  onUnload: function () {
  },

  // 监听事件
  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  }

 
})