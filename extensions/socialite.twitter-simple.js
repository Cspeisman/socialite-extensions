/*!
 * Socialite v2.0 - Plain Twitter Extension
 * Copyright (c) 2013 Dan Drinkard
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 *
 */
(function(window, document, Socialite, undefined)
{
    // https://dev.twitter.com/docs/intents/events/
    var twitterActivate = function(instance)
    {
        if (window.twttr && typeof window.twttr.widgets === 'object' && typeof window.twttr.widgets.load === 'function') {
            window.twttr.widgets.load();
        }

        if (getParams(instance)['show-counts']) {
            appendStyleSheet()
            twitterGetCount(instance);
        };
    },

    twitterGetCount = function(instance, options) {
        var params = getParams(instance),
            counturl = params['counturl'] || params['url'],
            callback = 'socialiteTwitter' + instance.uid,
            endpoint = "https://cdn.api.twitter.com/1/urls/count.json?url=" + counturl + "&callback=" + callback,
            options = options || {},
            scriptTag = document.createElement('script');
            scriptTag.src = endpoint;
            document.getElementsByTagName('script')[0].insertBefore(scriptTag);
            window[callback] = function(data){
                instance.el.querySelectorAll('.counter')[0].innerHTML = data.count;
                delete window[callback];
                scriptTag.parentNode.removeChild(scriptTag);
            }
    },

    getParams = function(instance) {
        return parseQS(Socialite.getDataAttributes(instance.el, true));
    },

    parseQS = function(qs) {
        var hsh = {},
            parts = qs.split(/[&=]/);
        for(var i in parts) {

            if  (i%2) {
                hsh[parts[i-1]] = decodeURIComponent(parts[i]);
            };
        };
        return hsh;
    },

    appendStyleSheet = function() {
        (document.querySelectorAll('style.custom-count-widgets').length || (function(){
            var styleTag = document.createElement('style');
            styleTag.className = 'custom-count-widgets';
            styleTag.innerHTML = '.socialite .counter {position:relative; margin-left: 5px; vertical-align: middle; display:inline-block; min-width:6px; border:1px solid #e6e5e3; padding:6px 7px; font-family:"helvetica neue", helvetica, arial, sans-serif; font-size:13px; line-height:1.2; color:#222; text-decoration: none; /*border-radius: 2px;*/ }' +
                                 '.socialite .counter:before { content:""; position:absolute; left: -5px; top: 10px; background:#fff; border:1px solid #e6e5e3; border-right:none; border-top:none; display:block; width:7px; height:6px; -webkit-transform: rotate(61deg) skewX(35deg); -moz-transform: rotate(61deg) skewX(35deg); -o-transform: rotate(61deg) skewX(35deg); -ms-transform: rotate(61deg) skewX(35deg); transform: rotate(61deg) skewX(35deg); }' +
                                 '.socialite img { vertical-align: middle; }';
            document.getElementsByTagName('head')[0].appendChild(styleTag);
        })());
    }

    Socialite.widget('twitter', 'simple',   {
        init: function(instance){
            var el = document.createElement('a'),
                href = "//twitter.com/intent/tweet?";
            el.className = instance.widget.name;
            Socialite.copyDataAttributes(instance.el, el);
            href += Socialite.getDataAttributes(el, true);
            el.setAttribute('href', href);
            el.setAttribute('data-lang', instance.el.getAttribute('data-lang') || Socialite.settings.twitter.lang);
            if (instance.el.getAttribute('data-image')) {
                var imgTag = document.createElement('img');
                imgTag.src = instance.el.getAttribute('data-image');
                el.appendChild(imgTag);
            }
            if (instance.el.getAttribute('data-show-counts')) {
                var counterTag = document.createElement('a')
                counterTag.className = 'counter';
                counterTag.innerHTML = '&hellip;';
                counterTag.href="https://twitter.com/search?q=" + instance.el.getAttribute('data-url');
                el.appendChild(counterTag);
            }
            instance.el.appendChild(el);
        },
        activate: twitterActivate
    });

})(window, window.document, window.Socialite);

