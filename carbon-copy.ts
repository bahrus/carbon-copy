declare var HTMLImports;

module xtal.elements {
    function initCarbonCopy() {
        if (customElements.get('c-c')) return;

        class CarbonCopy extends HTMLElement {
            static get observedAttributes() {
                return [
                    /** @type {string} Url to resource containing the Template, identified by the hash after the url
                     * which must match the id of the template.
                     * e.g. <c-c href="/my/path/myFile.html#myId"></c-c>
                     * If reference is inside the same document as the referencer, use href="./#myId"
                     */
                    'href',
                    /** @type {string} Name of event to emit when loading complete.  Allows container to modify the template.
                     * 
                     */
                    'dispatch-type-arg',
                    /**
                     * @type {boolean} indicates whether dispatching should bubble
                     */
                    'bubbles',
                    /**
                     * @type {boolean} indicates whether dispatching should extend beyond shadow dom
                     */
                    'composed'
                ];
            }
            _dispatchTypeArg;
            _bubbles;
            _composed;
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case 'href':
                        //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
                        // const tmpl = document.querySelector(newValue);
                        // const clone = document.importNode(tmpl.content, true);
                        // this.parentElement.insertAdjacentElement('afterend', clone);
                        const splitHref = newValue.split('#');
                        const _this = this;
                        CarbonCopy.importHREF(splitHref[0]).then(({link, event}) => {
                            //https://www.html5rocks.com/en/tutorials/webcomponents/imports/
                            event.stopPropagation();
                            const templ = link.import.getElementById(splitHref[1]);
                            if(_this._dispatchTypeArg){
                                const newEvent = new CustomEvent(_this._dispatchTypeArg, {
                                    detail: {
                                        template: templ,
                                        link: link,
                                        linkLoadEvent: event,
                                    },
                                    bubbles: _this._bubbles,
                                    composed: _this._composed
                                } as CustomEventInit);
                                
                                _this.dispatchEvent(newEvent);
                            }

                            //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
                            
                            const clone = document.importNode(templ.content, true) as HTMLDocument;
                            
                            this.appendChild(clone);
                            
                        })
                        break;
                    case 'dispatch-type-arg':
                        this._dispatchTypeArg = newValue;
                        break;
                    case 'bubbles':
                        this._bubbles = true;
                        break;
                    case 'composed':
                        this._composed = true;
                        break;
                }
            }

            static whenImportsReady(cb) {
                //code copied from Polymer's import-href.html
                if (window['HTMLImports']) {
                    HTMLImports.whenReady(cb);
                } else {
                    cb();
                }
            }

            static importHREF(href) {
                return new Promise((resolve, reject) => {
                    let link = document.head.querySelector('link[href="' + href + '"][import-href]') as HTMLLinkElement;
                    if (!link) {
                        link = /** @type {HTMLLinkElement} */ (document.createElement('link'));
                        link.rel = 'import';
                        link.href = href;
                        link.setAttribute('import-href', '');
                        link.setAttribute('async', '');
                    }
                    let cleanup = function () {
                        link.removeEventListener('load', loadListener);
                        link.removeEventListener('error', errorListener);
                    }

                    // NOTE: the link may now be in 3 states: (1) pending insertion,
                    // (2) inflight, (3) already laoded. In each case, we need to add
                    // event listeners to process callbacks.

                    let loadListener = function (event) {
                        cleanup();
                        // In case of a successful load, cache the load event on the link so
                        // that it can be used to short-circuit this method in the future when
                        // it is called with the same href param.
                        link['__dynamicImportLoaded'] = true;
                        CarbonCopy.whenImportsReady(() => {
                            resolve({link: link, event: event});
                        });
                    };
                    let errorListener = function (event) {
                        cleanup();
                        // In case of an error, remove the link from the document so that it
                        // will be automatically created again the next time `importHref` is
                        // called.
                        if (link.parentNode) {
                            link.parentNode.removeChild(link);
                        }
                        if (onerror) {
                            CarbonCopy.whenImportsReady(() => {
                                reject({link: link, event: event});
                            });
                        }
                    };
                    link.addEventListener('load', loadListener);
                    link.addEventListener('error', errorListener);
                    if (link.parentNode == null) {
                        document.head.appendChild(link);
                        // if the link already loaded, dispatch a fake load event
                        // so that listeners are called and get a proper event argument.
                    } else if (link['__dynamicImportLoaded']) {
                        link.dispatchEvent(new Event('load'));
                    }
                    return link;
                })

            }
        }
        customElements.define('c-c', CarbonCopy);
        customElements.define('carbon-ccopy', CarbonCopy);
    }

    initCarbonCopy();
}
