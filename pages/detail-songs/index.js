// pages/detail-songs/index.js
import { rankingStore } from '../../store/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songInfo: {}
  },
  onLoad: function (options) {
    const ranking = options.ranking
    // 1.获取数据
    rankingStore.onState(ranking, this.getRankingDataHanlder)
  },
  onUnload: function () {
    rankingStore.offState(this.data.ranking, this.getRankingDataHanlder)
  },
  getRankingDataHanlder: function(res) {
    this.setData({ songInfo: res })
  } 
})