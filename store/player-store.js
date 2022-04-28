import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'

const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: []
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id }) {
      ctx.id = id
      // 1.根据 id 请求数据
      // 请求歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      })
      // 请求歌词数据
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfos = lyrics
      })

      // 2.使用 audioContext 播放对应 id 的歌曲
      // 在播放下一首歌之前，先把上一首歌给停止掉
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      // 你写了 onCanplay 里的 play 方法，那这句可以不写
      // 加上这句是为了保险起见（有些设备不支持 autoplay）
      audioContext.autoplay = true
    }
  }
})

export {
  audioContext,
  playerStore
}