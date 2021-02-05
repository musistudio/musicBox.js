const axios = require("axios");
const qs = require('qs');

class NetEaseMusic {
    constructor() {
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'
        }
    }

    async search(keyword, singer, n = 10) {
        const url = 'http://music.163.com/api/cloudsearch/pc'
        const res = await axios({
            url,
            method: 'POST',
            data: qs.stringify({
                s: keyword,
                type: 1,
                limit: n,
                total: true,
                offset: 0
            }),
            headers: this.headers
        })
        const songs = res.data.result.songs.map(song => ({
            name: song.name,
            fileId: song.id,
            pic: song.al.picUrl,
            singer: song.ar.map(singer => singer.name).join(' ').trim()
        }))
        return songs;
    }

    async getMusicUrl(fileId) {
        const url = 'http://music.163.com/api/song/enhance/player/url';
        const res = await axios({
            url,
            method: 'POST',
            data: qs.stringify({
                ids: `["${fileId}"]`,
                br: 320000
            }),
            headers: this.headers
        })
        return res.data.data && res.data.data[0].url;
    }
}


module.exports = NetEaseMusic;


// const music = new NetEaseMusic()
// music.search('雁归来').then(res => console.log(res)).catch(err => {console.log(err)})
// music.getMusicUrl('525199811').then(res => console.log(res.data.data)).catch(err => console.log(err))