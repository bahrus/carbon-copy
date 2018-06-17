const template_id = 'template-id';
const copy = 'copy';
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
        this._alreadyRegistered = false;
    }
    static get is() { return 'c-c'; }
    static get observedAttributes() {
        return [copy, template_id];
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
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case copy:
                this._copy = newValue !== null;
                break;
            case template_id:
                this._prevId = oldValue;
                this._templateId = newValue;
                break;
        }
        this.onPropsChange();
    }
    connectedCallback() {
        this._upgradeProperties([copy, 'templateId']);
        this.onPropsChange();
    }
    //_ceName:string;
    getCEName(templateId) {
        return 'c-c-' + templateId.split('_').join('-');
    }
    createCE(template) {
        customElements.define(this.getCEName(template.id), class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
            }
        });
    }
    onPropsChange() {
        if (!this._copy || !this._templateId || this._alreadyRegistered)
            return;
        this._alreadyRegistered = true;
        const newCEName = this.getCEName(this._templateId);
        if (!customElements.get(newCEName)) {
            if (!CC.registering[newCEName]) {
                CC.registering[newCEName] = true;
                let template = self[this._templateId];
                if (template.dataset.src && !template.getAttribute('loaded')) {
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
            else {
                const prevEl = this.querySelector(newCEName);
                if (prevEl) {
                    prevEl.style.display = 'block';
                }
                else {
                    const ce = document.createElement(newCEName);
                    while (this.childNodes.length > 0) {
                        ce.appendChild(this.childNodes[0]);
                    }
                    this.appendChild(ce);
                }
            }
        });
    }
}
CC.registering = {};
if (!customElements.get(CC.is)) {
    customElements.define('c-c', CC);
}
//# sourceMappingURL=c-c.js.map