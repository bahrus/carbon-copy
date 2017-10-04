function cc_resolver(doc, cc) {
    cc.qsa('template', doc.body).forEach((template) => {
        cc.qsa('c-c[href],carbon-copy[href],link[rel="import"]', template.content).forEach(hrefTag => {
            const href = hrefTag.getAttribute('href');
            const splitHref = href.split('#');
            const newHref = cc.absolute(cc._absUrl, splitHref[0]);
            hrefTag.setAttribute('href', newHref + '#' + splitHref[1]);
        });
    });
    return doc;
}
//# sourceMappingURL=cc_resolver.js.map