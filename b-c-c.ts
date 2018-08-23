import { XtallatX } from 'xtal-latx/xtal-latx.js';
import {define} from 'xtal-latx/define.js';

const from = 'from';
const copy = 'copy';


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
        return [copy, from];
    }

    

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


    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case copy:
                this._copy = newValue !== null;
                break;
            case from:
                //this._prevId = oldValue;
                this._from = newValue;
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

    getSrcTempl(){
        const fromTokens = this._from.split('/');
        const fromName = fromTokens[0] || fromTokens[1];
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
        return template;
    }

    _originalChildren  = [] as HTMLElement[];
    //_prevId!: string;

    onPropsChange() {
        if (!this._from || !this._connected || this.disabled || !this._copy) return;
        const template = this.getSrcTempl();
        const clone = template.content.cloneNode(true);
        this.appendChild(clone);
    }


}
define(BCC);