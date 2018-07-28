import { XtallatX } from 'xtal-latx/xtal-latx.js';

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
    static get is() { return 'b-c-c'; }
    static get observedAttributes() {
        return [copy, from, noshadow];
    }

    _from: string;

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
    _copy: boolean;
    /**
     * @type{boolean}
     * Must be true / present for template copy to proceed.
     */
    get copy() {
        return this._copy;
    }
    set copy(val: boolean) {
        this.attr(copy, val, '');
    }
    _noshadow: boolean;
    /**
     * Don't use shadow DOM 
     */
    get noshadow() {
        return this._noshadow;
    }
    set noshadow(val) {
        this.attr(noshadow, val, '');
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case copy:
                this._copy = newValue !== null;
                break;
            case from:
                //this._prevId = oldValue;
                this._from = newValue;
                break;
            case noshadow:
                this._noshadow = newValue !== null;
                break;
        }
        this.onPropsChange();
    }

    _connected: boolean;

    connectedCallback() {
        this._upgradeProperties([copy, from]);
        //this._originalChildren = this.childNodes;
        this.childNodes.forEach(node => {
            this._originalChildren.push(node.cloneNode(true));
        })
        this.innerHTML = '';
        this._connected = true;
        this.onPropsChange();
    }
}
if (!customElements.get(BCC.is)) {
    customElements.define(BCC.is, BCC);
}