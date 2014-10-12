// TODO:
// Add ability for user to apply arbitrary CSS filters (see http://html5-demos.appspot.com/static/css/filters/index.html)

var idlegif = {
    _options: {
        gifSearch: 'adventure+time',
        giphyApiUrl: 'http://api.giphy.com/v1/gifs/search',
        apiKey: 'dc6zaTOxFJmzC',

        idleTime: 1000,
        idleTime_ms: 1000,

        color: 'black',
        transition: '0.5s',
    },

    _gifUrls: [],
    _active: false,
    _gifReady: false,
    _timeout: null,

    init: function() {
        this.createIdleGif();
        this.doGiphyApiRequest();
        this.startTimeout();
    },

    options: function(opts) {
        for (var key in opts)
            if (opts.hasOwnProperty(key))
                this._options[key] = opts[key];
    },

    setGifSearch: function(term) {
        this._options.gifSearch = term;
    },

    setIdleTime: function() {
        this._options.gifSearch = term;
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
        footer.innerHTML = '<a target="_blank" href="https://github.com/KelvinLu/idlegif.js" style="color: white; text-decoration: none;">idlegif.js | made with &#9829; &amp; &#9749;</a> | <a target="_blank" href="http://giphy.com/" style="color: white; text-decoration: none;">powered by Giphy</a>';

        document.body.appendChild(container);
        container.appendChild(image);
        container.appendChild(footer);

        this.container = container;
        this.image = image;

        this.bindEvent(image, 'click', this.hideIdlegifAndRestartTimeout);
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

    chooseRandomGif: function() {
        if (!(gifUrl = idlegif._gifUrls[Math.floor(idlegif._gifUrls.length * Math.random())])) {
            console.log('No GIF urls were present: ' + idlegif._gifUrls);
            return;
        }

        idlegif._gifReady = false;
        idlegif.image.setAttribute('src', gifUrl);

        idlegif.bindEvent(idlegif.image, 'load', function() {idlegif._gifReady = true; console.log('idlegif.js: new GIF loaded');});

        console.log('idlegif.js: new GIF chosen');
    },

    showNewIdleGif: function() {
        console.log('idlegif.js: idle time reached');

        idlegif.chooseRandomGif();
        idlegif.showIdleGifIfReady();
    },

    showIdleGifIfReady: function() {
        if (idlegif._gifReady) idlegif.showIdleGif();
        else setTimeout(idlegif.showIdleGifIfReady, 20);
    },

    showIdleGif: function() {
        idlegif.container.style.opacity = 1;
        idlegif.container.style.pointerEvents = 'auto';
        idlegif._active = true;

        console.log('idlegif.js: showing idlegif.js');
    },

    hideIdleGif: function() {
        idlegif.container.style.opacity = 0;
        idlegif.container.style.pointerEvents = 'none';
        idlegif._active = false;

        idlegif.restartTimeout();
        console.log('idlegif.js: hiding idlegif.js');
    },

    startTimeout: function() {
        idleTime = this._options.idleTime;

        if (typeof idleTime == 'number')
            this._options.idleTime_ms = idleTime
        else if (idleTime.slice(-2) == 'ms')
            this._options.idleTime_ms = parseInt(idleTime.slice(0, -2))
        else if (idleTime.slice(-1) == 's')
            this._options.idleTime_ms = parseInt(idleTime.slice(0, -1)) * 1000

        this._timeout = setTimeout(this.showNewIdleGif, this._options.idleTime_ms);

        this.bindEvent(document, 'mousemove', this.restartTimeoutIfNotActive);
        this.bindEvent(document, 'scroll', this.hideIdlegifAndRestartTimeout);
        this.bindEvent(document, 'mousewheel', this.hideIdlegifAndRestartTimeout);
        this.bindEvent(document, 'keypress', this.hideIdlegifAndRestartTimeout);
    },

    // Called from document
    restartTimeoutIfNotActive: function() {
        if (!idlegif._active) idlegif.restartTimeout();
    },

    // Called from document
    hideIdlegifAndRestartTimeout: function() {
        if (idlegif._active) idlegif.hideIdleGif();
        idlegif.restartTimeout();
    },

    // Called from document
    restartTimeout: function() {
        clearTimeout(idlegif._timeout);
        idlegif._timeout = setTimeout(idlegif.showNewIdleGif, idlegif._options.idleTime_ms);
    },

    // For compatibility issues with adding event handlers
    bindEvent: function(elem, e, func) {
        if (elem.addEventListener)
            elem.addEventListener(e, func, false);
        else
            elem.attachEvent('on' + e, func);
    },    
}