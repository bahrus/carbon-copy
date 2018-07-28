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

  

    defineProps(name: string, template: HTMLTemplateElement, newClass: any, props: string[], isObj: boolean){
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
    defineMethods(newClass: any, template:HTMLTemplateElement){
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



}
if (!customElements.get(CC.is)) {
    customElements.define(CC.is, CC);
}
