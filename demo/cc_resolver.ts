//TODO:  eliminate duplicity
export interface ICarbonCopy{
    absolute(base: string, relative: string) : string;
    _absUrl: string;
    qsa(css, from?: HTMLElement | Document | DocumentFragment) : HTMLElement[];
}

function cc_resolver(doc: Document, cc: ICarbonCopy){
    cc.qsa('template', doc.body).forEach((template: HTMLTemplateElement) =>{
        cc.qsa('c-c[href],carbon-copy[href],link[rel="import"]', template.content).forEach(hrefTag =>{
            const href = hrefTag.getAttribute('href');
            const splitHref= href.split('#');
            const newHref = cc.absolute(cc._absUrl, splitHref[0]);
            hrefTag.setAttribute('href', newHref + '#' + splitHref[1]);
        })

    })    
    return doc;
}