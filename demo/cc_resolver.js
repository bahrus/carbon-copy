function cc_resolver(doc, cc) {
    const target = doc['body'] || doc['content'];
    cc.qsa('template', target).forEach((template) => {
        cc.qsa('c-c[href],carbon-copy[href],link[rel="import"]', template.content).forEach(hrefTag => {
            const href = hrefTag.getAttribute('href');
            const splitHref = href.split('#');
            const newHref = cc.absolute(cc._absUrl, splitHref[0]);
            hrefTag.setAttribute('href', newHref + '#' + splitHref[1]);
            cc_resolver(template, cc);
        });
    });
    return doc;
}
//# sourceMappingURL=cc_resolver.js.map