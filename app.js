// app.js

import { getLoginCode, codeToToken, checkToken, checkSession } from './service/api_login'
import { TOKEN_KEY } from './constants/token-const'

App({
  globalData: {
    statusBarHeight: 0,
    navBarHeight: 44,
    screenWidth: 0,
    screenHeight: 0,
    deviceRadio: 0
  },
  onLaunch: function () {
    const info = wx.getSystemInfoSync()
    this.globalData.statusBarHeight = info.statusBarHeight
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    // console.log(info)
    const deviceRadio = info.screenHeight / info.screenWidth
    // console.log(deviceRadio)
    this.globalData.deviceRadio = deviceRadio

    // 2.让用户默认进行登录
    this.handleLogin()

    // 3.获取用户的信息
    // wx.getUserInfo({
    //   lang: "zh_CN",
    //   success: (res) => {
    //     console.log(res)
    //   }
    // })
  },
  handleLogin: async function() {
    const token = wx.getStorageSync(TOKEN_KEY)
    // token 有没有过期
    const checkResult = await checkToken(token)
    console.log(checkResult)
    // 判断 session 是否过期
    const isSessionExpire = await checkSession()

    // 没有 token 或 token 过期了 或 session 过期了
    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction()
    }
  },
  loginAction: async function() {
    // 1.获取code
    const code = await getLoginCode()

    // 2.将code发送给服务器
    const result = await codeToToken(code)
    console.log(result)
    const token = result.token
    wx.setStorageSync(TOKEN_KEY, token)
  }
})
