function zenmu_createElement(zenmu) {
    const tags = zenmu.split('(');
    let htmlElement;
    let rootElement;
    //const reg = /(.*)#(.*).(.*)@(.*)/;
    tags.forEach(tag => {
        //const split = tag.split(reg);
        let remainingString = tag;
        let tagName;
        let id;
        let attribs = {};
        let classes = [];
        const posOfAt = remainingString.indexOf('@');
        if (posOfAt > -1) {
            const attribString = remainingString.substr(posOfAt + 1);
            const nameValPairs = attribString.split('@');
            nameValPairs.forEach(nvp => {
                const lhs_rhs = nvp.split(':');
                if (lhs_rhs.length > 1) {
                    attribs[lhs_rhs[0]] = lhs_rhs[1];
                }
                else {
                    attribs[lhs_rhs[0]] = '';
                }
            });
            remainingString = remainingString.substr(0, posOfAt);
        }
        const posOfDot = remainingString.indexOf('.');
        if (posOfDot > -1) {
            const classString = remainingString.substr(posOfDot + 1);
            const splitClassString = classString.split('.');
            splitClassString.forEach(classString => {
                classes.push(classString);
            });
            remainingString = remainingString.substr(0, posOfDot);
        }
        const posOfHash = remainingString.indexOf('#');
        if (posOfHash > -1) {
            id = remainingString.substr(posOfHash + 1);
            remainingString = remainingString.substr(0, posOfHash);
        }
        tagName = remainingString || 'template';
        const newElement = document.createElement(tagName);
        if (id)
            newElement.setAttribute('id', id);
        for (var key in attribs) {
            newElement.setAttribute(key, attribs[key]);
        }
        if (classes.length > 0) {
            newElement.className = classes.join(' ');
        }
        if (!rootElement) {
            rootElement = newElement;
        }
        else {
            htmlElement.appendChild(newElement);
        }
        htmlElement = newElement;
    });
    return {
        topElement: rootElement,
        bottomElement: htmlElement,
    };
}
function zenmu(doc, cc) {
    cc.qsa('template', doc).forEach((template) => {
        cc.qsa('[wraps]', template.content).forEach(wrapEl => {
            const wrapsAtr = wrapEl.getAttribute('wraps');
            const domToInsert = zenmu_createElement(wrapsAtr);
            for (let i = 0, ii = wrapEl.children.length; i < ii; i++) {
                const child = wrapEl.children[0];
                const removedChild = wrapEl.removeChild(child);
                domToInsert.bottomElement.appendChild(removedChild);
            }
            wrapEl.appendChild(domToInsert.topElement);
            wrapEl.removeAttribute('wraps');
        });
    });
    return doc;
}
//# sourceMappingURL=zenmu.js.map