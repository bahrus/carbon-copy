import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';
import {RenderContext} from 'trans-render/lib/types.d.js';

/**
* Web component that allows basic copying of templates inside Shadow DOM (by default).
* @element b-c-c
* 
*/
export class BCC extends HTMLElement implements ReactiveSurface{
    static is = 'b-c-c';

    self = this;
    propActions = propActions;
    reactor = new xc.Rx(this);
    noclear: boolean | undefined;
    from: string | undefined;
    copy: boolean | undefined;
    noshadow: boolean | undefined;
    toBeTransformed: boolean | undefined;
    trContext: RenderContext | undefined;
    templateToClone: HTMLTemplateElement | undefined;
    clonedTemplate: DocumentFragment | undefined;
    _oldFrom: string | undefined;
    // /**
    //  * Replace the b-c-c tag with this tag
    //  */
    // morphInto: string | undefined;

    connectedCallback(){
        xc.hydrate(this, slicedPropDefs);
    }

    onPropChange(name: string, propDef: PropDef, newVal: any){
        this.reactor.addToQueue(propDef, newVal);
    }
}

const linkTemplateToClone = ({copy, from, self}: BCC) => {
    if(from === self._oldFrom) return;
    const referencedTemplate = upShadowSearch(self, from!) as HTMLTemplateElement;
    if(referencedTemplate !== null) {
        self._oldFrom = from;
        self.templateToClone = referencedTemplate;
    }
};

const linkClonedTemplate = ({templateToClone, self}: BCC) => {
    self.clonedTemplate = templateToClone!.content.cloneNode(true) as DocumentFragment;
}

const onClonedTemplate = ({clonedTemplate, toBeTransformed, trContext: tr, self}: BCC) => {
    let target : ShadowRoot | HTMLElement = self;
    if(!self.noshadow){
        if(target.shadowRoot == null){
            target = self.attachShadow({mode: 'open'});
        }else{
            target = target.shadowRoot;
        }
    }
    if(!self.noclear){
        target.innerHTML = '';
    }
    if(toBeTransformed && tr === undefined) return;
    if(tr !== undefined){
        tr.transform!(clonedTemplate!, tr, target);
    }else{
        target.appendChild(clonedTemplate!);
    }
}


const propActions = [
    linkTemplateToClone,
    linkClonedTemplate,
    onClonedTemplate
] as PropAction[];

const bool1 : PropDef = {
    type: Boolean,
    dry: true,
    async: true,
};
const bool2: PropDef = {
    ...bool1,
    stopReactionsIfFalsy: true,
    reflect: true,
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


const propDefMap: PropDefMap<BCC> = {
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

declare global {
    interface HTMLElementTagNameMap {
        "b-c-c": BCC,
    }
}