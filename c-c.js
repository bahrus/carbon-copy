import { xc } from 'xtal-element/lib/XtalCore.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
import { TemplateInstance } from '@github/template-parts/lib/index.js';
import { passAttrToProp } from 'xtal-element/lib/passAttrToProp.js';
/**
*  Codeless web component generator
*  @element c-c
*
*/
export class CC extends HTMLElement {
    static is = 'c-c';
    self = this;
    propActions = propActions;
    reactor = new xc.Rx(this);
    /**
     * Id of template (with an optional context path in front of the id).
     * If "from" starts with "./", the search for the matching template is done within the shadow DOM of the c-c element
     * (or outside any ShadowDOM if the (b-)c-c element is outside any ShadowDOM).  If from starts with "../" then the search is done one level up, etc.
     */
    from;
    /**
     * Get template from previous sibling.
     */
    fromPrevSibling;
    /**
     * Must be set for anything to happen.
     */
    copy;
    /** No shadow DOM */
    noshadow;
    /** @private */
    templateToClone;
    /** @private */
    clonedTemplate;
    /**
     * List of string properties to add to web component.
     */
    stringProps;
    /**
    * List of boolean properties to add to web component.
    */
    boolProps;
    /**
     * List of numeric properties to add to web component.
     */
    numProps;
    /**
     * List of object properties to add to web component.
     */
    objProps;
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
    if (self.objProps !== undefined) {
        for (const objProp of self.objProps) {
            const prop = {
                ...baseProp,
                type: Object,
            };
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
            xc.mergeProps(this, slicedPropDefs);
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
export class CarbonCopy extends CC {
    static is = 'carbon-copy';
}
xc.define(CarbonCopy);
