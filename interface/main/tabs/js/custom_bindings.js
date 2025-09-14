/**
 * custom_bindings.js
 *
 * @package   OpenEMR
 * @link      http://www.open-emr.org
 * @author    Kevin Yeh <kevin.y@integralemr.com>
 * @author    Brady Miller <brady.g.miller@gmail.com>
 * @copyright Copyright (c) 2016 Kevin Yeh <kevin.y@integralemr.com>
 * @copyright Copyright (c) 2016 Brady Miller <brady.g.miller@gmail.com>
 * @license   https://github.com/openemr/openemr/blob/master/LICENSE GNU General Public License 3
 */

ko.bindingHandlers.location={
    init: function(element,valueAccessor, allBindings,viewModel, bindingContext)
    {
        var tabData = ko.unwrap(valueAccessor());
        tabData.window=element.contentWindow;
        element.addEventListener("load",
            function()
            {

                var cwDocument;
                try {
                    cwDocument=this.contentWindow.document;
                } catch ( e ) {
                    // The document is not available, possibly because it's on another domain (ie NewCrop)
                    cwDocument = false;
                }

                if ( cwDocument ) {
                    $(function () {
                            var jqDocument = $(cwDocument);
                            var titleDocument = jqDocument.attr('title');
                            var titleText = "Unknown";
                            var titleClass = jqDocument.find(".title:first");
                            if (titleDocument.length >= 1) {
                                titleText = titleDocument;
                            }
                            else if (titleClass.length >= 1) {
                                titleText = titleClass.text();
                            }
                            else {
                                var frameDocument = jqDocument.find("frame");
                                if (frameDocument.length >= 1) {
                                    titleText = frameDocument.attr("name");
                                    var jqFrameDocument = $(frameDocument.get(0).contentWindow.document);
                                    titleClass = jqFrameDocument.find(".title:first");
                                    if (titleClass.length >= 1) {
                                        titleText = titleClass.text();
                                    }
                                    var subFrame = frameDocument.get(0);
                                    subFrame.addEventListener("load",
                                        function () {
                                            var subFrameDocument = $(subFrame.contentWindow.document);
                                            titleClass = $(subFrameDocument).find(".title:first");
                                            if (titleClass.length >= 1) {
                                                titleText = titleClass.text();
                                                tabData.title(titleText);
                                            }

                                        });
                                }
                                else {
                                    var bold = jqDocument.find("b:first");
                                    if (bold.length) {
                                        titleText = bold.text();
                                    }
                                    else {
                                        var title = jqDocument.find("title");
                                        if (title.length) {
                                            titleText = title.text();
                                        }
                                    }

                                }

                            }
                            tabData.title(titleText);
                            // Inject responsive helpers into the iframe if the document is same-origin
                            try {
                                // Ensure viewport meta for mobile responsiveness
                                if (cwDocument.head && !cwDocument.querySelector('meta[name="viewport"]')) {
                                    var meta = cwDocument.createElement('meta');
                                    meta.setAttribute('name', 'viewport');
                                    meta.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no');
                                    cwDocument.head.appendChild(meta);
                                }
                                // Add CSS overrides only once per document
                                if (cwDocument.head && !cwDocument.querySelector('style[data-oemr-tabs-responsive="1"]')) {
                                    var style = cwDocument.createElement('style');
                                    style.setAttribute('data-oemr-tabs-responsive', '1');
                                    var css = ''
                                        + '@media (max-width: 992px){'
                                        + '  html, body{width:100% !important; min-width:0 !important; overflow-x:hidden;}'
                                        + '  .container, .container-fluid, .container-sm, .container-md, .container-lg, .container-xl, .container-xxl{max-width:100% !important;}'
                                        + '  #container, #main, .main, .wrapper, .content, .pagecontent{min-width:0 !important; width:auto !important;}'
                                        + '  .row{margin-left:0; margin-right:0;}'
                                        + '  table{width:100% !important; table-layout:fixed;}'
                                        + '  td, th{word-wrap:break-word; overflow-wrap:break-word;}'
                                        + '  fieldset{min-width:0 !important;}'
                                        + '  /* Make form controls expand to their container width */'
                                        + '  td > input:not([type=checkbox]):not([type=radio]), td > select, td > textarea,'
                                        + '  .form-group > input, .form-group > select, .form-group > textarea,'
                                        + '  input.form-control, select.form-control, textarea.form-control,'
                                        + '  .oe-input, .oe-select, .oe-textarea {width:100% !important; max-width:100%; box-sizing:border-box;}'
                                        + '  .table-responsive{overflow-x:auto;}'
                                        + '  img, video, iframe{max-width:100%; height:auto;}'
                                        + '  /* Equalize grouped inline controls using CSS Grid */'
                                        + '  .oemr-eq{display:grid !important; grid-template-columns:repeat(var(--oemr-eq-cols,2), minmax(7rem,1fr)); gap:.5rem; align-items:center;}'
                                        + '  .oemr-eq > *{min-width:0;}'
                                        + '}'
                                        ;
                                    style.appendChild(cwDocument.createTextNode(css));
                                    cwDocument.head.appendChild(style);
                                }
                                // Light heuristic to equalize multiple inline controls (eg: First/Middle/Last)
                                try {
                                    var win = cwDocument.defaultView || window;
                                    if (win && win.innerWidth <= 992) {
                                        var containers = Array.prototype.slice.call(cwDocument.querySelectorAll('td, .form-inline, .oe-inline-group, .form-row, .row, .form-group'));
                                        function topLevelChild(td, el) {
                                            var cur = el;
                                            while (cur && cur.parentElement && cur.parentElement !== td) {
                                                cur = cur.parentElement;
                                            }
                                            return (cur && cur.parentElement === td) ? cur : el;
                                        }
                                        function equalize(container) {
                                            // Find all visible controls within container at any depth
                                            var controls = Array.prototype.slice.call(container.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=submit]), select, textarea'))
                                                .filter(function(el){ return el.offsetParent !== null; });
                                            var n = controls.length;
                                            if (n >= 2 && n <= 4) {
                                                // Compute top-level wrappers for each control
                                                var wrappers = [];
                                                controls.forEach(function(ctrl){
                                                    var wrap = topLevelChild(container, ctrl);
                                                    if (wrappers.indexOf(wrap) === -1) { wrappers.push(wrap); }
                                                });
                                                if (wrappers.length >= 2) {
                                                    container.classList.add('oemr-eq');
                                                    container.style.setProperty('--oemr-eq-cols', String(wrappers.length));
                                                    wrappers.forEach(function(w){
                                                        w.style.minWidth = '0';
                                                        w.style.maxWidth = '100%';
                                                        w.style.boxSizing = 'border-box';
                                                    });
                                                }
                                            }
                                        }
                                        containers.forEach(equalize);
                                        // Run again after short delays to catch late-rendered layouts on mobile
                                        setTimeout(function(){ containers.forEach(equalize); }, 50);
                                        setTimeout(function(){ containers.forEach(equalize); }, 300);
                                        // Re-equalize on iframe resize to handle orientation changes
                                        win.addEventListener('resize', function(){
                                            if (win.innerWidth <= 992) {
                                                containers.forEach(equalize);
                                            }
                                        });
                                    }
                                } catch(e) { /* no-op */ }
                                // Propagate injection to same-origin nested frames/iframes
                                try {
                                    function injectInto(doc) {
                                        if (!doc || !doc.head) { return; }
                                        // viewport
                                        if (!doc.querySelector('meta[name="viewport"]')) {
                                            var m = doc.createElement('meta');
                                            m.setAttribute('name', 'viewport');
                                            m.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no');
                                            doc.head.appendChild(m);
                                        }
                                        // css
                                        if (!doc.querySelector('style[data-oemr-tabs-responsive="1"]')) {
                                            var s = doc.createElement('style');
                                            s.setAttribute('data-oemr-tabs-responsive', '1');
                                            var css2 = ''
                                                + '@media (max-width: 992px){'
                                                + '  html, body{width:100% !important; min-width:0 !important; overflow-x:hidden;}'
                                                + '  .container, .container-fluid, .container-sm, .container-md, .container-lg, .container-xl, .container-xxl{max-width:100% !important;}'
                                                + '  #container, #main, .main, .wrapper, .content, .pagecontent{min-width:0 !important; width:auto !important;}'
                                                + '  .row{margin-left:0; margin-right:0;}'
                                                + '  table{width:100% !important; table-layout:fixed;}'
                                                + '  td, th{word-wrap:break-word; overflow-wrap:break-word;}'
                                                + '  fieldset{min-width:0 !important;}'
                                                + '  td > input:not([type=checkbox]):not([type=radio]), td > select, td > textarea,'
                                                + '  .form-group > input, .form-group > select, .form-group > textarea,'
                                                + '  input.form-control, select.form-control, textarea.form-control,'
                                                + '  .oe-input, .oe-select, .oe-textarea {width:100% !important; max-width:100%; box-sizing:border-box;}'
                                                + '  .table-responsive{overflow-x:auto;}'
                                                + '  img, video, iframe{max-width:100%; height:auto;}'
                                                + '  .oemr-eq{display:grid !important; grid-template-columns:repeat(var(--oemr-eq-cols,2), minmax(7rem,1fr)); gap:.5rem; align-items:center;}'
                                                + '  .oemr-eq > *{min-width:0;}'
                                                + '}'
                                                ;
                                            s.appendChild(doc.createTextNode(css2));
                                            doc.head.appendChild(s);
                                        }
                                        try {
                                            var w = doc.defaultView || window;
                                            if (w && w.innerWidth <= 992) {
                                                var containers2 = Array.prototype.slice.call(doc.querySelectorAll('td, .form-inline, .oe-inline-group, .form-row, .row, .form-group'));
                                                function topParent(td, el) {
                                                    var cur = el;
                                                    while (cur && cur.parentElement && cur.parentElement !== td) { cur = cur.parentElement; }
                                                    return (cur && cur.parentElement === td) ? cur : el;
                                                }
                                                function equalize2(container) {
                                                    var ctrls = Array.prototype.slice.call(container.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=submit]), select, textarea'))
                                                        .filter(function(el){ return el.offsetParent !== null; });
                                                    var n = ctrls.length;
                                                    if (n >= 2 && n <= 4) {
                                                        var wraps = [];
                                                        ctrls.forEach(function(ctrl){ var wrap = topParent(container, ctrl); if (wraps.indexOf(wrap) === -1) { wraps.push(wrap); } });
                                                        if (wraps.length >= 2) {
                                                            container.classList.add('oemr-eq');
                                                            container.style.setProperty('--oemr-eq-cols', String(wraps.length));
                                                            wraps.forEach(function(wrap){ wrap.style.minWidth='0'; wrap.style.maxWidth='100%'; wrap.style.boxSizing='border-box'; });
                                                        }
                                                    }
                                                }
                                                containers2.forEach(equalize2);
                                                setTimeout(function(){ containers2.forEach(equalize2); }, 50);
                                                setTimeout(function(){ containers2.forEach(equalize2); }, 300);
                                                w.addEventListener('resize', function(){ if (w.innerWidth <= 992) { containers2.forEach(equalize2); } });
                                            }
                                        } catch(e) { /* no-op */ }
                                    }
                                    // Attach to nested iframes
                                    var nestedIframes = Array.prototype.slice.call(cwDocument.querySelectorAll('iframe'));
                                    nestedIframes.forEach(function(ifr){
                                        function onLoad(){
                                            try { injectInto(ifr.contentWindow && ifr.contentWindow.document); } catch(e) { }
                                        }
                                        ifr.addEventListener('load', onLoad);
                                        // If already loaded, apply soon
                                        setTimeout(onLoad, 0);
                                    });
                                    // Attach to legacy <frame> elements
                                    var legacyFrames = Array.prototype.slice.call(cwDocument.getElementsByTagName('frame'));
                                    legacyFrames.forEach(function(fr){
                                        function onLoadF(){
                                            try { injectInto(fr.contentWindow && fr.contentWindow.document); } catch(e) { }
                                        }
                                        fr.addEventListener('load', onLoadF);
                                        setTimeout(onLoadF, 0);
                                    });
                                } catch(e) { /* no-op */ }
                            } catch(e) { /* no-op */ }
                        }
                    );
                } else {
                    // need to cancel the loading if we are on another domain
                    // setting the title will hide the spinner and remove the Loading... text
                    tabData.title(xl("Unknown"));
                }
            } ,true
        );

    },
    update: function(element,valueAccessor, allBindings,viewModel, bindingContext)
    {
        var tabData = ko.unwrap(valueAccessor());
        element.src=tabData.url();
    }
};

ko.bindingHandlers.iframeName = {
    init: function(element,valueAccessor, allBindings,viewModel, bindingContext)
    {
    },
    update: function(element,valueAccessor, allBindings,viewModel, bindingContext)
    {
        element.name=ko.unwrap(valueAccessor());
    }
};
