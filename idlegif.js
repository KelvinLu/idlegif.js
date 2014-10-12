var idlegif = {
    _options: {
        gifSearch: 'cute+cats',
        giphyApiUrl: 'http://api.giphy.com/v1/gifs/search',
        apiKey: 'dc6zaTOxFJmzC',

        color: 'black',
    },

    _gifUrls: [],

    init: function() {
        this.createIdleGif();
        this.doGiphyApiRequest();
    },

    createIdleGif: function() {
        container = document.createElement('div');
        container.setAttribute('class', 'idlegif-container');
        container.style.cssText = 'position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; opacity: 0; pointer-events: none; z-index: 2147483647';
        container.style.backgroundColor = this._options.color;

        image = document.createElement('img');
        image.setAttribute('class', 'idlegif-image');
        image.style.cssText = 'position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;';

        document.body.appendChild(container);
        container.appendChild(image);

        this.container = container;
        this.image = image;
    },

    doGiphyApiRequest: function() {
        var xmlhttp = new XMLHttpRequest();
        ajaxUrl = this._options.giphyApiUrl + '?' + 'q=' + this._options.gifSearch + '&' + 'api_key=' + this._options.apiKey;

        // Called from xmlhttp
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                idlegif.digestGiphyApiResponse(xmlhttp.responseText);
        }

        xmlhttp.open('GET', ajaxUrl, true);
        xmlhttp.send();
    },

    // Called from idlegifs
    digestGiphyApiResponse: function(responseText) {
        responseObj = JSON.parse(responseText);

        if (gifObjs = responseObj.data) this._gifUrls = [];

        for (var i = gifObjs.length - 1; i >= 0; i--) {
            if (gifId = gifObjs[i].id) {
                this._gifUrls.push('https://media.giphy.com/media/' + gifId + '/giphy.gif');
            }
        };
    },

    showIdleGif: function() {
        if (!(gifUrl = this._gifUrls[Math.floor(this._gifUrls.length * Math.random())])) {
            console.log('No GIF urls were present: ' + this._gifUrls);
            return;
        }

        this.image.setAttribute('src', gifUrl);
        this.container.style.opacity = 1;
        this.container.style.pointerEvents = 'auto';
    },
}