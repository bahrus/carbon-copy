
    //@ts-check
    (function () {
    const disabled = 'disabled';
function XtallatX(superClass) {
    return class extends superClass {
        static get observedAttributes() {
            return [disabled];
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        attr(name, val, trueVal) {
            if (val) {
                this.setAttribute(name, trueVal || val);
            }
            else {
                this.removeAttribute(name);
            }
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name, detail) {
            const newEvent = new CustomEvent(name + '-changed', {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            return newEvent;
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
    };
}
//# sourceMappingURL=xtal-latx.js.map
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
class CC extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._originalChildren = [];
    }
    static get is() { return 'c-c'; }
    static get observedAttributes() {
        return [copy, from, noshadow];
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
        this.childNodes.forEach(node => {
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
    defineProps(name, template, newClass, props) {
        props.forEach(prop => {
            Object.defineProperty(newClass.prototype, prop, {
                get: () => {
                    return this['_' + prop];
                },
                set: function (val) {
                    this.attr(prop, val);
                },
                enumerable: true,
                configurable: true,
            });
        });
        this.defineMethods(newClass, template);
        customElements.define(name, newClass);
    }
    defineMethods(newClass, template) {
        newClass.prototype.attributeChangedCallback = function (name, oldVal, newVal) {
            this['_' + name] = newVal;
            if (this.onPropsChange)
                this.onPropsChange(name, oldVal, newVal);
        };
        const prevSibling = template.previousElementSibling;
        if (!prevSibling || !prevSibling.dataset.methods)
            return;
        const evalScript = eval(prevSibling.innerHTML);
        for (const fn in evalScript) {
            newClass.prototype[fn] = evalScript[fn];
        }
    }
    createCE(template) {
        const ceName = this.getCEName(template.id);
        const propsAttrs = template.dataset.strProps;
        const parsedProps = propsAttrs ? propsAttrs.split(',') : [];
        if (this._noshadow) {
            class newClass extends XtallatX(HTMLElement) {
                connectedCallback() {
                    this._upgradeProperties(parsedProps);
                    this.appendChild(template.content.cloneNode(true));
                }
                static get observedAttributes() { return parsedProps; }
            }
            this.defineProps(ceName, template, newClass, parsedProps);
        }
        else {
            class newClass extends XtallatX(HTMLElement) {
                constructor() {
                    super();
                    this._upgradeProperties(parsedProps);
                    this.attachShadow({ mode: 'open' });
                    this.shadowRoot.appendChild(template.content.cloneNode(true));
                }
                static get observedAttributes() { return parsedProps; }
            }
            this.defineProps(ceName, template, newClass, parsedProps);
        }
    }
    getHost(el, level, maxLevel) {
        let parent = el;
        while (parent = parent.parentElement) {
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
                            template = host.querySelector('#' + fromName);
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
}
CC.registering = {};
if (!customElements.get(CC.is)) {
    customElements.define('c-c', CC);
}
//# sourceMappingURL=c-c.js.map
    })();  
        