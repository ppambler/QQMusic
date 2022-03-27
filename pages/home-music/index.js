// pages/home-music/index.js
// 放在这个位置，是为了和其它导入作区分
import { rankingStore } from '../../store/index'

import { getBanners, getSongMenu } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect, 1000)

Page({

  data: {
    swiperHeight: 0,
    banners: [],
    recommendSongs: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    rankings: { 0: {}, 2: {}, 3: {} },
    rankingsFlag: []
  },

  // 生命周期函数
  onLoad: function (options) {
    // 获取页面数据
    this.getPageData()

    // 发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction")

    // 从store获取共享的数据
    rankingStore.onState("hotRanking", (res) => {
      // console.log(res)
      if (!res.tracks) return
      // 不建议用 ?. -> 用这个后续还会执行代码 -> 控制台会警告你对 recommendSons 设置成 undefined，毕竟它的默认值是 [] -> 可选链在 TS 用得比较多
      const recommendSongs = res.tracks.slice(0, 6)
      // console.log(recommendSongs)
      this.setData({ recommendSongs })
    })
    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("originRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))
  },

  onUnload: function () {
    // rankingStore.offState("newRanking", this.getNewRankingHandler)
  },
  getRankingHandler: function(idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      // console.log("idx:", idx)
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {name, coverImgUrl, playCount, songList}
      const newRankings = { ...this.data.rankings, [idx]: rankingObj}
      const flag = this.data.rankingsFlag
      flag.push(true)
      this.setData({ 
        rankings: newRankings,
        rankingsFlag: flag
      })
      // console.log(this.data.rankings)
    }
  },
  // 网络请求
  getPageData: function() {
    getBanners().then(res => {
      this.setData({ banners: res.banners })
    })
    getSongMenu().then(res => {
      this.setData({ hotSongMenu: res.playlists })
    })
    getSongMenu("华语").then(res => {
      this.setData({ recommendSongMenu: res.playlists })
    })
  },

  // 事件处理
  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  handleSwiperImageLoaded: function() {
    // 获取图片的高度（如去获取某一个组件的高度）
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0]
      this.setData({ swiperHeight: rect.height })
    })
  },
})