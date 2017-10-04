function cc_resolver(doc, cc) {
    const target = doc['body'] || doc['content'];
    cc.qsa('template', target).forEach((template) => {
        cc.qsa('c-c[href],carbon-copy[href],link[rel="import"],link[rel="stylesheet"],script,iframe', template.content).forEach(hrefOrScriptTag => {
            switch (hrefOrScriptTag.tagName) {
                case 'IFRAME':
                case 'SCRIPT':
                    const src = hrefOrScriptTag.getAttribute('src');
                    const newSrc = cc.absolute(cc._absUrl, src);
                    hrefOrScriptTag.setAttribute('src', newSrc);
                    break;
                default:
                    const href = hrefOrScriptTag.getAttribute('href');
                    if (href) {
                        const splitHref = href.split('#');
                        const newHref = cc.absolute(cc._absUrl, splitHref[0]);
                        hrefOrScriptTag.setAttribute('href', newHref + (splitHref.length > 0 ? ('#' + splitHref[1]) : ''));
                    }
            }
            cc.qsa('template', template.content).forEach((childTemplate) => {
                cc_resolver(childTemplate, cc);
            });
        });
    });
    return doc;
}
//# sourceMappingURL=cc_resolver.js.map