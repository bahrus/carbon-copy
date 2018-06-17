
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
    _prevId: string;
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
                this._prevId = oldValue;
                this._templateId = newValue;
                break;
        }
        this.onPropsChange();
    }

    
    connectedCallback(){
        this._upgradeProperties([copy, 'templateId'])
        this.onPropsChange();
    }
    //_ceName:string;
    getCEName(templateId: string){
        return 'c-c-' + templateId.split('_').join('-');
    }
    createCE(template: HTMLTemplateElement){
        customElements.define(this.getCEName(template.id), class extends HTMLElement{
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
        const newCEName = this.getCEName(this._templateId);
        if(!customElements.get(newCEName)){
            if(!CC.registering[newCEName]){
                CC.registering[newCEName] = true;
                let template = self[this._templateId] as HTMLTemplateElement;
                
                if(template.dataset.src && !template.getAttribute('loaded')){
                    const config : MutationObserverInit = {
                        attributeFilter: ['loaded'],
                        attributes: true,
                    }
                    const mutationObserver = new MutationObserver((mr: MutationRecord[])  =>{
                        this.createCE(template);
                        mutationObserver.disconnect();
                    });
                    mutationObserver.observe(template, config);
                }else{
                    this.createCE(template);
                }
               
            }
        }
        customElements.whenDefined(newCEName).then(() =>{
            //const name = newCEName;
            if(this._prevId){
                const prevEl = this.querySelector(this.getCEName(this._prevId)) as HTMLElement;
                if(prevEl) prevEl.style.display = 'none';
            }else{
                const prevEl = this.querySelector(newCEName) as HTMLElement;
                if(prevEl){
                    prevEl.style.display = 'block';
                }else{
                    const ce = document.createElement(newCEName);
                    while (this.childNodes.length > 0) {
                        ce.appendChild(this.childNodes[0]);
                    }
                    this.appendChild(ce);
                }
            }

        })

    }
    _lightChildren: {[key: string]: HTMLElement};

}
if(!customElements.get(CC.is)){
    customElements.define('c-c', CC);
}
