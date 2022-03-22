export default function (selector) {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    // query.exec(resolve) // -> 这一种性能更好
    query.exec((res) => {
      resolve(res)
    })
  })
}