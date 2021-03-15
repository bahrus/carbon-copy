import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';

/**
* Web component that allows basic copying of templates inside Shadow DOM (by default).
* @element b-c-c
* 
*/
export class BCC extends HTMLElement{
    static is = 'b-c-c';

    noclear: boolean | undefined;
    from: string | undefined;
    copy: boolean | undefined;
    noshadow: boolean | undefined;
    toBeTransformed: boolean | undefined;
    transform: any | undefined;
}

xc.define(BCC);