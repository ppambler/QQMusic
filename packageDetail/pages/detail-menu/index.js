// packageDetail/pages/detail-menu/index.js
import { getSongMenuTags, getSongMenu } from '../../../service/api_music'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    songMenuList: []
  },
  onLoad: function (options) {
    // 1.请求数据
    this.getSongMenuDetail()
  },
  handleMenuItemClick: function(event) {
    const item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: `/packageDetail/pages/detail-songs/index?id=${item.id}&type=menu`,
    })
  },
  async getSongMenuDetail() {
    const res = await getSongMenuTags()
    const tags = res.tags
    const songMenuList = []
    const promises = []
    for (const index in tags) {
      const name = tags[index].name
      songMenuList[index] = { name, list: [] }
      promises.push(getSongMenu(name))
    }
    Promise.all(promises).then(menuLists => {
      for (const index in menuLists) {
        const menuList = menuLists[index]
        songMenuList[index].list = menuList.playlists
      }
      this.setData({ songMenuList })
    })
    // 发送歌单网络请求
  }
})