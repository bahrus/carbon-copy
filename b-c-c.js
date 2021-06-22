import { xc } from 'xtal-element/lib/XtalCore.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
const DOMToTemplateMap = new WeakMap();
/**
* Web component that allows basic copying of templates inside Shadow DOM (by default).
* @element b-c-c
*
*/
export class BCC extends HTMLElement {
    static is = 'b-c-c';
    self = this;
    propActions = propActions;
    reactor = new xc.Rx(this);
    noclear;
    from;
    copy;
    noshadow;
    toBeTransformed;
    trContext;
    templateToClone;
    clonedTemplate;
    _oldFrom;
    _retries = 0;
    // /**
    //  * Replace the b-c-c tag with this tag
    //  */
    // morphInto: string | undefined;
    connectedCallback() {
        xc.mergeProps(this, slicedPropDefs);
    }
    onPropChange(name, propDef, newVal) {
        this.reactor.addToQueue(propDef, newVal);
    }
}
export const linkTemplateToClone = ({ copy, from, self }) => {
    if (from === self._oldFrom)
        return;
    const referencedTemplate = upShadowSearch(self, from);
    if (referencedTemplate !== null) {
        self._oldFrom = from;
        self.templateToClone = referencedTemplate;
    }
    else if (self._retries === 0) {
        self._retries++;
        setTimeout(() => linkTemplateToClone(self), 50);
    }
    else {
        console.error('Cannot locate template: ' + from, self);
    }
};
export const linkClonedTemplate = ({ templateToClone, self }) => {
    let realTemplateToClone = templateToClone;
    if (templateToClone.localName !== 'template') {
        if (!DOMToTemplateMap.has(templateToClone)) {
            const newTemplate = document.createElement('template');
            const aTemplateToClone = templateToClone;
            newTemplate.innerHTML = aTemplateToClone.getInnerHTML ? aTemplateToClone.getInnerHTML({ includeShadowRoots: true }) : templateToClone.innerHTML;
            DOMToTemplateMap.set(templateToClone, newTemplate);
        }
        realTemplateToClone = DOMToTemplateMap.get(templateToClone);
    }
    self.clonedTemplate = realTemplateToClone.content.cloneNode(true);
};
export const onClonedTemplate = ({ clonedTemplate, toBeTransformed, trContext: tr, self }) => {
    let target = self;
    if (!self.noshadow) {
        if (target.shadowRoot == null) {
            target = self.attachShadow({ mode: 'open' });
        }
        else {
            target = target.shadowRoot;
        }
    }
    if (!self.noclear) {
        target.innerHTML = '';
    }
    if (toBeTransformed && tr === undefined)
        return;
    if (tr !== undefined) {
        tr.transform(clonedTemplate, tr, target);
    }
    else {
        target.appendChild(clonedTemplate);
    }
    delete self.clonedTemplate;
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
    reflect: true,
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
    trContext: obj1,
    templateToClone: obj2,
    clonedTemplate: obj2,
    //morphInto: str1,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(BCC, slicedPropDefs, 'onPropChange');
xc.define(BCC);
