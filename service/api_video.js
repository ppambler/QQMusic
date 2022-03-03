import hyRequest from "./index";

/**
 * 请求 MV 的排行
 * @param {number} offset 
 * @param {number} [limit=10] - 默认值为 10
 */
export function getTopMV(offset, limit = 10) {
  return hyRequest.get("/top/mv", {
    offset,
    limit,
  });
}
/**
 * 请求 MV 的播放地址
 * @param {number} id - MV 的 id
 */
export function getMVURL(id) {
  return hyRequest.get("/mv/url", {
    id
  })
}

/**
 * 请求 MV 的详情
 * @param {number} mvid - MV 的 id
 */
export function getMVDetail(mvid) {
  return hyRequest.get("/mv/detail", {
    mvid
  })
}
/**
 * 请求相关视频
 * @param {number} id - MV 的 id
 */
export function getRelatedVideo(id) {
  return hyRequest.get("/related/allvideo", {
    id
  })
}
