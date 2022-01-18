const axios = require("axios");

class QQMusic {
    constructor() {
        this.agents = {
            ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46',
            pc: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36'
        }
        this.headers = {
            referer: 'http://m.y.qq.com',
            'User-Agent': this.agents['ios'],
            // cookie需要修改成自己的
            cookie: ""
        }
    }

    async search(keyword, n = 10) {
        const url = `http://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?w=${encodeURIComponent(keyword)}&n=${n}&format=json&p=1`
        const res = await axios({
            url,
            method: 'GET',
            headers: this.headers
        })
        return res.data.data.song.list.map(song => ({
            name: song.songname,
            fileId: song.songmid,
            singer: song.singer.map(singer => singer.name).join(' ').trim(),
            engine: 'qq'
        }))
    }

    async getMusicUrl(fileId) {
        const url = `https://i.y.qq.com/v8/playsong.html?songmid=${fileId}&ADTAG=myqq&from=myqq&channel=10007100`;
        const res = await axios({
            url,
            method: 'GET',
            headers: this.headers
        })
        try{
            let metaData = /window.__ssrFirstPageData__ =[\s\S]*<\/script><script crossorigin="true">window.tj_param/.exec(res.data);
            metaData = metaData[0] ? JSON.parse(metaData[0].slice(29, -51)) : {};
            return {
                url: metaData.songList[0].url,
                thumbnail: metaData.metaData.image,
                name: metaData.songList[0].title,
                singer: metaData.songList[0].singer.map(singer => singer.name).join(' ')
            }
        }catch(e) {
            return e
        }
    }

    async getMusicInfo(fileId) {
        const url = `https://i.y.qq.com/v8/playsong.html?songmid=${fileId}&ADTAG=myqq&from=myqq&channel=10007100`;
        const res = await axios({
            url,
            method: 'GET',
            headers: this.headers
        })
        try{
            // 
            let songUrl = /"url":"http:[\s\S]*","bpm/.exec(res.data);
            songUrl = songUrl[0] ? songUrl[0].slice(7, -6).replace(/\\u002F/g, '/') : '';
            console.log({songUrl})
        }catch(e) {
            return
        }
    }
}

module.exports = QQMusic;

// const music = new QQMusic()
// music.search('雁归来').then(res => console.log(res)).catch(err => {console.log(err)})
// music.getMusicUrl('000IfHFI2V5YDo').then(res => console.log(res)).catch(err => console.log(err))