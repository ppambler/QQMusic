import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    // 控制 audioContext 的监听 -> 监听事件只添加一次就好了
    isFirstPlay: true,
    // 后台播放停止 -> 点击那个 x
    isStoping: false,

    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    playModeIndex: 0, // 0: 顺序播放 1: 单曲循环 2: 随机播放

    isPlaying: false, // 播放状态控制

    // 播放列表相关数据
    playListSongs: [],
    playListIndex: 0
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      // isRefresh -> 单曲循环时，切换上一首或下一首都会重新播放这首歌
      if (ctx.id == id && !isRefresh) {
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
      console.log('54',id)
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
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
      // 默认给 id 值，等到获取了歌曲详情，再给 title 一个正确的值
      audioContext.title = id
      // 你写了 onCanplay 里的 play 方法，那这句可以不写
      // 加上这句是为了保险起见（有些设备不支持 autoplay）
      audioContext.autoplay = true

      // 3.监听audioContext一些事件
      if (ctx.isFirstPlay) { 
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
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
          // console.log(currentLyricInfo)
          ctx.currentLyricText = currentLyricInfo?.text
          ctx.currentLyricIndex = currentIndex
        }
      })
      
      // 3.监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction")
      })

      // 4.监听音乐暂停/播放/停止
      // 播放状态
      audioContext.onPlay(() => {
        console.log('onPlay')
        ctx.isPlaying = true
      })
      // 暂停状态
      audioContext.onPause(() => {
        console.log('onPause')
        ctx.isPlaying = false
      })
      // 停止状态
      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
        console.log('onStop')
        // console.log(audioContext.src)
        // console.log(audioContext.title)
      })
    },
    // 暂停 & 播放控制
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      // console.log(audioContext.src)
      // if (ctx.isPlaying && ctx.isStoping) {
      //   audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
      //   audioContext.title = currentSong.name
      // }
      if (ctx.isStoping) {
        // console.log(ctx.currentTime)
        // console.log(ctx.currentTime / 1000)
        // audioContext.seek(ctx.currentTime / 1000)
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
        audioContext.startTime = ctx.currentTime / 1000
        ctx.isStoping = false
      }
      ctx.isPlaying ? audioContext.play(): audioContext.pause()
      
    },
    changeNewMusicAction(ctx, isNext = true) {
      // 1.获取当前索引
      let index = ctx.playListIndex

      // 2.根据不同的播放模式, 获取下一首歌的索引
      switch(ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1: index -1
          if (index === -1) index = ctx.playListSongs.length - 1
          if (index === ctx.playListSongs.length) index = 0
          break
        case 1: // 单曲循环
          break
        case 2: // 随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break
      }

      console.log(index)

      // 3.获取歌曲
      let currentSong = ctx.playListSongs[index]
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        // 记录最新的索引 -> 单曲循环时不用重新记录索引
        ctx.playListIndex = index
      }

      // 4.播放新的歌曲
      this.dispatch("playMusicWithSongIdAction", { id: currentSong.id, isRefresh: true })
    }
  }
})

export {
  audioContext,
  playerStore
}