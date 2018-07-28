import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { BCC } from './b-c-c.js';
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