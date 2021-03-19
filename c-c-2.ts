import {BCC} from './b-c-c.js';

/**
*  Codeless web component generator
*  @element c-c
* 
*/
export class CC extends BCC {
    static is = 'c-c';
}

function getCEName(templateId: string) {
    if(templateId.indexOf('-') > -1) return templateId;
    return 'c-c-' + templateId.split('_').join('-');
}