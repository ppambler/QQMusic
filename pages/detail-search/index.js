// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from '../../service/api_search'
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/string2nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest, 300)


Page({
  data: {
    hotKeywords: [],
    searchValue: "",
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: []
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
  // 事件处理
  handleSearchChange: function(event) {
    // 1.获取输入的关键字
    const searchValue = event.detail
    // console.log(searchValue)

    // 2.保存关键字
    this.setData({ searchValue })

    // 3.判断关键字为空字符的处理逻辑
    if (!searchValue.length) {
      // 输入框内容为空，那么搜索建议也要清空
      this.setData({ suggestSongs: [] })
      return
    }

    // 4.根据关键字进行搜索
    debounceGetSearchSuggest(searchValue).then(res => {
      // 1.获取建议的关键字歌曲
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs })

       // 2.转成 nodes 节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },
  handleSearchAction: function() {
    // 保存一下searchValue
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({ resultSongs: res.result.songs })
    })
  },
  handleSuggestItemClick: function(event) {
    // 1.获取点击的关键字
    const index = event.currentTarget.dataset.index
    const keyword = this.data.suggestSongs[index].keyword

    // 2.将关键设置到searchValue中
    this.setData({ searchValue: keyword })

    // 3.发送网络请求
    this.handleSearchAction()
  },
  handleTagItemClick: function(event) {
    // 1.获取点击的标签
    const tag = event.currentTarget.dataset.tag

    // 2.将关键设置到searchValue中
    this.setData({ searchValue: tag })

    // 3.发送网络请求
    this.handleSearchAction()
  }
})