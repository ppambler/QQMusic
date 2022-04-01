// pages/detail-search/index.js
import { getSearchHot } from '../../service/api_search'

Page({
  data: {
    hotKeywords: [],
  },
  onLoad: function (options) {
    // 1.获取页面的数据
    this.getPageData()
  },
  // 网络请求
  getPageData: function() {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  },
})