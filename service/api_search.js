import hyRequest from "./index";

export function getSearchHot() {
  return hyRequest.get("/search/hot")
}

export function getSearchSuggest(keywords) {
  return hyRequest.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}

/**
 * 请求搜索结果
 * @param {string} keywords - 搜索建议关键字
 */
export function getSearchResult(keywords) {
  return hyRequest.get("/search", {
    keywords
  })
}
