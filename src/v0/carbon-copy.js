(function () {
    const p = 'c-c-';
    const cg = p + 'get-';
    //const cgp = cg + 'props-';
    const ic = p + 'initial-child';
    const hs = p + 'href-stamp';
    const sh = 'stamp-href';
    const os = p + 'orig-style';
    // const tn = ['c-c', 'carbon-copy']
    /**
    * `carbon-copy`
    * Dependency free web component that allows downloading / caching of HTML Templates from external HTML Files.
    *
    *
    * @customElement
    * @polymer
    * @demo demo/index.html
    */
    class CC extends HTMLElement {
        static get observedAttributes() {
            return [
                /** @type {string} Url to resource containing the Template, identified by the hash after the url
                 * which must match the id of the template.
                 * e.g. <c-c href="/my/path/myFile.html#myId"></c-c>
                 * If reference is inside the same document as the referencer, use href="#myId"
                 */
                'href',
                /** @type {string} Name of event to emit when loading complete.  Allows container to modify the template.
                 *
                 */
                // 'loaded-event-name',
                // /**
                //  * @type {boolean} indicates whether dispatching events should extend beyond shadow dom
                //  */
                'composed',
                /**
                 * @type {string} Retrieve content from referring container (or higher)
                 *
                 */
                'get',
                /**
                 * @type {string} Provide content to referenced content
                 */
                'set',
                // /**
                //  * @type {string} Retrieve this semicolon delimited list of properties
                //  */
                // 'get-props',
                /**
                 * @type {boolean} Listen for queries regarding these properties (semicolon delimited)
                 */
                'set-props',
                /**
                 * @type {boolean} Persist previous templates when the href changes
                 */
                sh,
                /**
                 * @type {boolean} Don't load href url when this property is true (or attribute is present)
                 */
                'wait'
            ];
        }
        //from https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
        absolute(base, relative) {
            var stack = base.split("/"), parts = relative.split("/");
            stack.pop(); // remove current file name (or empty string)
            // (omit if "base" is the current folder without trailing slash)
            parts.forEach(part => {
                switch (part) {
                    case '.':
                        return;
                    case '..':
                        stack.pop();
                        break;
                    default:
                        stack.push(part);
                }
            });
            return stack.join("/");
        }
        append(shadowDOM, id, absUrl, url) {
            const templ = shadowDOM.getElementById(id);
            //     //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
            const clone = document.importNode(templ.content, true);
            //inspired by https://github.com/google/ioweb2015/blob/master/app/scripts/helper/router.js#L27
            const otherTargets = this.qsa('[cc-head-element]', clone);
            otherTargets.forEach(target => target.remove());
            if (this._stamp_href) {
                this.qsa('[' + ic + ']').forEach(initialChild => {
                    initialChild.style.display = 'none';
                });
                const children = clone.children;
                for (let i = 0, ii = children.length; i < ii; i++) {
                    const child = children[i];
                    child.setAttribute(hs, this._href);
                }
            }
            this.de('dom-change', {
                clone: clone
            });
            const newNode = this.appendChild(clone);
            otherTargets.forEach(target => {
                var script = document.createElement('script');
                script.text = target['text'] || target.textContent || target.innerHTML;
                document.head.appendChild(script);
            });
            if (this._set_props) {
                this.qsa('[get-props]', this).forEach(el => {
                    const getPropAttr = el.getAttribute('get-props').split(';').forEach(prop => {
                        const nvp = prop.split(':');
                        const param = nvp[1];
                        const val = this[param];
                        el[nvp[0]] = this[param];
                        if (!this.pcs)
                            this.pcs = {};
                        if (!this.pcs[param]) {
                            this.pcs[param] = [];
                            const setter = function (newVal) {
                                this.pcs[param].forEach(el => el[param] = newVal);
                            };
                            Object.defineProperty(this, param, {
                                enumerable: true,
                                configurable: true,
                                set: setter,
                            });
                            this[param] = val;
                        }
                        this.pcs[param].push(el);
                    });
                    el.removeAttribute('get-props');
                });
            }
            this.qsa('[notify-props]', this).forEach(el => {
                const tagName = el.tagName.toLowerCase();
                customElements.whenDefined(tagName).then(() => {
                    const ceDef = customElements.get(tagName);
                    if (ceDef.properties) {
                        for (var key in ceDef.properties) {
                            const property = ceDef.properties[key];
                            this.attachPropertyListener(property, key, el);
                        }
                    }
                });
            });
        }
        qsa(css, from) {
            return [].slice.call((from ? from : this).querySelectorAll(css));
        }
        attachEventHandlers(ce, newNode) {
            if (!newNode)
                newNode = this;
            Object.getOwnPropertyNames(ce).forEach(methodName => {
                const method = ce[methodName];
                if (typeof method !== 'function')
                    return;
                const attrName = 'call-' + methodName + '-on';
                this.qsa(`[${attrName}]`, newNode).forEach(methodNode => {
                    const triggerEventNames = methodNode.getAttribute(attrName).split('|');
                    triggerEventNames.forEach(triggerEventName => {
                        methodNode.addEventListener(triggerEventName, ev => {
                            ce[methodName](ev);
                        });
                    });
                });
            });
        }
        get_h() {
            let parentElement = this.parentElement;
            while (parentElement) {
                if (parentElement.shadowRoot)
                    return parentElement.shadowRoot;
                parentElement = parentElement.parentElement;
            }
        }
        loadHref() {
            this._once = true;
            //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
            if (!this._href)
                return;
            if (this._wait)
                return;
            let needToProcessFurther = true;
            //console.log('stamphref = ' + this._stamp_href);
            if (this._stamp_href) {
                //check for existing nodes, that don't match url, and  hide them
                this.qsa(':scope > [' + hs + ']').forEach(existingNode => {
                    if (existingNode.getAttribute(hs) === this._href) {
                        needToProcessFurther = false;
                        existingNode.style.display = existingNode[os];
                    }
                    else {
                        existingNode[os] = existingNode.style.display;
                        existingNode.style.display = 'none';
                    }
                });
            }
            if (!needToProcessFurther)
                return;
            const splitHref = this._href.split('#');
            if (splitHref.length < 2)
                return;
            const url = splitHref[0];
            const id = splitHref[1];
            if (url.length === 0) {
                this.append(document, id, null, url);
                return;
            }
            if (url === '_host') {
                const host = this.get_h();
                //if(!host) throw 'Unable to find host';
                this.append(host, id, null, url);
                return;
            }
            const isAbsTests = ['https://', '/', '//', 'http://'];
            let isAbsolute = false;
            for (let i = 0, ii = isAbsTests.length; i < ii; i++) {
                if (url.startsWith(isAbsTests[i])) {
                    this._absUrl = url;
                    isAbsolute = true;
                    break;
                }
            }
            if (!isAbsolute) {
                this._absUrl = this.absolute(location.href, url); //TODO:  baseHref
            }
            const absUrl = this._absUrl;
            let shadowDOM = CC._shadowDoms[absUrl];
            //let templ = 'hello' as any;//: HTMLTemplateElement;
            if (shadowDOM) {
                switch (typeof shadowDOM) {
                    case 'boolean':
                        const subscribers = CC._shDmSub;
                        const fn = (sr) => {
                            this.append(sr, id, absUrl, url);
                        };
                        if (!subscribers[absUrl]) {
                            subscribers[absUrl] = [fn];
                        }
                        else {
                            subscribers[absUrl].push(fn);
                        }
                        break;
                    case 'object':
                        this.append(shadowDOM, id, absUrl, url);
                        break;
                }
            }
            else {
                CC._shadowDoms[absUrl] = true;
                fetch(absUrl).then(resp => {
                    resp.text().then(txt => {
                        const container = document.createElement('div');
                        container.style.display = 'none';
                        document.body.appendChild(container);
                        const shadowRoot = container.attachShadow({ mode: 'open' });
                        CC._shadowDoms[absUrl] = shadowRoot;
                        const parser = new DOMParser();
                        let docFrag = parser.parseFromString(txt, 'text/html');
                        if (docFrag.head) {
                            this.qsa('meta[name="preprocessor"]', docFrag).forEach(metaProcessorTag => {
                                const metaProcessorIdentifier = metaProcessorTag.getAttribute('content');
                                //TODO:  validate identifier looks safe?
                                const metaProcessor = eval(metaProcessorIdentifier);
                                docFrag = metaProcessor(docFrag, this);
                            });
                        }
                        shadowRoot.appendChild(docFrag.body);
                        this.append(shadowRoot, id, absUrl, url);
                        const subscribers = CC._shDmSub[absUrl];
                        if (subscribers) {
                            subscribers.forEach(subscriber => subscriber(shadowRoot));
                            delete CC._shDmSub[absUrl];
                        }
                    });
                });
            }
        }
        c2() {
            if (this._set) {
                const params = this._set.split(';');
                params.forEach(param => {
                    const nameValuePair = param.split(':');
                    const key = nameValuePair[0];
                    const val = nameValuePair[1];
                    this.addEventListener(cg + key, e => {
                        e['detail'].value = val;
                    });
                });
            }
            if (this._get) {
                const newEvent = this.de(cg + this._get, {});
                this.innerHTML = newEvent.detail.value;
            }
            this.loadHref();
        }
        /**
        * Converts "camelCase" identifier (e.g. `fooBarBaz`) to "dash-case"
        * (e.g. `foo-bar-baz`).  From Polymer utils
        *
        * @memberof Polymer.CaseMap
        * @param {string} camel Camel-case identifier
        * @return {string} Dash-case representation of the identifier
        */
        camelToDashCase(camel) {
            return CC.caseMap[camel] || (CC.caseMap[camel] = camel.replace(CC.CAMEL_TO_DASH, '-$1').toLowerCase());
        }
        connectedCallback() {
            //https://github.com/w3c/webcomponents/issues/551
            setTimeout(() => {
                //hack?
                this.c2();
            }, 1);
        }
        attachPropertyListener(property, key, nextSibling) {
            if (property.notify) {
                const dashCaseKey = this.camelToDashCase(key);
                const dashCaseKeyChanged = dashCaseKey + '-changed';
                const notifyingKey = key;
                nextSibling.addEventListener(dashCaseKeyChanged, e => {
                    const val = e['detail'].value;
                    this[notifyingKey] = val;
                    this.de(dashCaseKeyChanged, {
                        value: val
                    });
                    // const newEvent = new CustomEvent(dashCaseKeyChanged, {
                    //     detail: {
                    //         value: val
                    //     },
                    //     bubbles: true,
                    //     composed: false,
                    // } as CustomEventInit);
                    // this.dispatchEvent(newEvent);
                });
            }
        }
        de(name, detail) {
            const newEvent = new CustomEvent(name, {
                detail: detail,
                bubbles: true,
                composed: this._composed
            });
            this.dispatchEvent(newEvent);
            return newEvent;
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case 'href':
                    this._href = newValue;
                    if (this._once)
                        this.loadHref();
                    break;
                case sh:
                    this._stamp_href = (newValue !== undefined);
                    break;
                case 'set-props':
                    this._set_props = newValue !== null;
                    break;
                case 'composed':
                    this._composed = newValue !== null;
                    break;
                case 'wait':
                    this._wait = newValue !== null;
                    break;
                default:
                    this['_' + name.replace('-', '_')] = newValue;
            }
        }
        set href(val) {
            this.setAttribute('href', val);
            //this._href = val;
            //this.loadHref();
        }
        get href() {
            return this._href;
        }
        set wait(val) {
            this._wait = val;
            if (val) {
                this.setAttribute('wait', '');
            }
            else {
                this.removeAttribute('wait');
                this.loadHref();
            }
        }
    }
    /**
     * A globally available lookup between the url (including hashtag id) and the shadowroot
     */
    CC._shadowDoms = {};
    /**
     * emporary subscriber needed for updating the dom.
     */
    CC._shDmSub = {};
    CC.caseMap = {};
    CC.CAMEL_TO_DASH = /([A-Z])/g;
    class CarbonCopy extends CC {
    }
    ;
    customElements.define('c-c', CC);
    customElements.define('carbon-copy', CarbonCopy);
})();
//# sourceMappingURL=carbon-copy.js.map