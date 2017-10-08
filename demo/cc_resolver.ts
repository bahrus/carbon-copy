//TODO:  eliminate duplicity
export interface ICarbonCopy{
    absolute(base: string, relative: string) : string;
    _absUrl: string;
    qsa(css, from?: HTMLElement | Document | DocumentFragment) : HTMLElement[];
}
//This version of cc_resolver is meant to be run in the browser, in conjunction with carbon-copy.
//A different function (with same name) should be developed to do the equivalent during build time or
//on the server side.

function cc_resolver(doc: Document | HTMLTemplateElement, cc: ICarbonCopy){
    const target = doc['body'] || doc['content'];
    cc.qsa('template', target).forEach((template: HTMLTemplateElement) =>{
        cc.qsa('c-c[href],carbon-copy[href],link[rel="import"],link[rel="stylesheet"],script,iframe', template.content).forEach(hrefOrScriptTag =>{
            switch(hrefOrScriptTag.tagName){
                case 'IFRAME':
                case 'SCRIPT':
                    const src = hrefOrScriptTag.getAttribute('src');
                    const newSrc = cc.absolute(cc._absUrl, src);
                    hrefOrScriptTag.setAttribute('src', newSrc);
                    break;
                default:
                    const href = hrefOrScriptTag.getAttribute('href');
                    if(href){
                        const splitHref= href.split('#');
                        const newHref = cc.absolute(cc._absUrl, splitHref[0]);
                        hrefOrScriptTag.setAttribute('href', newHref + (splitHref.length > 0 ? ('#' + splitHref[1]) : ''));
                    }
            }

            cc.qsa('template', template.content).forEach((childTemplate: HTMLTemplateElement) =>{
                cc_resolver(childTemplate, cc);
            });
            
        })

    })    
    return doc;
}