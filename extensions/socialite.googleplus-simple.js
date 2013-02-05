/*!
 * Socialite v2.0 - Plain G+ Share Extension
 * Copyright (c) 2013 Dan Drinkard
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 */
(function(window, document, Socialite, undefined)
{

    /**
     * Google plus doesn't offer a share widget that is icon only, like their badge
     * u | data-url    | URL to share
     *
     * Inherits content from document meta information
     *
     */

    function addEvent(obj, evt, fn, capture) {
        if (window.attachEvent) {
            obj.attachEvent("on" + evt, fn);
        }
        else {
            if (!capture) capture = false; // capture
            obj.addEventListener(evt, fn, capture);
        }
    }

    Socialite.widget('googleplus', 'simple', {
        init: function(instance) {
            var el = document.createElement('a'),
                href = "//plus.google.com/share?",
                attrs = Socialite.getDataAttributes(instance.el, true, true);

            el.className = instance.widget.name;
            Socialite.copyDataAttributes(instance.el, el);
            href += '&' + Socialite.getDataAttributes(el, true);
            el.setAttribute('href', href);
            el.setAttribute('data-lang', instance.el.getAttribute('data-lang') || Socialite.settings.facebook.lang);
            if (instance.el.getAttribute('data-image')) {
                imgTag = document.createElement('img');
                imgTag.src = instance.el.getAttribute('data-image');
                el.appendChild(imgTag);
            }
            addEvent(el, 'click', function(e){
                var t = e? e.target : window.event.srcElement;
                e.preventDefault();
                window.open(el.getAttribute('href'), 'gplus-share', 'left=' + (screen.availWidth/2 - 350) + ',top=' + (screen.availHeight/2 - 163) + ',height=300,width=600,menubar=0,resizable=0,status=0,titlebar=0');
            });
            instance.el.appendChild(el);
        },
        activate: function(){}
    });

})(window, window.document, window.Socialite);

