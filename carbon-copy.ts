declare var HTMLImports;

(function () {
    /**
    * `carbon-copy`
    * Dependency free web component that allows downloading / caching of HTML Templates from external HTML Files.
    * 
    *
    * @customElement
    * @polymer
    * @demo demo/index.html
    */
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
                'event-name',
                /**
                 * @type {boolean} indicates whether dispatching should bubble
                 */
                // 'bubbles',
                // /**
                //  * @type {boolean} indicates whether dispatching should extend beyond shadow dom
                //  */
                'composed',
                /**
                 * @type {string} Retrieve content from referring container
                 * 
                 */
                'get',
                /**
                 * @type {string} Provide content to referenced content
                 */
                'set',
                /**
                 * @type {string} Mime type of content.  If present, content will be parsed,
                 * allowing for preprocessing to take place
                 */
                'type',
            ];
        }

        // connectedCallback() {
        //     this.loadHref();
        // }
        _eventName;
        //_bubbles;
        _composed;
        _href;
        _set;
        _get;
        _type;
        static _shadowDoms: { [key: string]: boolean | ShadowRoot } = {};
        static _shadowDomSubscribers: { [key: string]: [(sr: ShadowRoot) => void] } = {};
        //from https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
        absolute(base: string, relative: string): string {
            var stack = base.split("/"),
                parts = relative.split("/");
            stack.pop(); // remove current file name (or empty string)
            // (omit if "base" is the current folder without trailing slash)
            for (var i = 0; i < parts.length; i++) {
                if (parts[i] == ".")
                    continue;
                if (parts[i] == "..")
                    stack.pop();
                else
                    stack.push(parts[i]);
            }
            return stack.join("/");
        }
        // getContentFromIFrame(iframe: HTMLIFrameElement, id: string, absUrl: string, url: string) {



        // }

        copyTemplateElementInsideShadowRootToInnerHTML(shadowDOM: ShadowRoot | Document, id: string, absUrl: string, url: string) {
            const templ = shadowDOM.getElementById(id) as HTMLTemplateElement;

            //     //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template

            const clone = document.importNode(templ.content, true) as HTMLDocument;
            //const dispatchTypeArg = this.getAttribute('dispatch-type-arg');
            // if (this._eventName) {
            //     const newEvent = new CustomEvent(this._eventName, {
            //         detail: {
            //             clone: clone,
            //             absUrl: absUrl,
            //             url: url,
            //             linkLoadEvent: event,
            //         },
            //         bubbles: this._bubbles,
            //         composed: this._composed,
            //     } as CustomEventInit);
            //     this.dispatchEvent(newEvent);
            // }
            this.appendChild(clone);
        }
        loadHref() {
            //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
            if (!this._href) return;
            const splitHref = this._href.split('#');
            if (splitHref.length < 2) return;
            const url = splitHref[0];
            const id = splitHref[1];
            if (url.length === 0) {
                this.copyTemplateElementInsideShadowRootToInnerHTML(document, id, null, url);
                return;
            }
            const absUrl = this.absolute(location.href, url); //TODO:  baseHref

            const _this = this;
            let shadowDOM = CarbonCopy._shadowDoms[absUrl];
            //let templ = 'hello' as any;//: HTMLTemplateElement;
            if (shadowDOM) {
                switch (typeof shadowDOM) {
                    case 'boolean':
                        const subscribers = CarbonCopy._shadowDomSubscribers;
                        const fn = (sr: ShadowRoot) => {
                            this.copyTemplateElementInsideShadowRootToInnerHTML(sr, id, absUrl, url);
                        }
                        if (!subscribers[absUrl]) {
                            subscribers[absUrl] = [fn];
                        } else {
                            subscribers[absUrl].push(fn);
                        }
                        break;
                    case 'object':
                        this.copyTemplateElementInsideShadowRootToInnerHTML(shadowDOM as ShadowRoot, id, absUrl, url);
                        break;
                }

            } else {
                CarbonCopy._shadowDoms[absUrl] = true;
                fetch(absUrl).then(resp => {
                    resp.text().then(txt => {
                        const container = document.createElement('div');
                        container.style.display = 'none';
                        document.body.appendChild(container);
                        const shadowRoot = container.attachShadow({ mode: 'open' });
                        CarbonCopy._shadowDoms[absUrl] = shadowRoot;
                        if (this._type) {
                            const parser = new DOMParser();
                            let docFrag = parser.parseFromString(txt, this._type);
                            const metaProcessors = docFrag.head.querySelectorAll('meta[name="preprocessor"]');
                            for(let i = 0, ii = metaProcessors.length; i < ii; i++){
                                const metaProcessorTag = metaProcessors[i];
                                const metaProcessorIdentifier = metaProcessorTag.getAttribute('content');
                                const metaProcessor = eval(metaProcessorIdentifier);
                                docFrag = metaProcessor(docFrag);
                            }
                            shadowRoot.appendChild(docFrag.activeElement);
                        } else {
                            const parser = new DOMParser();
                            const docFrag = parser.parseFromString(txt, this._type);
                            
                            shadowRoot.innerHTML = txt;
                        }

                        this.copyTemplateElementInsideShadowRootToInnerHTML(shadowRoot, id, absUrl, url);
                        const subscribers = CarbonCopy._shadowDomSubscribers[absUrl];
                        if (subscribers) {
                            subscribers.forEach(subscriber => subscriber(shadowRoot));
                            delete CarbonCopy._shadowDomSubscribers[absUrl];
                        }
                    })
                })


            }
        }
        connectedCallback() {
            if (this._set) {
                const params = this._set.split(';');
                params.forEach(param => {
                    const nameValuePair = param.split(':');
                    const key = nameValuePair[0];
                    const val = nameValuePair[1];
                    this.addEventListener('c-c-get-' + key, e => {
                        e['detail'].value = val;
                        const attrib = this.getAttribute(key + '-props');
                        if (attrib) {
                            const props = attrib.split(';');
                            props.forEach(prop => {
                                const nvp2 = prop.split(':');
                                const propKey = nvp2[0];
                                const propVal = nvp2[1];
                                const tokens = propKey.split('.');
                                let targetProp = e.srcElement;
                                const len = tokens.length;
                                for (let i = 0; i < len - 1; i++) {
                                    targetProp = targetProp[tokens[i]];
                                }
                                const lastToken = tokens[len - 1];
                                switch (typeof (targetProp[lastToken])) {
                                    case 'string':
                                        targetProp[lastToken] = propVal;
                                        break;
                                    default:
                                        throw 'not implemented yet';
                                }

                            })
                        }
                        //
                    });

                });
            }
            if (this._get) {
                const newEvent = new CustomEvent('c-c-get-' + this._get, {
                    detail: {

                    },
                    bubbles: true,
                    composed: this._composed,
                } as CustomEventInit);
                this.dispatchEvent(newEvent);
                this.innerHTML = newEvent.detail.value;
            }
            this.loadHref();
        }
        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            switch (name) {
                case 'href':
                    this._href = newValue;
                    break;
                case 'event-name':
                    this._eventName = newValue;
                    break;
                case 'composed':
                    this._composed = newValue !== null;
                    break;
                case 'set':
                    this._set = newValue;
                    break;
                case 'get':
                    this._get = newValue;
                    break;
                case 'type':
                    this._type = newValue;
                    break;
            }




        }
    }

    class CC extends CarbonCopy { };



    customElements.define('carbon-copy', CarbonCopy);
    customElements.define('c-c', CC);
})();
