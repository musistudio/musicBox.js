const axios = require("axios");

class KuwoMusic {
    constructor() {
        this.headers = {
            'Cookie': 'Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1612276305; ad_dist=%25D5%25E3%25BD%25AD; _ga=GA1.2.1712610828.1612276311; _gid=GA1.2.1130110208.1612276311; _gat=1; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1612276311; kw_token=LCN2IQK4NSL',
            'csrf': 'LCN2IQK4NSL',
            'Referer': 'http://www.kuwo.cn/',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36'
        }
    }

    async search(keyword, singer, n = 10) {
        const url = `http://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key=${encodeURIComponent(keyword)}&pn=1&rn=${n}&httpsStatus=1&reqId=84d4ac30-6563-11eb-8650-21b8c13fa3f9`;
        const res = await axios({
            url,
            method: 'GET',
            headers: this.headers
        })
        const songs = res.data.data.list.map(song => ({
            name: song.name,
            fileId: song.rid,
            pic: song.pic,
            singer: song.artist,
            engine: 'kuwo'
        }))
        return songs;
    }

    async getMusicUrl(fileId, br = '320k') {
        const url = `http://www.kuwo.cn/url?format=mp3&rid=${fileId}&response=url&type=convert_url3&br=${br}mp3&from=web&t=1612276366967&httpsStatus=1&reqId=84d54871-6563-11eb-8650-21b8c13fa3f9`;
        const res = await axios({
            url,
            method: 'GET',
            headers: this.headers
        })
        return res.data.url;
    }
}

module.exports = KuwoMusic;

// const music = new KuwoMusic()
// music.search('mojito').then(res => { console.log(res) }).catch(err => console.log(err))
// music.getMusicUrl('142655450').then(res => { console.log(res.data) }).catch(err => console.log(err))