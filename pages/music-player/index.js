// pages/music-player/index.js
import { getSongDetail } from '../../service/api_player'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {}
  },
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id
    this.setData({ id })

    // 2.根据id获取歌曲信息
    this.getPageData(id)
  },
  // 网络请求
  getPageData: function (id) {
    getSongDetail(id).then(res => {
      this.setData({ currentSong: res.songs[0] })
    })
  },
  onUnload: function () {
  }
})