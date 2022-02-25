import hyRequest from "./index";

export function getTopMV(offset, limit = 10) {
  return hyRequest.get("/top/mv", {
    offset,
    limit,
  });
}
