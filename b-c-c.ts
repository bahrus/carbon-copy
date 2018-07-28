import { XtallatX } from 'xtal-latx/xtal-latx.js';

const from = 'from';
const copy = 'copy';
const noshadow = 'noshadow';

/**
* `b-c-c`
* Dependency free web component that allows basic copying of templates.
* 
*
* @customElement
* @polymer
* @demo demo/index.html
*/
export class BCC extends XtallatX(HTMLElement) {
    static get is() { return 'b-c-c'; }
}
if (!customElements.get(BCC.is)) {
    customElements.define(BCC.is, BCC);
}