import { xc } from 'xtal-element/lib/XtalCore.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
/**
* Web component that allows basic copying of templates inside Shadow DOM (by default).
* @element b-c-c
*
*/
export class BCC extends HTMLElement {
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
BCC.is = 'b-c-c';
const linkTemplateToClone = ({ copy, from, self }) => {
    const referencedTemplate = upShadowSearch(self, from);
    if (referencedTemplate !== null)
        self.templateToClone = referencedTemplate;
};
const linkClonedTemplate = ({ templateToClone, self }) => {
    self.clonedTemplate = templateToClone.content.cloneNode(true);
};
const onClonedTemplate = ({ clonedTemplate, toBeTransformed, tr, self }) => {
    let target = self;
    if (!self.noshadow) {
        if (target.shadowRoot == null) {
            target = self.attachShadow({ mode: 'open' });
        }
        else {
            target = target.shadowRoot;
        }
    }
    target.innerHTML = '';
    if (toBeTransformed && tr === undefined)
        return;
    if (tr !== undefined) {
        tr.transform(clonedTemplate, tr, target);
    }
    else {
        target.appendChild(clonedTemplate);
    }
};
const propActions = [
    linkTemplateToClone,
    linkClonedTemplate,
    onClonedTemplate
];
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
const propDefMap = {
    noclear: bool1,
    copy: bool2,
    from: str2,
    noshadow: bool1,
    toBeTransformed: bool1,
    tr: obj1,
    templateToClone: obj2,
    clonedTemplate: obj2,
    morphInto: str1,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(BCC, slicedPropDefs, 'onPropChange');
xc.define(BCC);
