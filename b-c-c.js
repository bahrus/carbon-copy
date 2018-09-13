import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { define } from 'xtal-latx/define.js';
const from = 'from';
const copy = 'copy';
const noshadow = 'noshadow';
/**
* `b-c-c`
* Dependency free web component that allows basic copying of templates.
*
*
* @customElement
* @polymer
* @demo demo/index.html
*/
export class BCC extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._originalChildren = [];
        /**
         * original style
         */
        this._origS = '';
    }
    static get is() { return 'b-c-c'; }
    static get observedAttributes() {
        return [copy, from, noshadow];
    }
    /**
     * Don't use shadow DOM
     */
    get noshadow() {
        return this._noshadow;
    }
    set noshadow(val) {
        this.attr(noshadow, val, '');
    }
    /**
     * Id of template to import.
     * If from has no slash, the search for the matching template is done within the shadow DOM of the c-c element.
     * If from starts with "../" then the search is done one level up, etc.
     */
    get from() {
        return this._from;
    }
    set from(val) {
        this.attr(from, val);
    }
    /**
     * @type{boolean}
     * Must be true / present for template copy to proceed.
     */
    get copy() {
        return this._copy;
    }
    set copy(val) {
        this.attr(copy, val, '');
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case copy:
                this._copy = newValue !== null;
                break;
            case from:
                //this._prevId = oldValue;
                this._from = newValue;
                this.tFrom(oldValue, newValue);
                break;
            case noshadow:
                this._noshadow = newValue !== null;
                break;
        }
        this.opc();
    }
    connectedCallback() {
        this._upgradeProperties([copy, from, noshadow]);
        //this._originalChildren = this.childNodes;
        this._connected = true;
        this.opc();
    }
    getHost(el, level, maxLevel) {
        let parent = el;
        while (parent = (parent.parentNode)) {
            if (parent.nodeType === 11) {
                const newLevel = level + 1;
                if (newLevel === maxLevel)
                    return parent['host'];
                return this.getHost(parent['host'], newLevel, maxLevel);
            }
            else if (parent.tagName === 'HTML') {
                return parent;
            }
        }
        return null;
    }
    getSrcTempl() {
        const fromTokens = this._from.split('/');
        const fromName = fromTokens[0] || fromTokens[1];
        let template = null;
        if (!fromTokens[0]) {
            template = self[fromName];
        }
        else {
            //const path = this._from.split('/');
            //const id = path[path.length - 1];
            const host = this.getHost(this, 0, fromTokens.length);
            if (host) {
                const cssSelector = '#' + fromName;
                if (host.shadowRoot) {
                    template = host.shadowRoot.querySelector(cssSelector);
                }
                if (!template)
                    template = host.querySelector(cssSelector);
            }
        }
        if (!template)
            throw '404: ' + fromName;
        return template;
    }
    //_prevId!: string;
    remAll(root) {
        if (root === null)
            return false;
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
        return true;
    }
    /**
     * toggle From
     * @param oldVal
     * @param newVal
     */
    tFrom(oldVal, newVal) {
        if (oldVal) {
            if (!newVal) {
                this._origS = this.style.display;
                this.style.display = 'none';
            }
        }
        else if (newVal && (this.style.display === 'none')) {
            this.style.display = this._origS;
        }
    }
    opc() {
        if (!this._from || !this._connected || this.disabled || !this._copy)
            return;
        const template = this.getSrcTempl();
        const clone = template.content.cloneNode(true);
        if (this._noshadow) {
            this.remAll(this);
            this.appendChild(clone);
        }
        else {
            if (!this.remAll(this.shadowRoot))
                this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(clone);
        }
    }
}
define(BCC);
//# sourceMappingURL=b-c-c.js.map