// pages/music-player/index.js
import { getSongDetail } from '../../service/api_player'
import { audioContext } from '../../store/index'

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
    durationTime: 0
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

    // 4.使用audioContext播放歌曲
    // 在播放下一首歌之前，先把上一首歌给停止掉
    audioContext.stop()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // 你写了 onCanplay 里的 play 方法，那这句可以不写
    // 加上这句是为了保险起见（有些设备不支持 autoplay）
    audioContext.autoplay = true
    audioContext.onCanplay(()=>{
      // 跟 autoplay 
      audioContext.play()
    })
  },
  // 网络请求
  getPageData: function (id) {
    getSongDetail(id).then(res => {
      this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
    })
  },
  // 事件处理
  handleSwiperChange: function(event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },
  onUnload: function () {
  }
})