import hyRequest from './index'

export function getBanners() {
  return hyRequest.get("/banner", {
    type: 2
  })
}

export function getRankings(idx) {
  return hyRequest.get("/top/list", {
    idx
  })
}


