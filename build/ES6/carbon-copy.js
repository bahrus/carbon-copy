(function(){const disabled="disabled";function XtallatX(superClass){return class extends superClass{constructor(){super(...arguments);this._evCount={}}static get observedAttributes(){return[disabled]}get disabled(){return this._disabled}set disabled(val){this.attr(disabled,val,"")}attr(name,val,trueVal){if(val){this.setAttribute(name,trueVal||val)}else{this.removeAttribute(name)}}incAttr(name){const ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr(name,ec[name].toString())}attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}de(name,detail){const eventName=name+"-changed",newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}_upgradeProperties(props){props.forEach(prop=>{if(this.hasOwnProperty(prop)){let value=this[prop];delete this[prop];this[prop]=value}})}}}const from="from",copy="copy",noshadow="noshadow";class CC extends XtallatX(HTMLElement){constructor(){super(...arguments);this._originalChildren=[]}static get is(){return"c-c"}static get observedAttributes(){return[copy,from,noshadow]}get copy(){return this._copy}set copy(val){this.attr(copy,val,"")}get from(){return this._from}set from(val){this.attr(from,val)}get noshadow(){return this._noshadow}set noshadow(val){this.attr(noshadow,val,"")}attributeChangedCallback(name,oldValue,newValue){switch(name){case copy:this._copy=null!==newValue;break;case from:this._from=newValue;break;case noshadow:this._noshadow=null!==newValue;break;}this.onPropsChange()}connectedCallback(){this._upgradeProperties([copy,from]);this.childNodes.forEach(node=>{this._originalChildren.push(node.cloneNode(!0))});this.innerHTML="";this._connected=!0;this.onPropsChange()}getCEName(templateId){if(-1<templateId.indexOf("-"))return templateId;return"c-c-"+templateId.split("_").join("-")}defineProps(name,template,newClass,props,isObj){if(isObj){props.forEach(prop=>{Object.defineProperty(newClass.prototype,prop,{get:()=>{return this["_"+prop]},set:function(val){this["_"+prop];this.de(prop,{value:val})},enumerable:!0,configurable:!0})})}else{props.forEach(prop=>{Object.defineProperty(newClass.prototype,prop,{get:()=>{return this["_"+prop]},set:function(val){this.attr(prop,val)},enumerable:!0,configurable:!0})})}this.defineMethods(newClass,template)}defineMethods(newClass,template){newClass.prototype.attributeChangedCallback=function(name,oldVal,newVal){this["_"+name]=newVal;if(this.onPropsChange)this.onPropsChange(name,oldVal,newVal)};const prevSibling=template.previousElementSibling;if(!prevSibling||!prevSibling.dataset.methods)return;const evalScript=eval(prevSibling.innerHTML);for(const fn in evalScript){newClass.prototype[fn]=evalScript[fn]}}createCE(template){const ceName=this.getCEName(template.id),ds=template.dataset,strPropsAttr=ds.strProps,parsedStrProps=strPropsAttr?strPropsAttr.split(","):[],objPropsAttr=ds.objProps,parsedObjProps=objPropsAttr?objPropsAttr.split(","):[],allProps=parsedStrProps.concat(parsedObjProps);if(this._noshadow){class newClass extends XtallatX(HTMLElement){connectedCallback(){this._upgradeProperties(allProps);this._connected=!0;this.appendChild(template.content.cloneNode(!0))}static get observedAttributes(){return parsedStrProps}}this.defineProps(ceName,template,newClass,parsedStrProps,!1);this.defineProps(ceName,template,newClass,parsedObjProps,!0);customElements.define(ceName,newClass)}else{class newClass extends XtallatX(HTMLElement){constructor(){super();this.attachShadow({mode:"open"});this.shadowRoot.appendChild(template.content.cloneNode(!0))}connectedCallback(){this._connected=!0;this._upgradeProperties(allProps)}static get observedAttributes(){return parsedStrProps}}this.defineProps(ceName,template,newClass,parsedStrProps,!1);this.defineProps(ceName,template,newClass,parsedObjProps,!0);customElements.define(ceName,newClass)}}getHost(el,level,maxLevel){let parent=el;while(parent=parent.parentElement){if(11===parent.nodeType){const newLevel=level+1;if(newLevel===maxLevel)return parent.host;return this.getHost(parent.host,newLevel,maxLevel)}else if("HTML"===parent.tagName){return parent}}}onPropsChange(){if(!this._from||!this._connected||this.disabled)return;const fromTokens=this._from.split("/"),fromName=fromTokens[0]||fromTokens[1],newCEName=this.getCEName(fromName),prevId=this._prevId;this._prevId=newCEName;if(!customElements.get(newCEName)){if(!CC.registering[newCEName]){CC.registering[newCEName]=!0;let template;if(!fromTokens[0]){template=self[fromName]}else{const host=this.getHost(this,0,fromTokens.length);if(host){if(host.shadowRoot){template=host.shadowRoot.getElementById(fromName);if(!template)template=host.getElementById(fromName)}else{template=host.querySelector("#"+fromName)}}}if(template.hasAttribute("data-src")&&!template.hasAttribute("loaded")){const mutationObserver=new MutationObserver(()=>{this.createCE(template);mutationObserver.disconnect()});mutationObserver.observe(template,{attributeFilter:["loaded"],attributes:!0})}else{this.createCE(template)}}}if(!this._copy)return;customElements.whenDefined(newCEName).then(()=>{if(prevId){const prevEl=this.querySelector(prevId);if(prevEl)prevEl.style.display="none"}const prevEl=this.querySelector(newCEName);if(prevEl){prevEl.style.display="block"}else{const ce=document.createElement(newCEName);this._originalChildren.forEach(child=>{ce.appendChild(child.cloneNode(!0))});this.appendChild(ce)}})}}CC.registering={};if(!customElements.get(CC.is)){customElements.define("c-c",CC)}})();