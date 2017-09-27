function cc_resolver(doc: Document, cc: any){
    const templates = doc.body.querySelectorAll('template');
    for(let i = 0, ii = templates.length; i < ii; i++){
        const template = templates[i];
        const hrefs = template.content.querySelectorAll('c-c[href]');
        for(let j = 0, jj = hrefs.length; j < jj; j++){
            const hrefTag = hrefs[j];
            const href = hrefTag.getAttribute('href');
            const splitHref= href.split('#');
            const newHref = cc.absolute(cc._absUrl, splitHref[0]);
            hrefTag.setAttribute('href', newHref + '#' + splitHref[1]);
        }


    }
    return doc;
}