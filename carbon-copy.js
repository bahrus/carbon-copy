
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
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        /**
         * Any component that emits events should not do so ef it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in sure ensure it doesn't call "de" if this property is set to true.
         */
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        /**
         * Set attribute value.
         * @param name
         * @param val
         * @param trueVal String to set attribute if true.
         */
        attr(name, val, trueVal) {
            const v = val ? 'set' : 'remove'; //verb
            this[v + 'Attribute'](name, trueVal || val);
        }
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n
         */
        to$(n) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
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
        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch (with -changed if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name, detail, asIs) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
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
        this._origC = []; //original Children
        /**
         * original style
         */
        this._origS = '';
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
                this.tFrom(oldValue, newValue);
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
    remAll(root) {
        if (root === null)
            return false;
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
        return true;
    }
    /**
     * toggle From
     * @param oldVal
     * @param newVal
     */
    tFrom(oldVal, newVal) {
        if (oldVal) {
            if (!newVal) {
                this._origS = this.style.display;
                this.style.display = 'none';
            }
        }
        else if (newVal && (this.style.display === 'none')) {
            this.style.display = this._origS;
        }
    }
    opc() {
        if (!this._from || !this._connected || this.disabled || !this._copy)
            return;
        const template = this.getSrcTempl();
        const clone = template.content.cloneNode(true);
        if (this._noshadow) {
            this.remAll(this);
            this.appendChild(clone);
        }
        else {
            if (!this.remAll(this.shadowRoot))
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
            this._origC.push(node.cloneNode(true));
        });
        this.innerHTML = '';
        super.connectedCallback();
    }
    /**
     * define props
     * @param name
     * @param template
     * @param newClass
     * @param props
     * @param isObj
     */
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
    /**
     * define Methods
     * @param newClass
     * @param template
     */
    dM(newClass, template) {
        const prevSibling = template.previousElementSibling;
        if (!prevSibling || !prevSibling.dataset.methods)
            return;
        const evalScript = eval(prevSibling.innerHTML);
        for (const fn in evalScript) {
            newClass.prototype[fn] = evalScript[fn];
        }
    }
    /**
     * addAttributeChangedCallback
     * @param newClass
     */
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
    /**
     * get custom element name
     */
    gn() {
        const fromTokens = this._from.split('/');
        const fromName = fromTokens[0] || fromTokens[1];
        return this.getCEName(fromName);
    }
    /**
     * set activate component
     */
    sac() {
        const t = this;
        const aceN = this.gn();
        for (let i = 0, ii = t.children.length; i < ii; i++) {
            const child = t.children[i];
            const style = child.style;
            if (child.localName === aceN) {
                style.display = child.cc_orgD || 'block';
            }
            else if (style.display !== 'none') {
                if (!child.cc_orgD)
                    child.cc_orgD = child.style.display;
                child.style.display = 'none';
            }
        }
    }
    /**
     * onPropsChange
     */
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
                    const mO = new MutationObserver((mr) => {
                        this.createCE(template);
                        mO.disconnect();
                    });
                    mO.observe(template, config);
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
                this._origC.forEach(child => {
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
                constructor() {
                    super(...arguments);
                    this._connected = false;
                }
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
                constructor() {
                    super();
                    this._connected = false;
                    this.attachShadow({ mode: 'open' });
                    this.shadowRoot.appendChild(template.content.cloneNode(true));
                }
                static get is() { return ceName; }
                static get objProps() {
                    return parsedObjProps;
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
        