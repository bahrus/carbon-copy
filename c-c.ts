
const template_id = 'template-id';
const copy = 'copy';

/**
* `carbon-copy`
* Dependency free web component that allows copying templates.
* 
*
* @customElement
* @polymer
* @demo demo/index.html
*/
export class CC extends HTMLElement{
    static get is(){return 'c-c';}
    static get observedAttributes() {
        return [copy, template_id];
    }
    _upgradeProperties(props: string[]) {
        props.forEach(prop =>{
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        })
   
    }
    static registering : {[key: string]: boolean} = {};
    // _host: HTMLElement | ShadowRoot;
    // get host(){
    //     return this._host;
    // }
    _copy: boolean;
    get copy(){
        return this._copy;
    }
    set copy(val: boolean){
        if(val) {
            this.setAttribute(copy, '');
        }else{
            this.removeAttribute(copy);
        }
    }
    _templateId: string;
    get templateId(){
        return this._templateId;
    }
    set templateId(val){
        this.setAttribute(template_id, val);
    }
   
    attributeChangedCallback(name: string, oldValue: string, newValue: string){
        switch(name){
            case copy:
                this._copy = newValue !== null;
                break;
            case template_id:
                this._templateId = newValue;
                break;
            // case hasSlots:
            //     this._hasSlots = newValue !== null;
            //     break;
        }
        this.onPropsChange();
    }

    
    connectedCallback(){
        this._upgradeProperties([copy, 'templateId'])
        //this.getHost(this);
        
        this.onPropsChange();
    }
    _ceName:string;
    get ceName(){
        if(!this._ceName){
            this._ceName = 'c-c-' + this._templateId.split('_').join('-');
        }
        return this._ceName;
    }
    createCE(template: HTMLTemplateElement){
        customElements.define(this.ceName, class extends HTMLElement{
            constructor(){
                super();
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
            }
        })
    }
    _alreadyRegistered = false;
    onPropsChange(){
        if(!this._copy || !this._templateId || this._alreadyRegistered) return;
        this._alreadyRegistered = true;
        if(!customElements.get(this.ceName)){
            if(!CC.registering[this.ceName]){
                CC.registering[this.ceName] = true;
                let template = self[this._templateId] as HTMLTemplateElement;
                
                if(template.dataset.src && !template.getAttribute('loaded')){
                    throw "not supported yet"
                }
                this.createCE(template);
            }
        }
        customElements.whenDefined(this.ceName).then(() =>{
            const ce = document.createElement(this.ceName);
            while (this.childNodes.length > 0) {
                ce.appendChild(this.childNodes[0]);
            }
            this.appendChild(ce);
        })

    }
    _lightChildren: {[key: string]: HTMLElement};

}
if(!customElements.get(CC.is)){
    customElements.define('c-c', CC);
}
