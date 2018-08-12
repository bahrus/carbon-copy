
    //@ts-check
    (function () {
    const disabled = 'disabled';
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
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
        to$(number) {
            const mod = number % 2;
            return (number - mod) / 2 + '-' + mod;
        }
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name, detail) {
            const eventName = name + '-changed';
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
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
* `b-c-c`
* Dependency free web component that allows basic copying of templates.
*
*
* @customElement
* @polymer
* @demo demo/index.html
*/
class BCC extends XtallatX(HTMLElement) {
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
/**
* `c-c`
* Dependency free web component that allows copying templates.
*
*
* @customElement
* @polymer
* @demo demo/index.html
*/
class CC extends BCC {
    static get is() { return 'c-c'; }
    defineProps(name, template, newClass, props, isObj) {
        if (isObj) {
            props.forEach(prop => {
                Object.defineProperty(newClass.prototype, prop, {
                    get: function () {
                        return this['_' + prop];
                    },
                    set: function (val) {
                        this['_' + prop];
                        this.de(prop, {
                            value: val
                        });
                    },
                    enumerable: true,
                    configurable: true,
                });
            });
        }
        else {
            props.forEach(prop => {
                Object.defineProperty(newClass.prototype, prop, {
                    get: function () {
                        return this['_' + prop];
                    },
                    set: function (val) {
                        this.attr(prop, val);
                    },
                    enumerable: true,
                    configurable: true,
                });
            });
        }
    }
    defineMethods(newClass, template) {
        const prevSibling = template.previousElementSibling;
        if (!prevSibling || !prevSibling.dataset.methods)
            return;
        const evalScript = eval(prevSibling.innerHTML);
        for (const fn in evalScript) {
            newClass.prototype[fn] = evalScript[fn];
        }
    }
    addAttributeChangeCallback(newClass) {
        newClass.prototype.attributeChangedCallback = function (name, oldVal, newVal) {
            let val = newVal;
            let isObj = false;
            const objProps = this.constructor.objProps;
            if (objProps && objProps.indexOf(name) > -1) {
                val = JSON.parse(newVal);
                isObj = true;
            }
            this['_' + name] = val;
            this.de(name, {
                value: val
            });
            if (this.onPropsChange)
                this.onPropsChange(name, oldVal, val);
        };
    }
    createCE(template) {
        const ceName = this.getCEName(template.id);
        //if(customElements.get(ceName)) return;
        const ds = template.dataset;
        const strPropsAttr = ds.strProps;
        const parsedStrProps = strPropsAttr ? strPropsAttr.split(',') : [];
        const objPropsAttr = ds.objProps;
        const parsedObjProps = objPropsAttr ? objPropsAttr.split(',') : [];
        const allProps = parsedStrProps.concat(parsedObjProps);
        if (this._noshadow) {
            class newClass extends XtallatX(HTMLElement) {
                static getObjProps() {
                    return parsedObjProps;
                }
                connectedCallback() {
                    this._upgradeProperties(allProps);
                    this._connected = true;
                    this.appendChild(template.content.cloneNode(true));
                }
                static get observedAttributes() { return allProps; }
            }
            this.defineProps(ceName, template, newClass, parsedStrProps, false);
            this.defineProps(ceName, template, newClass, parsedObjProps, true);
            customElements.define(ceName, newClass);
        }
        else {
            class newClass extends XtallatX(HTMLElement) {
                static get objProps() {
                    return parsedObjProps;
                }
                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                    this.shadowRoot.appendChild(template.content.cloneNode(true));
                }
                connectedCallback() {
                    this._connected = true;
                    this._upgradeProperties(allProps);
                }
                static get observedAttributes() { return allProps; }
            }
            this.defineProps(ceName, template, newClass, parsedStrProps, false);
            this.defineProps(ceName, template, newClass, parsedObjProps, true);
            this.defineMethods(newClass, template);
            this.addAttributeChangeCallback(newClass);
            customElements.define(ceName, newClass);
        }
    }
}
if (!customElements.get(CC.is)) {
    customElements.define(CC.is, CC);
}
//# sourceMappingURL=c-c.js.map
    })();  
        