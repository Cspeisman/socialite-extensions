/*!
 * Socialite v2.0 - Plain Linkedin Share Extension
 * Copyright (c) 2013 Dan Drinkard
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 */
(function(window, document, Socialite, undefined)
{

    /**
     * This is based on the linkedin bookmarklet: http://www.linkedin.com/static?key=browser_bookmarklet
     * Params are:
     *
     * url   | data-url    | URL to share
     * title | data-title  | Title to share
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

    Socialite.widget('linkedin', 'simple', {
        init: function(instance) {
            var el = document.createElement('a'),
                href = "//www.linkedin.com/shareArticle?mini=true&ro=false&trk=socialite.linkedin-simple",
                attrs = Socialite.getDataAttributes(instance.el, true, true);

            el.className = instance.widget.name;
            Socialite.copyDataAttributes(instance.el, el);
            href += '&' + Socialite.getDataAttributes(el, true);
            el.setAttribute('href', href);
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
            addEvent(el, 'click', function(e){
                var t = e? e.target : window.event.srcElement;
                e.preventDefault();
                window.open(el.getAttribute('href'), 'linkedin-simple', 'left=' + (screen.availWidth/2 - 300) + ',top=' + (screen.availHeight/2 - 200) + ',height=400,width=600,menubar=0,resizable=0,status=0,titlebar=0');
            });
            instance.el.appendChild(el);
        },
        activate: function(){}
    });

})(window, window.document, window.Socialite);

