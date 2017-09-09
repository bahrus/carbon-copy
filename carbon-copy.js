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
        connectedCallback() {
            this.loadHref();
        }
        //from https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
        absolute(base, relative) {
            var stack = base.split("/"), parts = relative.split("/");
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
        getContentFromIFrame(iframe, id, absUrl, url) {
            const cw = iframe.contentWindow;
            const templ = cw.document.getElementById(id);
            //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
            const clone = document.importNode(templ.content, true);
            //const dispatchTypeArg = this.getAttribute('dispatch-type-arg');
            if (this._dispatchTypeArg) {
                const newEvent = new CustomEvent(this._dispatchTypeArg, {
                    detail: {
                        clone: clone,
                        absUrl: absUrl,
                        url: url,
                        linkLoadEvent: event,
                    },
                    bubbles: this._bubbles,
                    composed: this._composed,
                });
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
            let iframe = CarbonCopy._iFrames[absUrl];
            let templ = 'hello'; //: HTMLTemplateElement;
            if (iframe) {
                templ = this.getContentFromIFrame(iframe, id, absUrl, url);
            }
            else {
                iframe = document.createElement('iframe'); //resolve relative path for caching
                iframe.src = splitHref[0];
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                const _this = this;
                iframe.onload = () => {
                    templ = _this.getContentFromIFrame(iframe, id, absUrl, url);
                    CarbonCopy._iFrames[absUrl] = iframe; //TODO:  concurrent?
                };
            }
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case 'href':
                    this._href = newValue;
                    break;
                case 'dispatch-type-arg':
                    this._dispatchTypeArg = newValue;
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
    CarbonCopy._iFrames = {};
    customElements.define('carbon-copy', CarbonCopy);
})();
//# sourceMappingURL=carbon-copy.js.map