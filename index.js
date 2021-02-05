const QQMusic = require('./libs/qq');
const KuwoMusic = require('./libs/kuwo');
const NeteaseMusic = require('./libs/netease');



class Music {
    constructor(weight = { qq: 3, netease: 2, kuwo: 1 }) {
        this.engines = {
            qq: new QQMusic(),
            kuwo: new KuwoMusic(),
            netease: new NeteaseMusic()
        }
        this.weight = weight // 音乐搜索权重
        this.weightList = Object.values(this.weight).sort((a, b) => b - a);
    }

    async search(name, singer, engine = 'qq') {
        if (singer) {
            let songs = await this.engines[engine].search(name);
            songs = songs.filter(song => song.singer === singer);
            if (songs.length) {
                return songs
            } else {
                const index = this.weightList.findIndex(w => w === this.weight[engine]);
                if (index < this.weightList.length - 1) {
                    engine = Object.keys(this.weight).find(k => this.weight[k] === this.weightList[index + 1]);
                    return this.search(name, singer, engine)
                }
            }
        }
        return this.engines[engine].search(name);
    }

    async getMusicUrl(song, engine = 'qq') {
        if (!song.fileId || song.engine !== engine) {
            const res = await this.search(song.name, engine);
            song = res[0]
            song.engine = engine
            console.log(song)
        }
        const url = await this.engines[engine].getMusicUrl(song.fileId);
        if (url) {
            return url;
        }
        const index = this.weightList.findIndex(w => w === this.weight[engine]);
        if (index < this.weightList.length - 1) {
            engine = Object.keys(this.weight).find(k => this.weight[k] === this.weightList[index + 1]);
            return this.getMusicUrl(song, engine);
        }
    }

    // 音箱专用，由于音箱没有复杂的交互场景，默认返回搜索结果中的第一首能听的歌
    async box({name, singer, engine = 'qq'}) {
        const songs = await this.search(name, singer, engine);
        for(let i = 0; i < songs.length; i++) {
            const url = await this.getMusicUrl(songs[i]);
            if(url) {
                return url
            }
        }
    }

    getMusicLyric() {

    }
}

const music = new Music()
music.box({ name: 'mojito', singer: '周杰伦'}).then(res => {
    console.log(res)
})
// music.getMusicUrl({ name: '其实，我就在你方圆几里', singer: '陈壹千', fileId: '' }).then(res => {
//     console.log(res)
// })