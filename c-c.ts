import { XtallatX } from 'xtal-latx/xtal-latx.js';
import {BCC} from './b-c-c.js';
import {define} from 'xtal-latx/define.js';


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
   

    static registering: { [key: string]: boolean } = {};
  
    

    getCEName(templateId: string) {
        if(templateId.indexOf('-') > -1) return templateId;
        return 'c-c-' + templateId.split('_').join('-');
    }

    connectedCallback(){
        this.childNodes.forEach((node : Element) => {
            this._originalChildren.push(node.cloneNode(true) as HTMLElement);
        })
        this.innerHTML = '';
        super.connectedCallback();
    }
    dP(name: string, template: HTMLTemplateElement, newClass: any, props: string[], isObj: boolean){ //define Props
        if(isObj){
            props.forEach(prop =>{
                Object.defineProperty(newClass.prototype, prop, {
                    get: function(){ 
                        return this['_' + prop]; 
                    },
                    set: function (val) {
                        this['_' + prop] = val;
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
                    get: function(){ 
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
    dM(newClass: any, template:HTMLTemplateElement){ //define methods
        const prevSibling = template.previousElementSibling as HTMLElement;
        if(!prevSibling || !prevSibling.dataset.methods) return;
        const evalScript = eval(prevSibling.innerHTML);
        for(const fn in evalScript){
            newClass.prototype[fn] = evalScript[fn];
        }
    }

    private aacc(newClass: any){ //add attributee changed callback
        newClass.prototype.attributeChangedCallback = function(name: string, oldVal: string, newVal: string){
            let val: any = newVal;
            let isObj = false;
            const objProps = this.constructor.objProps;
            if(objProps && objProps.indexOf(name) > -1){
                val = JSON.parse(newVal);
                isObj = true;
            }
            this['_' + name] = val;
            this.de(name, {
                value: val
            });
            if(this.onPropsChange) this.onPropsChange(name, oldVal, val);
        }
    }

    
    gn(){
        const fromTokens = this._from.split('/');
        const fromName = fromTokens[0] || fromTokens[1];
        return this.getCEName(fromName);
    }
    sac(){
        const t = (<any>this) as HTMLElement;
        const activeCEName = this.gn();
        for(let i = 0, ii = t.children.length; i < ii; i++){
            const child = t.children[i] as HTMLElement;
            const style = child.style;
            if(child.localName === activeCEName){
                style.display = (<any>child).cc_orgD || 'block';
            }else if(style.display !== 'none'){
                if(!(<any>child).cc_orgD) (<any>child).cc_orgD = child.style.display;
                child.style.display = 'none';
            }
        }
    }
    opc() { //onPropsChange
        if (!this._from || !this._connected || this.disabled) return;
        const newCEName = this.gn();
        
        if (!customElements.get(newCEName)) {
            if (!CC.registering[newCEName]) {
                CC.registering[newCEName] = true;
                const template = this.getSrcTempl() as HTMLTemplateElement;
                if (template.hasAttribute('data-src') && !template.hasAttribute('loaded')) {
                    const config: MutationObserverInit = {
                        attributeFilter: ['loaded'],
                        attributes: true,
                    }
                    const mutationObserver = new MutationObserver((mr: MutationRecord[]) => {
                        this.createCE(template as HTMLTemplateElement);
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
            
            const newEl = this.querySelector(newCEName) as HTMLElement;
            if (!newEl) {
                const ce = document.createElement(newCEName);
                this._originalChildren.forEach(child => {
                    ce.appendChild(child.cloneNode(true));
                })
                this.appendChild(ce);
            }
            this.sac();
        })

    }

    createCE(template: HTMLTemplateElement) {
        const ceName = this.getCEName(template.id);
        const ds = template.dataset;
        const strPropsAttr = ds.strProps;
        const parsedStrProps = strPropsAttr ? strPropsAttr.split(',') : [];
        const objPropsAttr = ds.objProps;
        const parsedObjProps = objPropsAttr ? objPropsAttr.split(',') : [];
        const allProps = parsedStrProps.concat(parsedObjProps);
        if (this._noshadow) {

            class newClass extends XtallatX(HTMLElement) {
                static get is(){return ceName;}
                static getObjProps(){
                    return parsedObjProps;
                }
                connectedCallback() {
                    this._upgradeProperties(allProps);
                    this._connected = true;
                    this.appendChild(template.content.cloneNode(true));
                }
                static get observedAttributes(){return allProps;}
            }
            this.dP(ceName, template, newClass, parsedStrProps, false);
            this.dP(ceName, template, newClass, parsedObjProps, true);
            define(newClass);
        } else {
            class newClass extends XtallatX(HTMLElement) {
                static get is(){return ceName;}
                static get objProps(){
                    return parsedObjProps;
                }
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
                
            }
            this.dP(ceName, template, newClass, parsedStrProps, false);
            this.dP(ceName, template, newClass, parsedObjProps, true);
            this.dM(newClass, template);
            this.aacc(newClass);
            define(newClass);
        }
        
    }



}
define(CC);
