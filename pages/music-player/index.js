// pages/music-player/index.js
import { audioContext, playerStore } from '../../store/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 关于歌曲的数据
    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],
    
    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    // 关于页面的数据
    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,
    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollTop: 0
  },
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id
    this.setData({ id })
    
    // 2.获取歌曲信息
    this.setupPlayerStoreListener()

     // 3.动态计算内容高度
     const globalData = getApp().globalData
     const screenHeight = globalData.screenHeight
     const statusBarHeight = globalData.statusBarHeight
     const navBarHeight = globalData.navBarHeight
     const deviceRadio = globalData.deviceRadio
     const contentHeight = screenHeight - statusBarHeight - navBarHeight
     this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })
  },
  // ======================== 事件处理 ========================
  handleSwiperChange: function(event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },
  handleSliderChanging: function(event) {
    // 你对 Slider 的滑块来回拖拽会触发
    // console.log("handleSliderChanging")
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging: true, currentTime })
  },
  handleSliderChange: function(event) {
    // 你点一下 Slider 的滑块到某个位置就会触发
    // console.log("handleSliderChange")
    // 1.获取 slider 变化的值
    const value = event.detail.value

    // 2.计算需要播放的 currentTIme
    const currentTime = this.data.durationTime * value / 100

    // 3.设置 context 播放 currentTime 位置的音乐
    // 在设置前，请暂停上一次播放的节奏，再跳到指定位置，不然有 bug
    // 暂停。暂停后的音频再播放会从暂停处开始播放
    audioContext.pause()
    // 跳转到指定位置 -> 需要 s，ms 的话，值超过歌曲的时长，就不知道跳到哪儿去了
    audioContext.seek(currentTime / 1000)

    // 4.记录最新的 sliderValue, 并且需要将 isSliderChaning 设置回 false
    this.setData({ sliderValue: value, isSliderChanging: false })
  },
  handleBackBtnClick: function() {
    // 一般返回的层级为一级就行了
    wx.navigateBack()
  },
  // ======================== 数据监听 ========================
  setupPlayerStoreListener: function() {
    // 1.监听 currentSong/durationTime/lyricInfos
    // 一个数据改了，就能触发事件，执行回调
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      console.log(lyricInfos)
      // 某个数据改了才去修改，而不是一个数据改了，其它三个数据也得重新 setData 一下
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })

    // 2.监听 currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    })
  },
  onUnload: function () {
  }
})