import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'

const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    playModeIndex: 0, // 0: 顺序播放 1: 单曲循环 2: 随机播放

    isPlaying: false, // 播放状态控制
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id }) {
      if (ctx.id == id) {
        this.dispatch("changeMusicPlayStatusAction", true)
        return
      }
      ctx.id = id

      // 0.修改播放的状态
      ctx.isPlaying = true

      // 重置歌曲信息
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""

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

      // 3.监听audioContext一些事件
      this.dispatch("setupAudioContextListenerAction")
    },
    setupAudioContextListenerAction(ctx) {
      // 1.监听歌曲可以播放
      audioContext.onCanplay(() => {
        // 缓存到可以播放歌曲了，那就播放歌曲
        audioContext.play()
      })
      // 2.监听时间改变
      audioContext.onTimeUpdate(() => {
        // 歌曲正在播放就会触发这个事件
        // console.log("onTimeUpdate")
        // 1.获取当前时间
        // 读取的值是 s -> 19.634172
        // console.log(audioContext.currentTime)
        // 转成 ms
        const currentTime = audioContext.currentTime * 1000

        // 2.根据当前时间修改 currentTime
        ctx.currentTime = currentTime

        // 3.根据当前时间去查找播放的歌词
        if (!ctx.lyricInfos.length) return
        let i = 0
        for (; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            break
          }
        }
        // 设置当前歌词的索引和内容
        const currentIndex = i - 1
        if (ctx.currentLyricIndex !== currentIndex) {
          const currentLyricInfo = ctx.lyricInfos[currentIndex]
          ctx.currentLyricText = currentLyricInfo.text
          ctx.currentLyricIndex = currentIndex
        }
      })
    },
    // 暂停 & 播放控制
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      ctx.isPlaying ? audioContext.play(): audioContext.pause()
    }
  }
})

export {
  audioContext,
  playerStore
}