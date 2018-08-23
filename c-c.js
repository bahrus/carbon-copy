import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { BCC } from './b-c-c.js';
import { define } from 'xtal-latx/define.js';
const noshadow = 'noshadow';
/**
* `c-c`
* Dependency free web component that allows copying templates.
*
*
* @customElement
* @polymer
* @demo demo/index.html
*/
export class CC extends BCC {
    static get is() { return 'c-c'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([noshadow]);
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
    getCEName(templateId) {
        if (templateId.indexOf('-') > -1)
            return templateId;
        return 'c-c-' + templateId.split('_').join('-');
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case noshadow:
                this._noshadow = newValue !== null;
                break;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
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
            if (child.tagName.toLowerCase() === activeCEName) {
                child.style.display = child.cc_orgD || 'block';
            }
            else {
                child.cc_orgD = child.style.display;
                child.style.display = 'none';
            }
        }
    }
    onPropsChange() {
        if (!this._from || !this._connected || this.disabled)
            return;
        //this._alreadyRegistered = true;
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
//# sourceMappingURL=c-c.js.map