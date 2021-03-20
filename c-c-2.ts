import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';

/**
*  Codeless web component generator
*  @element c-c
* 
*/
export class CC extends HTMLElement implements ReactiveSurface {
    static is = 'c-c';

    self = this;
    propActions = propActions;
    reactor = new xc.Rx(this);
    from: string | undefined;
    copy: boolean | undefined;
    noshadow: boolean | undefined;
    templateToClone: HTMLTemplateElement | undefined;
    clonedTemplate: DocumentFragment | undefined;
}

export const linkTemplateToClone = ({copy, from, self}: CC) => {
    const referencedTemplate = upShadowSearch(self, from!) as HTMLTemplateElement;
    if(referencedTemplate !== null) {
        self.templateToClone = referencedTemplate;
    }
};

export const linkClonedTemplate = ({templateToClone, self}: CC) => {
    const ceName = getCEName(templateToClone!.id);
    const noshadow = self.noshadow;
    class newClass extends HTMLElement{
        static is = ceName;
        connectedCallback(){
            const clone = templateToClone!.content.cloneNode(true);
            if(noshadow){
                this.appendChild(clone);
            }else{
                const shadowRoot = this.attachShadow({mode: 'open'});
                shadowRoot.appendChild(clone);
            }
        }
    }
    xc.define(newClass);
}

const propActions = [
    linkTemplateToClone,
    linkClonedTemplate,
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

const propDefMap: PropDefMap<CC> = {
    copy: bool2,
    from: str2,
    noshadow: bool1
}

xc.define(CC);