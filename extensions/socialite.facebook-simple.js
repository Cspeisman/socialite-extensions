/*!
 * Socialite v2.0 - Plain FB Share Extension
 * Copyright (c) 2013 Dan Drinkard
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 */
(function(window, document, Socialite, undefined)
{

    /**
     * FB Share is no longer supported, but params are:
     * u | data-url    | URL to share
     * t | data-title  | Title to share
     *
     * Others may work, but that will come later. For now just set OG tags.
     *
     */

    var addEvent = function(obj, evt, fn, capture) {
        if (window.attachEvent) {
            obj.attachEvent("on" + evt, fn);
        }
        else {
            if (!capture) capture = false; // capture
            obj.addEventListener(evt, fn, capture);
        }
    },

    facebookGetCount = function(instance, options) {
        var params = getParams(instance),
            counturl = params['counturl'] || params['url'],
            callback = 'socialiteFacebookShare' + instance.uid,
            endpoint = "https://graph.facebook.com/fql?q=" + encodeURIComponent("select total_count from link_stat where url = '") + counturl + "'&callback=" + callback,
            options = options || {},
            scriptTag = document.createElement('script');
            scriptTag.src = endpoint;
            document.getElementsByTagName('script')[0].insertBefore(scriptTag);
            window[callback] = function(data){
                var count = data.data[0].total_count;
                if (count > 1000000) {
                    count = (count / 1000000).toFixed(1) + 'm';
                } else if (count > 1000) {
                    count = (count / 1000).toFixed(1) + 'k';
                }
                instance.el.querySelectorAll('.counter')[0].innerHTML = count;
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
                hsh[parts[i-1]] = parts[i];
            };
        };
        return hsh;
    },

    appendStyleSheet = function() {
        (document.querySelectorAll('style.custom-count-widgets').length || (function(){
            var styleTag = document.createElement('style');
            styleTag.className = 'custom-count-widgets';
            styleTag.innerHTML = '.socialite .counter { border-radius: 2px; background:#fff; position:relative; margin-left: 5px; vertical-align: middle; display:inline-block; min-width:6px; border:1px solid #e6e5e3; padding:6px 7px; font-family:"helvetica neue", helvetica, arial, sans-serif; font-size:13px; line-height:1.2; color:#222; text-decoration: none; }' +
                                 '.socialite .counter:before { content:""; position:absolute; left: -5px; top: 10px; background:#fff; border:1px solid #e6e5e3; border-right:none; border-top:none; display:block; width:7px; height:6px; -webkit-transform: rotate(61deg) skewX(35deg); -moz-transform: rotate(61deg) skewX(35deg); -o-transform: rotate(61deg) skewX(35deg); -ms-transform: rotate(61deg) skewX(35deg); transform: rotate(61deg) skewX(35deg); }' +
                                 '.socialite img { vertical-align: middle; }';
            document.getElementsByTagName('head')[0].appendChild(styleTag);
        })());
    }

    Socialite.widget('facebook', 'simple', {
        init: function(instance) {
            var el = document.createElement('a'),
                href = "//www.facebook.com/share.php?",
                attrs = Socialite.getDataAttributes(instance.el, true, true);

            el.className = instance.widget.name;
            Socialite.copyDataAttributes(instance.el, el);
            if(attrs.url) href += 'u=' + encodeURIComponent(attrs.url);
            if(attrs['title']) href += '&t=' + encodeURIComponent(attrs['title']);
            href += '&' + Socialite.getDataAttributes(el, true);
            el.setAttribute('href', href);
            el.setAttribute('data-lang', instance.el.getAttribute('data-lang') || Socialite.settings.facebook.lang);
            if (instance.el.getAttribute('data-image')) {
                var imgTag = document.createElement('img');
                imgTag.src = instance.el.getAttribute('data-image');
                el.appendChild(imgTag);
            }
            if (instance.el.getAttribute('data-sficon')) {
                var iconTag = document.createElement('span');
                iconTag.className = instance.el.getAttribute('data-sficon');
                el.appendChild(iconTag);
            }
            if (instance.el.getAttribute('data-show-counts') == 'true') {
                var counterTag = document.createElement('span')
                counterTag.className = 'counter';
                counterTag.innerHTML = '&hellip;';
                el.appendChild(counterTag);
            }
            addEvent(el, 'click', function(e){
                var t = e? e.target : window.event.srcElement;
                e.preventDefault();
                var counter = el.querySelectorAll('.counter');
                counter.length && (function(){
                    var count = parseFloat(counter[0].innerHTML);
                    counter[0].innerHTML = count + 1;
                })();
                window.open(el.getAttribute('href'), 'fb-share', 'left=' + (screen.availWidth/2 - 350) + ',top=' + (screen.availHeight/2 - 163) + ',height=325,width=700,menubar=0,resizable=0,status=0,titlebar=0');
            });
            instance.el.appendChild(el);
        },
        activate: function(instance){
            if (getParams(instance)['show-counts'] == 'true') {
                appendStyleSheet();
                facebookGetCount(instance);
            }
        }
    });

})(window, window.document, window.Socialite);

