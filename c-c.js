import { xc } from 'xtal-element/lib/XtalCore.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
import { TemplateInstance } from 'templ-arts/lib/index.js';
import { passAttrToProp } from 'xtal-element/lib/passAttrToProp.js';
/**
*  Codeless web component generator
*  @element c-c
*  @tag c-c
*
*/
export class CC extends HTMLElement {
    static is = 'c-c';
    self = this;
    propActions = propActions;
    reactor = new xc.Rx(this);
    /**
     * @private
     */
    templateInstance;
    connectedCallback() {
        xc.mergeProps(this, slicedPropDefs);
    }
    onPropChange(name, propDef, newVal) {
        this.reactor.addToQueue(propDef, newVal);
    }
}
export const linkTemplateToClone = ({ copy, from, self }) => {
    let ceName = from.split('/').pop();
    if (ceName === undefined || customElements.get(getCEName(ceName)))
        return;
    const referencedTemplate = upShadowSearch(self, from);
    if (referencedTemplate !== null) {
        self.templateToClone = referencedTemplate;
    }
};
export const linkTemplateToCloneFromPrevSibling = ({ copy, fromPrevSibling, self }) => {
    self.templateToClone = self.previousElementSibling;
};
export const linkClonedTemplate = ({ templateToClone, self }) => {
    const ceName = getCEName(templateToClone.id);
    const noshadow = self.noshadow;
    const propDefMap = {};
    const baseProp = {
        async: true,
        dry: true,
        reflect: true
    };
    const defaults = {};
    if (self.stringProps !== undefined) {
        for (const stringProp of self.stringProps) {
            const split = stringProp.split('=').map(s => s.trim());
            const prop = {
                ...baseProp,
                type: String,
            };
            propDefMap[split[0]] = prop;
            if (split.length > 1) {
                defaults[split[0]] = split[1];
            }
        }
    }
    if (self.boolProps !== undefined) {
        for (const boolProp of self.boolProps) {
            const split = boolProp.split('=').map(s => s.trim());
            const prop = {
                ...baseProp,
                type: Boolean,
            };
            propDefMap[split[0]] = prop;
            if (split.length > 1) {
                defaults[split[0]] = JSON.parse('"' + split[1] + '"');
            }
        }
    }
    if (self.numProps !== undefined) {
        for (const numProp of self.numProps) {
            const split = numProp.split('=').map(s => s.trim());
            const prop = {
                ...baseProp,
                type: Number,
            };
            propDefMap[split[0]] = prop;
            if (split.length > 1) {
                const val = split[1];
                defaults[split[0]] = val.includes('.') ? parseFloat(val) : parseInt(val);
            }
        }
    }
    if (self.objProps !== undefined) {
        for (const objProp of self.objProps) {
            const split = objProp.split('=').map(s => s.trim());
            const prop = {
                ...baseProp,
                type: Object,
                reflect: false,
            };
            propDefMap[split[0]] = prop;
            if (split.length > 1) {
                defaults[split[0]] = JSON.parse(split[1]);
            }
        }
    }
    const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
    class newClass extends HTMLElement {
        static is = ceName;
        static observedAttributes = [...slicedPropDefs.boolNames, ...slicedPropDefs.numNames, ...slicedPropDefs.strNames];
        propActions = [];
        reactor = new xc.Rx(self);
        attributeChangedCallback(name, oldValue, newValue) {
            passAttrToProp(this, slicedPropDefs, name, oldValue, newValue);
        }
        connectedCallback() {
            if (this.tpl !== undefined)
                return; //how?!!!
            xc.mergeProps(this, slicedPropDefs, defaults);
            this.tpl = new TemplateInstance(templateToClone, this);
            if (noshadow) {
                this.appendChild(this.tpl);
            }
            else {
                const shadowRoot = this.attachShadow({ mode: 'open' });
                shadowRoot.appendChild(this.tpl);
            }
        }
        onPropChange(n, prop, nv) {
            this.reactor.addToQueue(prop, nv);
            if (this.tpl === undefined)
                return;
            this.tpl.update(this);
        }
        tpl;
    }
    xc.letThereBeProps(newClass, slicedPropDefs, 'onPropChange');
    xc.define(newClass);
};
const propActions = [
    linkTemplateToClone,
    linkClonedTemplate,
    linkTemplateToCloneFromPrevSibling,
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
    objProps: obj3,
    fromPrevSibling: bool2,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(CC, slicedPropDefs, 'onPropChange');
xc.define(CC);
export function define(id, template, props) {
    const cc = document.createElement('c-c');
    template.id = id;
    Object.assign(cc, {
        ...props,
        templateToClone: template
    });
    document.head.appendChild(cc);
}
export class CarbonCopy extends CC {
    static is = 'carbon-copy';
}
xc.define(CarbonCopy);
