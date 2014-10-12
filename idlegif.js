// TODO:
// Add ability for user to apply arbitrary CSS filters (see http://html5-demos.appspot.com/static/css/filters/index.html)

var idlegif = {
    _options: {
        gifSearch: 'cute+cats',
        giphyApiUrl: 'http://api.giphy.com/v1/gifs/search',
        apiKey: 'dc6zaTOxFJmzC',

        color: 'black',
        transition: '0.5s',
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
        container.style.setProperty('-webkit-Transition' , 'opacity ' + this._options.transition); 
        container.style.transition = 'opacity ' + this._options.transition;
        container.style.backgroundColor = this._options.color;

        image = document.createElement('img');
        image.setAttribute('class', 'idlegif-image');
        image.style.cssText = 'position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;';

        footer = document.createElement('span');
        footer.setAttribute('class', 'idlegif-footer');        
        footer.style.cssText = 'position: absolute; left: 0px; bottom: 0px; padding: 0.2em; opacity: 0.5; background-color: black; color: white;';
        footer.innerHTML = '<a target="_blank" href="https://github.com/KelvinLu/idlegif.js" style="color: white;">idlegif.js | made with &#9829; &amp; &#9749;</a> | <a target="_blank" href="http://giphy.com/" style="color: white;">powered by Giphy</a>';

        document.body.appendChild(container);
        container.appendChild(image);
        container.appendChild(footer);

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

    // Called from idlegif
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
        // note that anonymous function is called from image object
        this.bindEvent(this.image, 'load', function() {
            idlegif.container.style.opacity = 1;
            idlegif.container.style.pointerEvents = 'auto';
        });
    },

    hideIdleGif: function() {
        this.container.style.opacity = 0;
        this.container.style.pointerEvents = 'none';
    },

    // For compatibility issues with adding event handlers
    bindEvent: function(elem, e, func) {
        if (elem.addEventListener)
            elem.addEventListener(e, func, false);
        else
            elem.attachEvent('on' + e, func);
    },
}