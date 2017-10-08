export interface ICarbonCopy{
    absolute(base: string, relative: string) : string;
    _absUrl: string;
    qsa(css, from?: HTMLElement | Document | DocumentFragment) : HTMLElement[];
}

function zenmu_createElement(zenmu: string){
    const tags = zenmu.split('(');
    let htmlElement : HTMLElement;
    //const reg = /(.*)#(.*).(.*)@(.*)/;
    tags.forEach(tag =>{
        //const split = tag.split(reg);
        let remainingString = tag;
        let tagName: string;
        let id: string;
        let attribs = {};
        let classes = [];
        const posOfAt = remainingString.indexOf('@');
        if(posOfAt > -1){
            const attribString = remainingString.substr(posOfAt);
            const nameValPairs = attribString.split('@');
            nameValPairs.forEach(nvp =>{
                const lhs_rhs = nvp.split(':');
                attribs[lhs_rhs[0]] = lhs_rhs[1];
            })
            remainingString = remainingString.substr(0, posOfAt);
        }
        const posOfDot = remainingString.indexOf('.');
        if(posOfDot > -1){
            const classString = remainingString.substr(posOfDot);
            const classes = classString.split('.');
            classes.forEach(classString =>{
                classes.push(classString);
            })
            remainingString = remainingString.substr(0, posOfDot);
        }
        const posOfHash = remainingString.indexOf('#');
        if(posOfHash > -1){
            id = remainingString.substr(posOfHash);
            remainingString = remainingString.substr(0, posOfHash);
        }
        tagName = remainingString || 'template';
        console.log({
            tagName:tagName,
            id:id,
            attribs:attribs,
            classes:classes
        });
    })
}

function zenmu(doc: Document | HTMLTemplateElement, cc: ICarbonCopy){
    cc.qsa('template', doc).forEach((template: HTMLTemplateElement) =>{
        cc.qsa('[wraps]', template.content ).forEach(wrapEl =>{
            const wrapsAtr = wrapEl.getAttribute('wraps');
            const domToInsert = zenmu_createElement(wrapsAtr);
            console.log(wrapsAtr);
        })               
    });
    return doc;
}