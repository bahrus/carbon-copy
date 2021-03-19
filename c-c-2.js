import { BCC } from './b-c-c.js';
/**
*  Codeless web component generator
*  @element c-c
*
*/
export class CC extends BCC {
}
CC.is = 'c-c';
function getCEName(templateId) {
    if (templateId.indexOf('-') > -1)
        return templateId;
    return 'c-c-' + templateId.split('_').join('-');
}
