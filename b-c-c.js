import { XtallatX } from 'xtal-element/xtal-latx.js';
import { define } from 'trans-render/define.js';
import { hydrate } from 'trans-render/hydrate.js';
const from = 'from';
const copy = 'copy';
const noshadow = 'noshadow';
const noclear = 'noclear';
/**
* Web component that allows basic copying of templates inside Shadow DOM (by default).
* @element b-c-c
*
*/
export class BCC extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._noclear = false;
        this._origC = []; //original Children
        /**
         * original style
         */
        this._origS = '';
    }
    static get is() { return 'b-c-c'; }
    static get observedAttributes() {
        return [copy, from, noshadow, noclear];
    }
    get noclear() {
        return this._noclear;
    }
    /**
     * Don't clear previous contents with each copy
     * @attr
     */
    set noclear(nv) {
        this._noclear = true;
    }
    get noshadow() {
        return this._noshadow;
    }
    /**
    * Don't use shadow DOM
    * @attr
    */
    set noshadow(val) {
        this.attr(noshadow, val, '');
    }
    get from() {
        return this._from;
    }
    /**
     * Id of template to import.
     * If from has no slash, the search for the matching template is done within the shadow DOM of the c-c element.
     * If from starts with "../" then the search is done one level up, etc.
     * @attr
     */
    set from(val) {
        this.attr(from, val);
    }
    get copy() {
        return this._copy;
    }
    /**
     * Must be true / present for template copy to proceed.
     * @type{boolean}
     * @attr
     */
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
                this.toggleFrom(oldValue, newValue);
                break;
            case noclear:
            case noshadow:
                this['_' + name] = newValue !== null;
                break;
        }
        this.onPropsChange();
    }
    connectedCallback() {
        this.propUp([copy, from, noshadow]);
        //this._originalChildren = this.childNodes;
        this._connected = true;
        this.onPropsChange();
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
    removeAll(root) {
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
    toggleFrom(oldVal, newVal) {
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
    onPropsChange() {
        if (!this._from || !this._connected || this.disabled || !this._copy)
            return;
        const template = this.getSrcTempl();
        const clone = template.content.cloneNode(true);
        if (this._noshadow) {
            if (this._noclear === false) {
                this.removeAll(this);
            }
            this.appendChild(clone);
        }
        else {
            if (this._noclear === false) {
                if (!this.removeAll(this.shadowRoot))
                    this.attachShadow({ mode: 'open' });
            }
            this.shadowRoot.appendChild(clone);
        }
    }
}
define(BCC);
