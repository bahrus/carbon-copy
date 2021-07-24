import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface, IReactor} from 'xtal-element/lib/XtalCore.js';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';
import {TemplateInstance} from 'templ-arts/lib/index.js';
import {passAttrToProp} from 'xtal-element/lib/passAttrToProp.js';
import { CCProps } from './types';
export {CCProps} from './types';

/**
*  Codeless web component generator
*  @element c-c
*  @tag c-c
* 
*/
export class CC extends HTMLElement implements ReactiveSurface {
    static is = 'c-c';

    self = this;
    propActions = propActions;
    reactor: IReactor = new xc.Rx(this);


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
        //async: true,
        dry: true,
        reflect: true
    };
    const defaults: any = {};
    if(self.stringProps !== undefined){
        for(const stringProp of self.stringProps){
            const split = stringProp.split('=').map(s => s.trim());
            const prop: PropDef = {
                ...baseProp,
                type: String,
            };
            propDefMap[split[0]] = prop;
            if(split.length > 1){
                defaults[split[0]] = split[1];
            }
        }
    }
    if(self.boolProps !== undefined){
        for(const boolProp of self.boolProps){
            const split = boolProp.split('=').map(s => s.trim());
            const prop: PropDef = {
                ...baseProp,
                type: Boolean,
            };
            propDefMap[split[0]] = prop;
            if(split.length > 1){
                defaults[split[0]] = JSON.parse('"' + split[1] + '"');
            }
        }        
    }
    if(self.numProps !== undefined){
        for(const numProp of self.numProps){
            const split = numProp.split('=').map(s => s.trim());
            const prop: PropDef = {
                ...baseProp,
                type: Number,
            };
            propDefMap[split[0]] = prop;
            if(split.length > 1){
                const val = split[1];
                defaults[split[0]] = val.includes('.') ? parseFloat(val) : parseInt(val);
            }
        }        
    }
    if(self.objProps !== undefined){
        for(const objProp of self.objProps){
            const split = objProp.split('=').map(s => s.trim());
            const prop: PropDef = {
                ...baseProp,
                type: Object,
                reflect: false,
            };
            propDefMap[split[0]] = prop;
            if(split.length > 1){
                defaults[split[0]] = JSON.parse(split[1]);
            }
        }
    } 
    const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
    class newClass extends HTMLElement implements ReactiveSurface{
        static is = ceName;
        static observedAttributes = [...slicedPropDefs.boolNames, ...slicedPropDefs.numNames, ...slicedPropDefs.strNames];
        self = this;
        propActions = self.propActionsProp || []  as PropAction[];
        reactor: IReactor = new xc.Rx(this);
        attributeChangedCallback(name: string, oldValue: string, newValue: string){
            passAttrToProp(this, slicedPropDefs, name, oldValue, newValue);
        }
        connectedCallback(){
            if(this.tpl !== undefined) return; //how?!!!
            xc.mergeProps(this, slicedPropDefs, defaults);
            this.tpl = new TemplateInstance(templateToClone!, this);

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

export interface CC extends CCProps{}

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
    propActionsProp: obj1,
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

export function define(id: string, template: HTMLTemplateElement, props: CCProps){
    const cc = document.createElement('c-c') as CCProps;
    template.id = id;
    Object.assign(cc, {
        ...props,
        templateToClone: template
    } as CCProps);
    document.head.appendChild(cc);
}
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