import { xc } from 'xtal-element/lib/XtalCore.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
import { TemplateInstance } from '@github/template-parts/lib/index.js';
/**
*  Codeless web component generator
*  @element c-c
*
*/
export class CC extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
    }
    connectedCallback() {
        xc.hydrate(this, slicedPropDefs);
    }
    onPropChange(name, propDef, newVal) {
        this.reactor.addToQueue(propDef, newVal);
    }
}
CC.is = 'c-c';
export const linkTemplateToClone = ({ copy, from, self }) => {
    const referencedTemplate = upShadowSearch(self, from);
    if (referencedTemplate !== null) {
        self.templateToClone = referencedTemplate;
    }
};
export const linkClonedTemplate = ({ templateToClone, self }) => {
    const ceName = getCEName(templateToClone.id);
    const noshadow = self.noshadow;
    class newClass extends HTMLElement {
        connectedCallback() {
            xc.hydrate(this, slicedPropDefs);
            this.tpl = new TemplateInstance(templateToClone, this);
            const clone = templateToClone.content.cloneNode(true);
            if (noshadow) {
                this.appendChild(this.tpl);
            }
            else {
                const shadowRoot = this.attachShadow({ mode: 'open' });
                shadowRoot.appendChild(this.tpl);
            }
        }
        onPropChange() {
            this.tpl.update(this);
        }
    }
    newClass.is = ceName;
    const propDefMap = {};
    const baseProp = {
        async: true,
        dry: true,
        reflect: true
    };
    if (self.stringProps !== undefined) {
        for (const stringProp of self.stringProps) {
            const prop = {
                ...baseProp,
                type: String,
            };
            propDefMap[stringProp] = prop;
        }
    }
    if (self.boolProps !== undefined) {
        for (const boolProp of self.boolProps) {
            const prop = {
                ...baseProp,
                type: Boolean,
            };
            propDefMap[boolProp] = prop;
        }
    }
    if (self.numProps !== undefined) {
        for (const numProp of self.numProps) {
            const prop = {
                ...baseProp,
                type: Number,
            };
            propDefMap[numProp] = prop;
        }
    }
    const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
    xc.letThereBeProps(newClass, slicedPropDefs, 'onPropChange');
    xc.define(newClass);
};
const propActions = [
    linkTemplateToClone,
    linkClonedTemplate,
];
function getCEName(templateId) {
    if (templateId.indexOf('-') > -1)
        return templateId;
    return 'c-c-' + templateId;
}
const bool1 = {
    type: Boolean,
    dry: true,
    async: true,
};
const bool2 = {
    ...bool1,
    stopReactionsIfFalsy: true,
};
const str1 = {
    type: String,
    dry: true,
    async: true,
};
const str2 = {
    ...str1,
    stopReactionsIfFalsy: true,
};
const obj1 = {
    type: Object,
    dry: true,
    async: true,
};
const obj2 = {
    ...obj1,
    stopReactionsIfFalsy: true,
};
const obj3 = {
    ...obj1,
    parse: true,
};
const propDefMap = {
    copy: bool2,
    from: str2,
    noshadow: bool1,
    templateToClone: obj2,
    stringProps: obj3,
    boolProps: obj3,
    numProps: obj3,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(CC, slicedPropDefs, 'onPropChange');
xc.define(CC);
export class CarbonCopy extends CC {
}
CarbonCopy.is = 'carbon-copy';
xc.define(CarbonCopy);
