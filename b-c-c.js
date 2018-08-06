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
    constructor() {
        super(...arguments);
        this._originalChildren = [];
    }
    static get is() { return 'b-c-c'; }
    static get observedAttributes() {
        return [copy, from, noshadow];
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
    /**
     * Don't use shadow DOM
     */
    get noshadow() {
        return this._noshadow;
    }
    set noshadow(val) {
        this.attr(noshadow, val, '');
    }
    attributeChangedCallback(name, oldValue, newValue) {
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
    connectedCallback() {
        this._upgradeProperties([copy, from]);
        //this._originalChildren = this.childNodes;
        this.childNodes.forEach((node) => {
            this._originalChildren.push(node.cloneNode(true));
        });
        this.innerHTML = '';
        this._connected = true;
        this.onPropsChange();
    }
    getCEName(templateId) {
        if (templateId.indexOf('-') > -1)
            return templateId;
        return 'c-c-' + templateId.split('_').join('-');
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
    onPropsChange() {
        if (!this._from || !this._connected || this.disabled)
            return;
        //this._alreadyRegistered = true;
        const fromTokens = this._from.split('/');
        const fromName = fromTokens[0] || fromTokens[1];
        const newCEName = this.getCEName(fromName);
        const prevId = this._prevId;
        this._prevId = newCEName;
        if (!customElements.get(newCEName)) {
            if (!BCC.registering[newCEName]) {
                BCC.registering[newCEName] = true;
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
                if (template.hasAttribute('data-src') && !template.hasAttribute('loaded')) {
                    const config = {
                        attributeFilter: ['loaded'],
                        attributes: true,
                    };
                    const mutationObserver = new MutationObserver((mr) => {
                        this.createCE(template);
                        mutationObserver.disconnect();
                    });
                    mutationObserver.observe(template, config);
                }
                else {
                    this.createCE(template);
                }
            }
        }
        if (!this._copy)
            return;
        customElements.whenDefined(newCEName).then(() => {
            //const name = newCEName;
            if (prevId) {
                const prevEl = this.querySelector(prevId);
                if (prevEl)
                    prevEl.style.display = 'none';
            }
            const prevEl = this.querySelector(newCEName);
            if (prevEl) {
                prevEl.style.display = 'block';
            }
            else {
                const ce = document.createElement(newCEName);
                this._originalChildren.forEach(child => {
                    ce.appendChild(child.cloneNode(true));
                });
                // while (this.childNodes.length > 0) {
                //     ce.appendChild(this.childNodes[0]);
                // }
                this.appendChild(ce);
            }
        });
    }
    createCE(template) {
        const ceName = this.getCEName(template.id);
        if (this._noshadow) {
            class newClass extends HTMLElement {
                connectedCallback() {
                    this.appendChild(template.content.cloneNode(true));
                }
            }
            customElements.define(ceName, newClass);
        }
        else {
            class newClass extends HTMLElement {
                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
                }
            }
            customElements.define(ceName, newClass);
        }
    }
}
BCC.registering = {};
if (!customElements.get(BCC.is)) {
    customElements.define(BCC.is, BCC);
}
//# sourceMappingURL=b-c-c.js.map