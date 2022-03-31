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

// cat -> category 类别
export function getSongMenu(cat="全部", limit=6, offset=0) {
  return hyRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}

export function getSongMenuDetail(id) {
  return hyRequest.get("/playlist/detail/dynamic", {
    id
  })
}


