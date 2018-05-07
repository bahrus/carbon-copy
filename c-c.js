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
    get host() {
        return this._host;
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
                this._templateId = newValue;
                break;
        }
        this.onPropsChange();
    }
    getHost(el) {
        const parent = el.parentNode;
        if (parent.nodeType === 11 || parent.tagName === 'C-C') {
            this._host = parent['host'];
            return;
        }
        if (parent.shadowRoot) {
            this._host = parent;
            return;
        }
        if (parent.tagName === 'HTML') {
            this._host = parent;
            return;
        }
        this.getHost(parent);
    }
    connectedCallback() {
        this.getHost(this);
        this.onPropsChange();
    }
    onPropsChange() {
        if (!this._host || !this._copy || !this._templateId)
            return;
        const template = this._host.querySelector('#' + this._templateId);
        if (template.dataset.src && !template.getAttribute('loaded')) {
            throw "not supported yet";
        }
        const clone = template.content.cloneNode(true);
        this.appendChild(clone);
    }
}
if (!customElements.get(CC.is)) {
    customElements.define('c-c', CC);
}
//# sourceMappingURL=c-c.js.map