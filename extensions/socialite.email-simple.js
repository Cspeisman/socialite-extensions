/*!
 * Socialite v2.0 - Basic Email Share Extension
 * Copyright (c) 2013 Dan Drinkard
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 */
(function(window, document, Socialite, undefined)
{

    /**
     * This script generates a basic mailto: link with an empty address.
     * params are:
     *
     * url         | data-url         | URL to share
     * title       | data-title       | Subject line
     * description | data-description | Body text
     *
     */

    Socialite.network('email');

    function safeGetSelection() {
        if (window.getSelection) return window.getSelection();
        if (document.getSelection) return document.getSelection();
        if (document.selection) return document.selection.createRange().text;
        return '';
    }

    Socialite.widget('email', 'simple', {
        init: function(instance) {
            var el = document.createElement('a'),
                href = "mailto:?",
                attrs = Socialite.getDataAttributes(instance.el, true, true),
                title = encodeURIComponent(attrs['title']),
                description = encodeURIComponent(attrs['description']),
                selection = encodeURIComponent(safeGetSelection()),
                url = encodeURIComponent(attrs.url);

            el.className = instance.widget.name;
            Socialite.copyDataAttributes(instance.el, el);
            if(title) {
                href += '&subject=' + title;
                href += '&body=';
            }
            if(selection) href += selection;
            else if(description) href += description;
            if(url) href += '%0A%0A' + url;
            el.setAttribute('href', href);
            if (instance.el.getAttribute('data-image')) {
                imgTag = document.createElement('img');
                imgTag.src = instance.el.getAttribute('data-image');
                el.appendChild(imgTag);
            }
            instance.el.appendChild(el);
        },
        activate: function(){}
    });

})(window, window.document, window.Socialite);

