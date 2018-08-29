
    //@ts-check
    (function () {
    function define(custEl) {
    let tagName = custEl.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
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
            const setOrRemove = val ? 'set' : 'remove';
            this[setOrRemove + 'Attribute'](name, trueVal || val);
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
     * Don't use shadow DOM
     */
    get noshadow() {
        return this._noshadow;
    }
    set noshadow(val) {
        this.attr(noshadow, val, '');
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
        this.opc();
    }
    connectedCallback() {
        this._upgradeProperties([copy, from, noshadow]);
        //this._originalChildren = this.childNodes;
        this._connected = true;
        this.opc();
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
    //_prevId!: string;
    opc() {
        if (!this._from || !this._connected || this.disabled || !this._copy)
            return;
        const template = this.getSrcTempl();
        const clone = template.content.cloneNode(true);
        if (this._noshadow) {
            this.appendChild(clone);
        }
        else {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(clone);
        }
    }
}
define(BCC);
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
    getCEName(templateId) {
        if (templateId.indexOf('-') > -1)
            return templateId;
        return 'c-c-' + templateId.split('_').join('-');
    }
    connectedCallback() {
        this.childNodes.forEach((node) => {
            this._originalChildren.push(node.cloneNode(true));
        });
        this.innerHTML = '';
        super.connectedCallback();
    }
    dP(name, template, newClass, props, isObj) {
        if (isObj) {
            props.forEach(prop => {
                Object.defineProperty(newClass.prototype, prop, {
                    get: function () {
                        return this['_' + prop];
                    },
                    set: function (val) {
                        this['_' + prop] = val;
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
    dM(newClass, template) {
        const prevSibling = template.previousElementSibling;
        if (!prevSibling || !prevSibling.dataset.methods)
            return;
        const evalScript = eval(prevSibling.innerHTML);
        for (const fn in evalScript) {
            newClass.prototype[fn] = evalScript[fn];
        }
    }
    aacc(newClass) {
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
    gn() {
        const fromTokens = this._from.split('/');
        const fromName = fromTokens[0] || fromTokens[1];
        return this.getCEName(fromName);
    }
    sac() {
        const t = this;
        const activeCEName = this.gn();
        for (let i = 0, ii = t.children.length; i < ii; i++) {
            const child = t.children[i];
            const style = child.style;
            if (child.localName === activeCEName) {
                style.display = child.cc_orgD || 'block';
            }
            else if (style.display !== 'none') {
                if (!child.cc_orgD)
                    child.cc_orgD = child.style.display;
                child.style.display = 'none';
            }
        }
    }
    opc() {
        if (!this._from || !this._connected || this.disabled)
            return;
        const newCEName = this.gn();
        if (!customElements.get(newCEName)) {
            if (!CC.registering[newCEName]) {
                CC.registering[newCEName] = true;
                const template = this.getSrcTempl();
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
            const newEl = this.querySelector(newCEName);
            if (!newEl) {
                const ce = document.createElement(newCEName);
                this._originalChildren.forEach(child => {
                    ce.appendChild(child.cloneNode(true));
                });
                this.appendChild(ce);
            }
            this.sac();
        });
    }
    createCE(template) {
        const ceName = this.getCEName(template.id);
        const ds = template.dataset;
        const strPropsAttr = ds.strProps;
        const parsedStrProps = strPropsAttr ? strPropsAttr.split(',') : [];
        const objPropsAttr = ds.objProps;
        const parsedObjProps = objPropsAttr ? objPropsAttr.split(',') : [];
        const allProps = parsedStrProps.concat(parsedObjProps);
        if (this._noshadow) {
            class newClass extends XtallatX(HTMLElement) {
                static get is() { return ceName; }
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
            this.dP(ceName, template, newClass, parsedStrProps, false);
            this.dP(ceName, template, newClass, parsedObjProps, true);
            define(newClass);
        }
        else {
            class newClass extends XtallatX(HTMLElement) {
                static get is() { return ceName; }
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
            this.dP(ceName, template, newClass, parsedStrProps, false);
            this.dP(ceName, template, newClass, parsedObjProps, true);
            this.dM(newClass, template);
            this.aacc(newClass);
            define(newClass);
        }
    }
}
CC.registering = {};
define(CC);
    })();  
        