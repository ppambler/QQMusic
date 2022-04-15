// app.js
App({
  onLaunch: function () {
    const info = wx.getSystemInfoSync()
    this.globalData.statusBarHeight = info.statusBarHeight
  },
  globalData: {
    statusBarHeight: 0,
    navBarHeight: 44
  }
})
