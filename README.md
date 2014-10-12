idlegif.js
==========

A simple screensaver-like thing for your site. Powered by the Giphy API.

## Usage

> Just add water!

1. Load the script at the end of your ```<body>```, like ```<script src="idlegif.js"></script>```.
2. Set up idlegif's options. (e.g; ```<script>idlegif.options({ ... });</script>```) More on that below...
3. Initialize it: ```<script>idlegif.init();</script>```

## Options

idlegif is customizable. Call the ```options``` method before initialization and use an object literal as an argument, such as:
```{gifSearch: 'cute+cats', idleTime: '30s'}```

* ```gifSearch```: A search string used by the Giphy API. The search string must consist of words delimited by ```+``` signs.
* ```idleTime```: How long the webpage can remain idle until idlegif does its thing. Can be an integer in milliseconds or a string with ```s```/```ms``` at the end.
* ```color```: A valid CSS color string. Determines the color of the background behind the GIF.
* ```transition```: A valid CSS time string. Represents how long it takes for idlegif to fade in/out after it is activated/deactivated.

## Giphy

The whole GIF searching and hosting snazz is done by [Giphy](http://giphy.com) and their [API](https://github.com/giphy/GiphyAPI). It relies on their public API key (which they plan to phase out soon), so don't expect idlegif to work forever. You may need to change the script up or request your own private API key (which is dumb as this is not a server side script) in the future. Please raise a Github issue when that happens.

## Disclaimers

Blah blah blah, not liable for any damages, blah blah, not responsible for what GIFs Giphy returns, blah blah boring, don't sue if your computer catches fire, blah blah blah, be careful for epiletic GIF results-- Seriously, don't expect to be epiletic-safe when searching for ```glitch+art```.
