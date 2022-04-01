import hyRequest from "./index";

export function getSearchHot() {
  return hyRequest.get("/search/hot")
}