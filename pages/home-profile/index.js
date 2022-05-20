// pages/home-profile/index.js
import { getUserInfo } from "../../service/api_login";

Page({
  data: {
    nickName: "",
    avatarUrl: "",
  },
  handleGetUser: async function (event) {
    const data = await getUserInfo();
    const nickName = data.userInfo.nickName;
    const avatarUrl = data.userInfo.avatarUrl;
    this.setData({
      nickName,
      avatarUrl,
    });
    console.log(data);
  },
  handleGetPhoneNumber: function (event) {
    console.log(event);
  },
});
