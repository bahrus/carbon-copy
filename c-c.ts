import { XtallatX } from 'xtal-latx/xtal-latx.js';
import {BCC} from './b-c-c.js';


/**
* `carbon-copy`
* Dependency free web component that allows copying templates.
* 
*
* @customElement
* @polymer
* @demo demo/index.html
*/
export class CC extends BCC {
    static get is() { return 'c-c'; }

    static registering: { [key: string]: boolean } = {};


    _prevId: string;





    
    _originalChildren = [];

    getCEName(templateId: string) {
        if(templateId.indexOf('-') > -1) return templateId;
        return 'c-c-' + templateId.split('_').join('-');
    }
    defineProps(name: string, template: HTMLTemplateElement, newClass, props: string[], isObj: boolean){
        if(isObj){
            props.forEach(prop =>{
                Object.defineProperty(newClass.prototype, prop, {
                    get: () => { 
                        return this['_' + prop]; 
                    },
                    set: function (val) {
                        this['_' + prop];
                        this.de(prop,{
                            value: val
                        })
                    },
                    enumerable: true,
                    configurable: true,
                });            
            })            
        }else{
            props.forEach(prop =>{
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
            })
        }

        
        
    }
    defineMethods(newClass, template:HTMLTemplateElement){
        newClass.prototype.attributeChangedCallback = function(name: string, oldVal: string, newVal: string){
            this['_' + name] = newVal;
            if(this.onPropsChange) this.onPropsChange(name, oldVal, newVal);
        }
        const prevSibling = template.previousElementSibling as HTMLElement;
        if(!prevSibling || !prevSibling.dataset.methods) return;
        const evalScript = eval(prevSibling.innerHTML);
        for(const fn in evalScript){
            newClass.prototype[fn] = evalScript[fn];
        }
    }
    
    createCE(template: HTMLTemplateElement) {
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
                connectedCallback() {
                    this._upgradeProperties(allProps);
                    this._connected = true;
                    this.appendChild(template.content.cloneNode(true));
                }
                static get observedAttributes(){return allProps;}
            }
            this.defineProps(ceName, template, newClass, parsedStrProps, false);
            this.defineProps(ceName, template, newClass, parsedObjProps, true);
            customElements.define(ceName, newClass);
        } else {
            class newClass extends XtallatX(HTMLElement) {
                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                    this.shadowRoot.appendChild(template.content.cloneNode(true));
                }
                connectedCallback(){
                    this._connected = true;
                    this._upgradeProperties(allProps);
                }
                static get observedAttributes(){return allProps;}
                // attributeChangedCallback(name: string, oldVal: string, newVal: string){
                //     this['_' + name] = newVal;
                // }
            }
            this.defineProps(ceName, template, newClass, parsedStrProps, false);
            this.defineProps(ceName, template, newClass, parsedObjProps, true);
            this.defineMethods(newClass, template);
            customElements.define(ceName, newClass);
        }
        
    }
    getHost(el: HTMLElement, level: number, maxLevel: number) {
        let parent = el;
        while (parent = parent.parentElement) {
            if (parent.nodeType === 11) {
                const newLevel = level + 1;
                if (newLevel === maxLevel) return parent['host'];
                return this.getHost(parent['host'], newLevel, maxLevel);
            } else if (parent.tagName === 'HTML') {
                return parent;
            }

        }
    }
    onPropsChange() {
        if (!this._from || !this._connected || this.disabled) return;
        //this._alreadyRegistered = true;
        const fromTokens = this._from.split('/');
        const fromName = fromTokens[0] || fromTokens[1];
        const newCEName = this.getCEName(fromName);
        const prevId = this._prevId;
        this._prevId = newCEName;
        if (!customElements.get(newCEName)) {
            if (!CC.registering[newCEName]) {
                CC.registering[newCEName] = true;
                let template: HTMLTemplateElement;
                if (!fromTokens[0]) {
                    template = self[fromName];
                } else {
                    //const path = this._from.split('/');
                    //const id = path[path.length - 1];
                    const host = this.getHost(<any>this as HTMLElement, 0, fromTokens.length);
                    if (host) {
                        if (host.shadowRoot) {
                            template = host.shadowRoot.getElementById(fromName);
                            if (!template) template = host.getElementById(fromName);
                        } else {
                            template = host.querySelector('#' + fromName);
                        }
                    }

                }
                if (template.hasAttribute('data-src') && !template.hasAttribute('loaded')) {
                    const config: MutationObserverInit = {
                        attributeFilter: ['loaded'],
                        attributes: true,
                    }
                    const mutationObserver = new MutationObserver((mr: MutationRecord[]) => {
                        this.createCE(template);
                        mutationObserver.disconnect();
                    });
                    mutationObserver.observe(template, config);
                } else {
                    this.createCE(template);
                }

            }
        }
        if(!this._copy) return;
        customElements.whenDefined(newCEName).then(() => {

            //const name = newCEName;
            if (prevId) {
                const prevEl = this.querySelector(prevId) as HTMLElement;
                if (prevEl) prevEl.style.display = 'none';
            }
            const prevEl = this.querySelector(newCEName) as HTMLElement;
            if (prevEl) {
                prevEl.style.display = 'block';
            } else {
                const ce = document.createElement(newCEName);
                this._originalChildren.forEach(child => {
                    ce.appendChild(child.cloneNode(true));
                })
                // while (this.childNodes.length > 0) {
                //     ce.appendChild(this.childNodes[0]);
                // }
                this.appendChild(ce);
            }

        })

    }
    _lightChildren: { [key: string]: HTMLElement };

}
if (!customElements.get(CC.is)) {
    customElements.define(CC.is, CC);
}
