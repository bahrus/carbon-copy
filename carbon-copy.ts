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
                'stamp-href'
            ];
        }

        // connectedCallback() {
        //     this.loadHref();
        // }
        _eventName;
        //_bubbles;
        _composed;
        _href: string;
        _set;
        _get;
        _setProps;
        _getProps;
        //_type;
        _absUrl;
        _stampHref;
        _initialized;
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

        appendTemplateElementInsideShadowRootToInnerHTML(shadowDOM: ShadowRoot | Document, id: string, absUrl: string, url: string) {
            const templ = shadowDOM.getElementById(id) as HTMLTemplateElement;

            //     //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template

            const clone = document.importNode(templ.content, true) as HTMLDocument;
            if(this._stampHref){
                const initialChildren = this.querySelectorAll('[c-c-initial-child]');
                for(let i = 0, ii = initialChildren.length; i < ii; i++){
                    (<HTMLElement>initialChildren[i]).style.display = 'none';
                }
                for(let i = 0, ii = clone.children.length; i < ii; i++){
                    const child = clone.children[i];
                    child.setAttribute('c-c-href-stamp', this._href);
                }
            }
            this.appendChild(clone);
        }
        loadHref() {
            if(!this._initialized){
                if(this._stampHref){
                    const children = this.children;
                    for(let i = 0, ii = children.length - 1; i < ii; i++){
                        children[i].setAttribute('c-c-initial-child', 'true');
                    }
                }
                this._initialized = true;
            }
            //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
            if (!this._href) return;
            let needToProcessFurther = true;
            if(this._stampHref){
                //check for existing nodes, that match
                const existingNodes = this.querySelectorAll(':scope > [c-c-href-stamp]');
                for(let i = 0, ii = existingNodes.length; i < ii; i++){
                    const existingNode = existingNodes[i] as HTMLElement;
                    if(existingNode.getAttribute('c-c-href-stamp') === this._href){
                        needToProcessFurther = false;
                        existingNode.style.display = existingNode['c_c_originalStyle'];
                    }else{
                        
                        existingNode['c_c_originalStyle'] = existingNode.style.display;
                        existingNode.style.display = 'none';
                    }
                }
            }
            if(!needToProcessFurther) return;
            const splitHref = this._href.split('#');
            if (splitHref.length < 2) return;
            const url = splitHref[0];
            const id = splitHref[1];
            if (url.length === 0) {
                this.appendTemplateElementInsideShadowRootToInnerHTML(document, id, null, url);
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
            let shadowDOM = CarbonCopy._shadowDoms[absUrl];
            //let templ = 'hello' as any;//: HTMLTemplateElement;
            if (shadowDOM) {
                switch (typeof shadowDOM) {
                    case 'boolean':
                        const subscribers = CarbonCopy._shadowDomSubscribers;
                        const fn = (sr: ShadowRoot) => {
                            this.appendTemplateElementInsideShadowRootToInnerHTML(sr, id, absUrl, url);
                        }
                        if (!subscribers[absUrl]) {
                            subscribers[absUrl] = [fn];
                        } else {
                            subscribers[absUrl].push(fn);
                        }
                        break;
                    case 'object':
                        this.appendTemplateElementInsideShadowRootToInnerHTML(shadowDOM as ShadowRoot, id, absUrl, url);
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
                        const parser = new DOMParser();
                        let docFrag = parser.parseFromString(txt, 'text/html');
                        if (docFrag.head) {
                            const metaProcessors = docFrag.head.querySelectorAll('meta[name="preprocessor"]');
                            for (let i = 0, ii = metaProcessors.length; i < ii; i++) {
                                const metaProcessorTag = metaProcessors[i];
                                const metaProcessorIdentifier = metaProcessorTag.getAttribute('content');
                                //TODO:  validate identifier looks safe?
                                const metaProcessor = eval(metaProcessorIdentifier);
                                docFrag = metaProcessor(docFrag, this);
                            }
                        }

                        shadowRoot.appendChild(docFrag.body);


                        this.appendTemplateElementInsideShadowRootToInnerHTML(shadowRoot, id, absUrl, url);
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
            if(this._setProps){
                const params = this._setProps.split(';');
                params.forEach(param =>{
                    console.log('add listener for ' + 'c-c-get-props-' + param);
                    this.addEventListener('c-c-get-props-' + param, e => {
                        e['detail'].value = this[param];
                        this['_targetElement'] = e.srcElement.nextElementSibling;
                        this['_targetProp'] = param;
                        Object.defineProperty(this, param, {
                            enumerable: true,
                            configurable: true,
                            //writable: true,
                            set: function(newVal){
                                const test = this['_targetElement'] as HTMLElement;
                                const param = this['_targetProp'];
                                
                                debugger;
                                test[param] = newVal;
                                //debugger;
                            },
                        });
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
            if(this._getProps){
                const params = this._getProps.split(';');
                params.forEach(param =>{
                    const newEvent = new CustomEvent('c-c-get-props-' + param, {
                        detail: {
    
                        },
                        bubbles: true,
                        composed: this._composed,
                    } as CustomEventInit);
                    console.log("dispatching get props event: " + 'c-c-get-props-' + param);
                    this.dispatchEvent(newEvent);
                    this.nextSibling[param] = newEvent.detail.value;
                });
            }
            this.loadHref();
        }
        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            switch (name) {
                case 'href':
                    this._href = newValue;
                    if(this._initialized) this.loadHref();
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
                case 'set-props':
                    this._setProps = newValue;
                    break;
                case 'get-props':
                    this._getProps = newValue;
                    break;
                case 'stamp-href':
                    this._stampHref = (newValue !== undefined);
                    break;
                    
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

    class CC extends CarbonCopy { };



    customElements.define('carbon-copy', CarbonCopy);
    customElements.define('c-c', CC);
})();
