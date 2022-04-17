// app.js
App({
  onLaunch: function () {
    const info = wx.getSystemInfoSync()
    this.globalData.statusBarHeight = info.statusBarHeight
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    console.log(info)
  },
  globalData: {
    statusBarHeight: 0,
    navBarHeight: 44,
    screenWidth: 0,
    screenHeight: 0
  }
})
