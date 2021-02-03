(function () {
    function createEmbedLink(url) {
        var youtubeRegex = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
        var vimeoRegex = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/
    
        if (url.match(youtubeRegex)) {
            return url.replace(youtubeRegex, 'https://www.youtube.com/embed/$1');
        } else if (url.match(vimeoRegex)) {
            return url.replace(vimeoRegex, 'https://player.vimeo.com/video/$5?autoplay=1&loop=1&autopause=0');
        }
    
        return false;
    }

    var embed = document.querySelector('[data-embed]');
    if (embed) {
        var url = embed.getAttribute('data-embed');
        var parsedUrl = createEmbedLink(url);
        if (parsedUrl) {
            embed.innerHTML = '<iframe class="embed__video" src="' + parsedUrl + '" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        }
    }
})();

Module:

export default {
    _embed: null,
    init() {
        this._embed = document.querySelector('[data-embed]');
        if (!this._embed) {
            return;
        }

        const url       = this._embed.getAttribute('data-embed');
        const parsedUrl = this._createEmbedLink(url);

        if (parsedUrl) {
            this._embed.innerHTML = '<iframe class="embed__iframe" src="' + parsedUrl + '" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        }
    },
    _createEmbedLink(url) {
        const youtubeRegex = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
        const vimeoRegex   = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/
    
        if (url.match(youtubeRegex)) {
            return url.replace(youtubeRegex, 'https://www.youtube.com/embed/$1');
        } else if (url.match(vimeoRegex)) {
            return url.replace(vimeoRegex, 'https://player.vimeo.com/video/$5?autoplay=1&loop=1&autopause=0');
        }
    
        return false;
    }
}
