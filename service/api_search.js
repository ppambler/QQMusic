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
