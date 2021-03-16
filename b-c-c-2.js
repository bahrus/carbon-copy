import { xc } from 'xtal-element/lib/XtalCore.js';
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
const linkTemplateToClone = ({ from, self }) => {
    const referencedTemplate = self.getRootNode().querySelector(from);
    if (referencedTemplate !== null)
        self.templateToClone = referencedTemplate;
};
const linkClonedTemplate = ({ templateToClone, self }) => {
    templateToClone.content.cloneNode(true);
};
const propActions = [
    linkTemplateToClone
];
const bool1 = {
    type: Boolean,
    dry: true,
    async: true,
};
const str1 = {
    type: String,
    dry: true,
    async: true,
};
const str2 = {
    type: String,
    dry: true,
    async: true,
    stopReactionsIfFalsy: true,
};
const obj1 = {
    type: Object,
    dry: true,
    async: true,
    stopReactionsIfFalsy: true,
};
const propDefMap = {
    noclear: bool1,
    copy: bool1,
    from: str2,
    noshadow: bool1,
    toBeTransformed: bool1,
    transform: obj1,
    templateToClone: obj1,
    morphInto: str1,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(BCC, slicedPropDefs, 'onPropChange');
xc.define(BCC);
