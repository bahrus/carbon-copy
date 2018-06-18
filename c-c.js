const template_id = 'template-id';
const copy = 'copy';
const noshadow = 'noshadow';
/**
* `carbon-copy`
* Dependency free web component that allows copying templates.
*
*
* @customElement
* @polymer
* @demo demo/index.html
*/
export class CC extends HTMLElement {
    constructor() {
        super(...arguments);
        this._originalChildren = [];
    }
    static get is() { return 'c-c'; }
    static get observedAttributes() {
        return [copy, template_id, noshadow];
    }
    _upgradeProperties(props) {
        props.forEach(prop => {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        });
    }
    get copy() {
        return this._copy;
    }
    set copy(val) {
        if (val) {
            this.setAttribute(copy, '');
        }
        else {
            this.removeAttribute(copy);
        }
    }
    get templateId() {
        return this._templateId;
    }
    set templateId(val) {
        this.setAttribute(template_id, val);
    }
    get noshadow() {
        return this._noshadow;
    }
    set noshadow(val) {
        if (val) {
            this.setAttribute(noshadow, '');
        }
        else {
            this.removeAttribute(noshadow);
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case copy:
                this._copy = newValue !== null;
                break;
            case template_id:
                this._prevId = oldValue;
                this._templateId = newValue;
                break;
            case noshadow:
                this._noshadow = newValue !== null;
                break;
        }
        this.onPropsChange();
    }
    connectedCallback() {
        this._upgradeProperties([copy, 'templateId']);
        //this._originalChildren = this.childNodes;
        this.childNodes.forEach(node => {
            this._originalChildren.push(node.cloneNode(true));
        });
        this.innerHTML = '';
        this._connected = true;
        this.onPropsChange();
    }
    //_ceName:string;
    getCEName(templateId) {
        return 'c-c-' + templateId.split('_').join('-');
    }
    createCE(template) {
        if (this._noshadow) {
            customElements.define(this.getCEName(template.id), class extends HTMLElement {
                connectedCallback() {
                    this.appendChild(template.content.cloneNode(true));
                }
            });
        }
        else {
            customElements.define(this.getCEName(template.id), class extends HTMLElement {
                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                    this.shadowRoot.appendChild(template.content.cloneNode(true));
                }
            });
        }
    }
    //_alreadyRegistered = false;
    onPropsChange() {
        if (!this._copy || !this._templateId || !this._connected)
            return;
        //this._alreadyRegistered = true;
        const newCEName = this.getCEName(this._templateId);
        if (!customElements.get(newCEName)) {
            if (!CC.registering[newCEName]) {
                CC.registering[newCEName] = true;
                let template = self[this._templateId];
                if (template.dataset.src && !template.hasAttribute('loaded')) {
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
        customElements.whenDefined(newCEName).then(() => {
            //const name = newCEName;
            if (this._prevId) {
                const prevEl = this.querySelector(this.getCEName(this._prevId));
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
}
CC.registering = {};
if (!customElements.get(CC.is)) {
    customElements.define('c-c', CC);
}
//# sourceMappingURL=c-c.js.map