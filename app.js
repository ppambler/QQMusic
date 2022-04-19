// app.js
App({
  onLaunch: function () {
    const info = wx.getSystemInfoSync()
    this.globalData.statusBarHeight = info.statusBarHeight
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    // console.log(info)
    const deviceRadio = info.screenHeight / info.screenWidth
    // console.log(deviceRadio)
    this.globalData.deviceRadio = deviceRadio
  },
  globalData: {
    statusBarHeight: 0,
    navBarHeight: 44,
    screenWidth: 0,
    screenHeight: 0,
    deviceRadio: 0
  }
})
