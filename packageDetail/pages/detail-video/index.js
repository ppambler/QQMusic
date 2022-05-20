// pages/detail-video/index.js
import { getMVURL, getMVDetail, getSimiMv } from "../../../service/api_video";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedVideos: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id;

    // 2.获取页面的数据
    this.getPageData(id);

    // 3.其他逻辑
  },
  getPageData: function (id) {
    // 1.请求播放地址
    getMVURL(id).then((res) => {
      this.setData({ mvURLInfo: res.data });
    });

    // 2.请求视频信息
    getMVDetail(id).then((res) => {
      this.setData({ mvDetail: res.data });
    });

    // 3.请求相关视频
    getSimiMv(id).then((res) => {
      // console.log(res);
      this.setData({ relatedVideos: res.mvs });
    });
  },
  handleVideoItemClick: function (event) {
    // console.log(event);
    // 获取id
    const id = event.currentTarget.dataset.item.id;
    // 页面跳转
    wx.redirectTo({
      url: `/packageDetail/pages/detail-video/index?id=${id}`,
    });
  },
});
