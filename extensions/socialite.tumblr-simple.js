/*!
 * Socialite v2.0 - Plain Tumblr Share Extension
 * Copyright (c) 2013 Dan Drinkard
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 */
(function(window, document, Socialite, undefined)
{

    /**
     * This script is based on the tumblr bookmarklet: http://www.tumblr.com/apps
     * params are:
     *
     * u | data-url    | URL to share
     * t | data-title  | Title to share
     *
     */

    Socialite.network('tumblr');

    function addEvent(obj, evt, fn, capture) {
        if (window.attachEvent) {
            obj.attachEvent("on" + evt, fn);
        }
        else {
            if (!capture) capture = false; // capture
            obj.addEventListener(evt, fn, capture);
        }
    }

    function safeGetSelection() {
        if (window.getSelection) return window.getSelection();
        if (document.getSelection) return document.getSelection();
        if (document.selection) return document.selection.createRange().text;
        return '';
    }

    Socialite.widget('tumblr', 'simple', {
        init: function(instance) {
            var el = document.createElement('a'),
                href = "//www.tumblr.com/share?",
                attrs = Socialite.getDataAttributes(instance.el, true, true),
                selection;

            el.className = instance.widget.name;
            Socialite.copyDataAttributes(instance.el, el);
            if(attrs.url) href += 'u=' + encodeURIComponent(attrs.url);
            if(attrs['title']) href += '&t=' + encodeURIComponent(attrs['title']);
            if(selection = safeGetSelection()) href += '&s=' + encodeURIComponent(selection);
            href += '&' + Socialite.getDataAttributes(el, true);
            el.setAttribute('href', href);
            if (instance.el.getAttribute('data-image')) {
                imgTag = document.createElement('img');
                imgTag.src = instance.el.getAttribute('data-image');
                el.appendChild(imgTag);
            }
            addEvent(el, 'click', function(e){
                var t = e? e.target : window.event.srcElement;
                e.preventDefault();
                window.open(el.getAttribute('href'), 'tumblr-simple', 'left=' + (screen.availWidth/2 - 225) + ',top=' + (screen.availHeight/2 - 215) + ',height=430,width=450,menubar=0,resizable=0,status=0,titlebar=0');
            });
            instance.el.appendChild(el);
        },
        activate: function(){}
    });

})(window, window.document, window.Socialite);

