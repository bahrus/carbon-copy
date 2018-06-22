
//@ts-check
(function () {
const from = 'from';
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
class CC extends HTMLElement {
    constructor() {
        super(...arguments);
        this._originalChildren = [];
    }
    static get is() { return 'c-c'; }
    static get observedAttributes() {
        return [copy, from, noshadow];
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
    get from() {
        return this._from;
    }
    set from(val) {
        this.setAttribute(from, val);
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
            case from:
                this._prevId = oldValue;
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
    getHost(el, level, maxLevel) {
        let parent;
        do {
            parent = el.parentNode;
            if (parent.nodeType === 11) {
                const newLevel = level + 1;
                if (newLevel === maxLevel)
                    return parent['host'];
                return this.getHost(parent['host'], newLevel, maxLevel);
            }
            else if (parent.tagName === 'BODY') {
                return parent;
            }
        } while (parent);
    }
    onPropsChange() {
        if (!this._copy || !this._from || !this._connected)
            return;
        //this._alreadyRegistered = true;
        const fromTokens = this._from.split('/');
        const fromName = fromTokens[0] || fromTokens[1];
        const newCEName = this.getCEName(fromName);
        if (!customElements.get(newCEName)) {
            if (!CC.registering[newCEName]) {
                CC.registering[newCEName] = true;
                let template;
                if (!fromTokens[0]) {
                    template = self[fromName];
                }
                else {
                    //const path = this._from.split('/');
                    //const id = path[path.length - 1];
                    const host = this.getHost(this, 0, fromTokens.length);
                    if (host) {
                        if (host.shadowRoot) {
                            template = host.shadowRoot.getElementById(fromName);
                            if (!template)
                                template = host.getElementById(fromName);
                        }
                        else {
                            template = host.getElementById(fromName);
                        }
                    }
                }
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
})();  
    