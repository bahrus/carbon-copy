import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface, IReactor} from 'xtal-element/lib/XtalCore.js';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';
import {TemplateInstance} from '@github/template-parts/lib/index.js';
import {passAttrToProp} from 'xtal-element/lib/passAttrToProp.js';
/**
*  Codeless web component generator
*  @element c-c
* 
*/
export class CC extends HTMLElement implements ReactiveSurface {
    static is = 'c-c';

    self = this;
    propActions = propActions;
    reactor: IReactor = new xc.Rx(this);
    /**
     * Id of template (with an optional context path in front of the id).  
     * If "from" starts with "./", the search for the matching template is done within the shadow DOM of the c-c element 
     * (or outside any ShadowDOM if the (b-)c-c element is outside any ShadowDOM).  If from starts with "../" then the search is done one level up, etc.
     */
    from: string | undefined;
    /**
     * Get template from previous sibling.
     */
    fromPrevSibling: boolean | undefined;
    /**
     * Must be set for anything to happen.
     */
    copy: boolean | undefined;
    /** No shadow DOM */
    noshadow: boolean | undefined;
    /** @private */
    templateToClone: HTMLTemplateElement | undefined;
    /** @private */
    clonedTemplate: DocumentFragment | undefined;
    /**
     * List of string properties to add to web component.
     */
    stringProps: string[] | undefined;
     /**
     * List of boolean properties to add to web component.
     */   
    boolProps: string[] | undefined;
    /**
     * List of numeric properties to add to web component.
     */
    numProps: string[] | undefined;
    /**
     * List of object properties to add to web component.
     */
    objProps: string[] | undefined;
    /**
     * @private
     */
    templateInstance: TemplateInstance | undefined;

    connectedCallback(){
        xc.mergeProps(this, slicedPropDefs);
    }
    onPropChange(name: string, propDef: PropDef, newVal: any){
        this.reactor.addToQueue(propDef, newVal);
    }
}

export const linkTemplateToClone = ({copy, from, self}: CC) => {
    let ceName = from!.split('/').pop();
    if(ceName === undefined || customElements.get(getCEName(ceName))) return;
    const referencedTemplate = upShadowSearch(self, from!) as HTMLTemplateElement;
    if(referencedTemplate !== null) {
        self.templateToClone = referencedTemplate;
    }
};

export const linkTemplateToCloneFromPrevSibling = ({copy, fromPrevSibling, self}: CC) => {
    self.templateToClone = self.previousElementSibling as HTMLTemplateElement;
};

export const linkClonedTemplate = ({templateToClone, self}: CC) => {
    const ceName = getCEName(templateToClone!.id);
    const noshadow = self.noshadow;
    const propDefMap: PropDefMap<any> = {};
    const baseProp: PropDef = {
        async: true,
        dry: true,
        reflect: true
    };
    if(self.stringProps !== undefined){
        for(const stringProp of self.stringProps){
            const prop: PropDef = {
                ...baseProp,
                type: String,
            };
            propDefMap[stringProp] = prop;
        }
    }
    if(self.boolProps !== undefined){
        for(const boolProp of self.boolProps){
            const prop: PropDef = {
                ...baseProp,
                type: Boolean,
            };
            propDefMap[boolProp] = prop;
        }        
    }
    if(self.numProps !== undefined){
        for(const numProp of self.numProps){
            const prop: PropDef = {
                ...baseProp,
                type: Number,
            };
            propDefMap[numProp] = prop;
        }        
    }
    if(self.objProps !== undefined){
        for(const objProp of self.objProps){
            const prop: PropDef = {
                ...baseProp,
                type: Object,
                reflect: false,
            };
            propDefMap[objProp] = prop;
        }
    } 
    const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
    class newClass extends HTMLElement implements ReactiveSurface{
        static is = ceName;
        static observedAttributes = [...slicedPropDefs.boolNames, ...slicedPropDefs.numNames, ...slicedPropDefs.strNames];
        propActions = [] as PropAction[];
        reactor: IReactor = new xc.Rx(self);
        attributeChangedCallback(name: string, oldValue: string, newValue: string){
            passAttrToProp(this, slicedPropDefs, name, oldValue, newValue);
        }
        connectedCallback(){
            if(this.tpl !== undefined) return; //how?!!!
            xc.mergeProps(this, slicedPropDefs);
            this.tpl = new TemplateInstance(templateToClone!, this)
            if(noshadow){
                this.appendChild(this.tpl);
            }else{
                const shadowRoot = this.attachShadow({mode: 'open'});
                shadowRoot.appendChild(this.tpl);
            }
        }
        onPropChange(n: string, prop: PropDef, nv: any){
            this.reactor.addToQueue(prop, nv);
            if(this.tpl === undefined) return;
            this.tpl.update(this);
        }
        tpl: TemplateInstance | undefined;
    }

    xc.letThereBeProps(newClass, slicedPropDefs, 'onPropChange');
    xc.define(newClass);
}

const propActions = [
    linkTemplateToClone,
    linkClonedTemplate,
    linkTemplateToCloneFromPrevSibling,
] as PropAction[];

function getCEName(templateId: string) {
    if(templateId.indexOf('-') > -1) return templateId;
    return 'c-c-' + templateId;
}

const bool1 : PropDef = {
    type: Boolean,
    dry: true,
    async: true,
};
const bool2: PropDef = {
    ...bool1,
    stopReactionsIfFalsy: true,
};
const str1: PropDef = {
    type: String,
    dry: true,
    async: true,
};
const str2: PropDef = {
    ...str1,
    stopReactionsIfFalsy: true,
};

const obj1: PropDef = {
    type: Object,
    dry: true,
    async: true,
};

const obj2: PropDef = {
    ...obj1,
    stopReactionsIfFalsy: true,
};

const obj3: PropDef = {
    ...obj1,
    parse: true,
};

const propDefMap: PropDefMap<CC> = {
    copy: bool2,
    from: str2,
    noshadow: bool1,
    templateToClone: obj2,
    stringProps: obj3,
    boolProps: obj3,
    numProps: obj3,
    objProps: obj3,
    fromPrevSibling: bool2,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(CC, slicedPropDefs, 'onPropChange');
xc.define(CC);
declare global {
    interface HTMLElementTagNameMap {
        "c-c": CC,
    }
}

export class CarbonCopy extends CC{
    static is = 'carbon-copy';
}

xc.define(CarbonCopy);
declare global {
    interface HTMLElementTagNameMap {
        "carbon-copy": CarbonCopy,
    }
}