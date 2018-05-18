const template_id = 'template-id';
const copy = 'copy';
// const hasSlots = 'has-slots';
// export function qsa(css, from?: HTMLElement | Document | DocumentFragment) : HTMLElement[]{
//     return  [].slice.call((from ? from : this).querySelectorAll(css));
// }
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
                this._templateId = newValue;
                break;
            // case hasSlots:
            //     this._hasSlots = newValue !== null;
            //     break;
        }
        this.onPropsChange();
    }
    // getHost(el: HTMLElement){
    //     if(this._host) return this._host;
    //     const parent = el.parentNode as HTMLElement;
    //     if(parent.nodeType === 11 || parent.tagName === 'C-C'){
    //         const host = parent['host'];
    //         if(host){
    //             this._host = host;
    //         }else{
    //             this._host = parent
    //         }
    //         return this._host;
    //     }
    //     if(parent.shadowRoot){
    //         this._host = parent;
    //         return this._host;
    //     }
    //     if(parent.tagName === 'HTML'){
    //         this._host = parent;
    //         return this._host;
    //     }
    //     return this.getHost(parent);
    // }
    connectedCallback() {
        this._upgradeProperties([copy, 'templateId']);
        //this.getHost(this);
        this.onPropsChange();
    }
    get ceName() {
        if (!this._ceName) {
            this._ceName = 'c-c-' + this._templateId.split('_').join('-');
        }
        return this._ceName;
    }
    createCE(template) {
        customElements.define(this.ceName, class extends HTMLElement {
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
        if (!customElements.get(this.ceName)) {
            if (!CC.registering[this.ceName]) {
                CC.registering[this.ceName] = true;
                let template = self[this._templateId];
                // if(!template){
                //     const host = this.getHost(this);
                //     if(!host){
                //         debugger;
                //     }
                //     template = host.querySelector('#' + this._templateId);
                // }
                if (template.dataset.src && !template.getAttribute('loaded')) {
                    throw "not supported yet";
                }
                this.createCE(template);
            }
        }
        customElements.whenDefined(this.ceName).then(() => {
            const ce = document.createElement(this.ceName);
            while (this.childNodes.length > 0) {
                ce.appendChild(this.childNodes[0]);
            }
            this.appendChild(ce);
        });
    }
}
CC.registering = {};
if (!customElements.get(CC.is)) {
    customElements.define('c-c', CC);
}
//# sourceMappingURL=c-c.js.map