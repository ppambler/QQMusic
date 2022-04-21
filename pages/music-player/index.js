// pages/music-player/index.js
import { getSongDetail,getSongLyric } from '../../service/api_player'
import { audioContext } from '../../store/index'
import { parseLyric } from '../../utils/parse-lyric'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {},
    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,
    durationTime: 0,
    currentTime: 0,
    sliderValue: 0,
    isSliderChanging: false
  },
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id
    this.setData({ id })

    // 2.根据id获取歌曲信息
    this.getPageData(id)

     // 3.动态计算内容高度
     const globalData = getApp().globalData
     const screenHeight = globalData.screenHeight
     const statusBarHeight = globalData.statusBarHeight
     const navBarHeight = globalData.navBarHeight
     const deviceRadio = globalData.deviceRadio
     const contentHeight = screenHeight - statusBarHeight - navBarHeight
     this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })

    // 4.使用 audioContext 播放歌曲
    // 在播放下一首歌之前，先把上一首歌给停止掉
    audioContext.stop()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // 你写了 onCanplay 里的 play 方法，那这句可以不写
    // 加上这句是为了保险起见（有些设备不支持 autoplay）
    audioContext.autoplay = true

    // 5.audioContext 的事件监听
    this.setupAudioContextListener()
  },
  // ======================== 网络请求 ========================
  getPageData: function (id) {
    getSongDetail(id).then(res => {
      this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
    })
    getSongLyric(id).then(res => {
      const lyricString = res.lrc.lyric
      const lyrics = parseLyric(lyricString)
      console.log(lyrics)
    })
  },
  // ======================== audio 监听 ========================
  setupAudioContextListener: function() {
    audioContext.onCanplay(()=>{
      // 缓存到可以播放歌曲了，那就播放歌曲
      audioContext.play()
    })
    // 监听时间改变
    audioContext.onTimeUpdate(() => {
      // 歌曲正在播放就会触发这个事件
      // console.log("onTimeUpdate")
      // 1.获取当前时间
      // 读取的值是 s -> 19.634172
      // console.log(audioContext.currentTime)
      // 转成 ms
      const currentTime = audioContext.currentTime * 1000

      // 2.根据当前时间修改 currentTime/sliderValue
      if (!this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ sliderValue, currentTime })
      }
    })
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
    this.setData({ isSliderChanging: true, currentTime, sliderValue: value })
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
  onUnload: function () {
  }
})