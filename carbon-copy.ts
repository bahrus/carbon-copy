declare var HTMLImports;

(function () {
    const p = 'c-c-';
    const cg = p + 'get-';
    const cgp = cg + 'props-';
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
                /**
                 * @type {string} Retrieve this semicolon delimited list of properties
                 */
                'get-props',
                /**
                 * @type {string} Listen for queries regarding these properties (semicolon delimited)
                 */
                'set-props',
                /**
                 * @type {boolean} Persist previous templates when the href changes
                 */
                sh
            ];
        }

        // connectedCallback() {
        //     this.loadHref();
        // }
        _event_name;
        //_bubbles;
        _composed;
        _href: string;
        _set;
        _get;
        _set_props;
        _get_props;
        //_type;
        _absUrl;
        _stamp_href;
        _initialized;
        static _shadowDoms: { [key: string]: boolean | ShadowRoot } = {};
        static _shadowDomSubscribers: { [key: string]: [(sr: ShadowRoot) => void] } = {};
        pcs :{[key: string] : HTMLElement[]};// prop change subscribers
        //from https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
        absolute(base: string, relative: string): string {
            var stack = base.split("/"),
                parts = relative.split("/");
            stack.pop(); // remove current file name (or empty string)
            // (omit if "base" is the current folder without trailing slash)
            parts.forEach(part =>{
                switch(part){
                    case '.':
                        return;
                    case '..':
                        stack.pop();
                        break;
                    default:
                        stack.push(part);
                }
            })
            return stack.join("/");
        }
        // getContentFromIFrame(iframe: HTMLIFrameElement, id: string, absUrl: string, url: string) {



        // }

        append(shadowDOM: ShadowRoot | Document, id: string, absUrl: string, url: string) {
            const templ = shadowDOM.getElementById(id) as HTMLTemplateElement;

            //     //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template

            const clone = document.importNode(templ.content, true) as HTMLDocument;
            if(this._stamp_href){
                this.qsa('[' + ic + ']').forEach(initialChild => {
                    initialChild.style.display = 'none' 
                });
                const children = clone.children;
                for(let i = 0, ii = children.length; i < ii; i++){
                    const child = children[i];
                    child.setAttribute(hs, this._href);
                }
            }
            this.appendChild(clone);
        }
        qsa(css, from?: HTMLElement | Document) : HTMLElement[]{
            return  [].slice.call((from ? from : this).querySelectorAll(css));
        }
        loadHref() {
            this._initialized = true;
            //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
            if (!this._href) return;
            let needToProcessFurther = true;
            //console.log('stamphref = ' + this._stamp_href);
            if(this._stamp_href){
                //check for existing nodes, that don't match url, and  hide them
                this.qsa(':scope > [' + hs + ']').forEach(existingNode =>{
                    if(existingNode.getAttribute(hs) === this._href){
                        needToProcessFurther = false;
                        existingNode.style.display = existingNode[os];
                    }else{
                        existingNode[os] = existingNode.style.display;
                        existingNode.style.display = 'none';
                    }
                });

            }
            if(!needToProcessFurther) return;
            const splitHref = this._href.split('#');
            if (splitHref.length < 2) return;
            const url = splitHref[0];
            const id = splitHref[1];
            if (url.length === 0) {
                this.append(document, id, null, url);
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
                        const subscribers = CC._shadowDomSubscribers;
                        const fn = (sr: ShadowRoot) => {
                            this.append(sr, id, absUrl, url);
                        }
                        if (!subscribers[absUrl]) {
                            subscribers[absUrl] = [fn];
                        } else {
                            subscribers[absUrl].push(fn);
                        }
                        break;
                    case 'object':
                        this.append(shadowDOM as ShadowRoot, id, absUrl, url);
                        break;
                }

            } else {
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
                            this.qsa('meta[name="preprocessor"]', docFrag).forEach(metaProcessorTag =>{
                                const metaProcessorIdentifier = metaProcessorTag.getAttribute('content');
                                //TODO:  validate identifier looks safe?
                                const metaProcessor = eval(metaProcessorIdentifier);
                                docFrag = metaProcessor(docFrag, this);
                            })
                        }

                        shadowRoot.appendChild(docFrag.body);


                        this.append(shadowRoot, id, absUrl, url);
                        const subscribers = CC._shadowDomSubscribers[absUrl];
                        if (subscribers) {
                            subscribers.forEach(subscriber => subscriber(shadowRoot));
                            delete CC._shadowDomSubscribers[absUrl];
                        }
                    })
                })


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
            if(this._set_props){
                const params = this._set_props.split(';');
                params.forEach(param =>{
                    this.addEventListener(cgp + param, e => {
                        
                        //e['detail'].value = this[param];
                        const nextSibling = e.srcElement.nextElementSibling as HTMLElement;
                        nextSibling[param] = this[param];
                        if(!this.pcs) this.pcs = {};
                        if(!this.pcs[param]) this.pcs[param] = [];
                        this.pcs[param].push(nextSibling);
                        const setter = function(newVal){
                            this.pcs[param].forEach(el => el[param] = newVal);
                            //nextSibling[param] = newVal;
                        }
                        Object.defineProperty(this, param, {
                            enumerable: true,
                            configurable: true,
                            set: setter
                        });
                    });
                });
            }
            if (this._get) {
                const newEvent = new CustomEvent(cg + this._get, {
                    detail: {

                    },
                    bubbles: true,
                    composed: this._composed,
                } as CustomEventInit);
                this.dispatchEvent(newEvent);
                this.innerHTML = newEvent.detail.value;
            }
            if(this._get_props){
                const params = this._get_props.split(';');
                params.forEach(param =>{
                    const newEvent = new CustomEvent(cgp + param, {
                        // detail: {
    
                        // },
                        bubbles: true,
                        composed: this._composed,
                    } as CustomEventInit);
                    this.dispatchEvent(newEvent);
                });
            }
            this.loadHref();
        }
        connectedCallback(){
            //https://github.com/w3c/webcomponents/issues/551
            setTimeout(() =>{
                //hack?
                this.c2();
            }, 1);
        }
        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            switch (name) {
                case 'href':
                    this._href = newValue;
                    if(this._initialized) this.loadHref();
                    break;
                case sh:
                    this._stamp_href = (newValue !== undefined);
                    break;

                case 'composed':
                    this._composed = newValue !== null;
                    break;
                default:
                    this['_' + name.replace('-', '_')] = newValue;

                    
            }




        }

        set href(val: string){
            this.setAttribute('href', val);
            //this._href = val;
            //this.loadHref();
        }
        get href(){
            return this._href;
        }
    }

    class CarbonCopy extends CC { };

    customElements.define('c-c', CC);
    customElements.define('carbon-copy', CarbonCopy);
    
})();
