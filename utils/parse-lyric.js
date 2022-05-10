// 正则(regular)表达式(expression): 字符串匹配利器

// [00:58.65]
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString) {
  const lyricStrings = lyricString.split("\n")

  const lyricInfos = []
  for (const lineString of lyricStrings) {
    // [00:58.65]他们说 要缝好你的伤 没有人爱小丑
    // 利器作用到某串字符串
    // 得到： 0 [00:58.65]、1 00、2 58、3 65
    const timeResult = timeRegExp.exec(lineString)
    // 有些歌词没有时间，没有匹配到那就跳过这次循环
    if (!timeResult) continue
    // 1.获取时间
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millsecondTime = timeResult[3]
    // ms 位 -> 给 2 个字符的是省略了一个 0，所以 2个字符的要 * 10，3个字符 要 * 1
    const millsecond = millsecondTime.length === 2 ? millsecondTime * 10: millsecondTime * 1
    // 得到这一刻歌词的总 ms 数
    const time = minute + second + millsecond

    // 2.获取歌词文
    // replace 的第一个参数也可以是 timeResult[0] 字符串，也可以是正则表达式
    const text = lineString.replace(timeRegExp, "")
    // console.log(`time:${time} -> text:${text}`)
    lyricInfos.push({ time, text })
  }

  return lyricInfos
}