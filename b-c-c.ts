import { XtallatX } from 'xtal-latx/xtal-latx.js';

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
export class BCC extends XtallatX(HTMLElement) {
    static get is() { return 'b-c-c'; }
    static get observedAttributes() {
        return [copy, from, noshadow];
    }

    static registering: { [key: string]: boolean } = {};

    _from!: string;

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
    _copy!: boolean;
    /**
     * @type{boolean}
     * Must be true / present for template copy to proceed.
     */
    get copy() {
        return this._copy;
    }
    set copy(val: boolean) {
        this.attr(copy, val, '');
    }
    _noshadow!: boolean;
    /**
     * Don't use shadow DOM 
     */
    get noshadow() {
        return this._noshadow;
    }
    set noshadow(val) {
        this.attr(noshadow, val, '');
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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

    _connected!: boolean;

    connectedCallback() {
        this._upgradeProperties([copy, from]);
        //this._originalChildren = this.childNodes;
        this.childNodes.forEach((node : Element) => {
            this._originalChildren.push(node.cloneNode(true) as HTMLElement);
        })
        this.innerHTML = '';
        this._connected = true;
        this.onPropsChange();
    }

    getCEName(templateId: string) {
        if(templateId.indexOf('-') > -1) return templateId;
        return 'c-c-' + templateId.split('_').join('-');
    }

    getHost(el: HTMLElement, level: number, maxLevel: number) : HTMLElement | null {
        let parent : any = el;
        while (parent = (parent.parentNode)) {
            if (parent.nodeType === 11) {
                const newLevel = level + 1;
                if (newLevel === maxLevel) return (<any>parent)['host'] as HTMLElement;
                return this.getHost((<any>parent)['host'], newLevel, maxLevel);
            } else if (parent.tagName === 'HTML') {
                return parent;
            }
        }
        return null;
    }
    _originalChildren  = [] as HTMLElement[];
    _prevId!: string;
    onPropsChange() {
        if (!this._from || !this._connected || this.disabled) return;
        //this._alreadyRegistered = true;
        const fromTokens = this._from.split('/');
        const fromName = fromTokens[0] || fromTokens[1];
        const newCEName = this.getCEName(fromName);
        const prevId = this._prevId;
        this._prevId = newCEName;
        if (!customElements.get(newCEName)) {
            if (!BCC.registering[newCEName]) {
                BCC.registering[newCEName] = true;
                let template: HTMLTemplateElement | null = null;
                if (!fromTokens[0]) {
                    template = (<any>self)[fromName];
                } else {
                    //const path = this._from.split('/');
                    //const id = path[path.length - 1];
                    const host = this.getHost(<any>this as HTMLElement, 0, fromTokens.length);
                    if (host) {
                        const cssSelector = '#' + fromName;
                        if (host.shadowRoot) {
                            template = host.shadowRoot.querySelector(cssSelector);
                        }
                        if (!template) template = host.querySelector(cssSelector);
                    }

                }
                if(!template) throw '404: ' + fromName;
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

    createCE(template: HTMLTemplateElement) {
        const ceName = this.getCEName(template.id);
        if (this._noshadow) {
            class newClass extends HTMLElement {
                connectedCallback() {
                    this.appendChild(template.content.cloneNode(true));
                }
            }
            customElements.define(ceName, newClass);
        } else {
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
if (!customElements.get(BCC.is)) {
    customElements.define(BCC.is, BCC);
}