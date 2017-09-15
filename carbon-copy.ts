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
                'bubbles',
                /**
                 * @type {boolean} indicates whether dispatching should extend beyond shadow dom
                 */
                'composed'
            ];
        }

        connectedCallback() {
            this.loadHref();
        }
        _eventName;
        _bubbles;
        _composed;
        _href;
        static _shadowDoms: { [key: string]: ShadowRoot } = {};
        //from https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
        absolute(base, relative) {
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

        getElementInsideShadowRoot(shadowDOM: ShadowRoot, id: string, absUrl: string, url: string) {
            const templ =  shadowDOM.getElementById(id) as HTMLTemplateElement;

        //     //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template

            const clone = document.importNode(templ.content, true) as HTMLDocument;
            //const dispatchTypeArg = this.getAttribute('dispatch-type-arg');
            if (this._eventName) {
                const newEvent = new CustomEvent(this._eventName, {
                    detail: {
                        clone: clone,
                        absUrl: absUrl,
                        url: url,
                        linkLoadEvent: event,
                    },
                    bubbles: this._bubbles,
                    composed: this._composed,
                } as CustomEventInit);
                this.dispatchEvent(newEvent);
            }
            this.appendChild(clone);
        }
        loadHref() {
            //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
            // const tmpl = document.querySelector(newValue);
            // const clone = document.importNode(tmpl.content, true);
            // this.parentElement.insertAdjacentElement('afterend', clone);
            const splitHref = this._href.split('#');
            const url = splitHref[0];
            const absUrl = this.absolute(location.href, url); //TODO:  baseHref
            const id = splitHref[1];
            const _this = this;
            let shadowDOM = CarbonCopy._shadowDoms[absUrl];
            let templ = 'hello' as any;//: HTMLTemplateElement;
            if (shadowDOM) {
                this.getElementInsideShadowRoot(shadowDOM, id, absUrl, url);
                // if(shadowDOM['finishedLoading']){
                //      //this.getContentFromIFrame(shadowDOM, id, absUrl, url);
                // }else{
                //     if(!shadowDOM['waitingForLoading']) shadowDOM['waitingForLoading'] = [];
                //     shadowDOM['waitingForLoading'].push({customEl: this, id: id, absUrl: absUrl, url: url});
                // }
                
            } else {
                fetch(absUrl).then(resp =>{
                    resp.text().then(txt =>{
                       const container = document.createElement('div');
                       container.style.display = 'none';
                       document.body.appendChild(container);
                       const shadowRoot = container.attachShadow({mode: 'open'});
                       CarbonCopy._shadowDoms[absUrl]  = shadowRoot;
                       shadowRoot.innerHTML = txt; 
                       this.getElementInsideShadowRoot(shadowRoot, id, absUrl, url);
                    })
                })
                
                // const _this = this;
                // shadowDOM.onload = () => {
                //     templ = _this.getContentFromIFrame(shadowDOM, id, absUrl, url);
                //     shadowDOM['finishedLoading'] = true;
                //     if(shadowDOM['waitingForLoading']){
                //         shadowDOM['waitingForLoading'].forEach(pending =>{
                //             pending.customEl.getContentFromIFrame(shadowDOM, pending.id, pending.absUrl, pending.url);
                //         })
                //         delete shadowDOM['waitingForLoading'];
                //     }
                // }
            }
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case 'href':
                    this._href = newValue;


                    break;
                case 'event-name':
                    this._eventName = newValue;
                    break;
                case 'bubbles':
                    this._bubbles = newValue !== null;
                    break;
                case 'composed':
                    this._composed = newValue !== null;
                    break;


            }




        }
    }





    customElements.define('carbon-copy', CarbonCopy);

})();
