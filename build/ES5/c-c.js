import{XtallatX}from"./node_modules/xtal-latx/xtal-latx.js";var from="from",copy="copy",noshadow="noshadow";export var CC=function(_XtallatX){babelHelpers.inherits(CC,_XtallatX);function CC(){var _this;babelHelpers.classCallCheck(this,CC);_this=babelHelpers.possibleConstructorReturn(this,(CC.__proto__||Object.getPrototypeOf(CC)).apply(this,arguments));_this._originalChildren=[];return _this}babelHelpers.createClass(CC,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldValue,newValue){switch(name){case copy:this._copy=null!==newValue;break;case from:this._from=newValue;break;case noshadow:this._noshadow=null!==newValue;break;}this.onPropsChange()}},{key:"connectedCallback",value:function connectedCallback(){var _this2=this;this._upgradeProperties([copy,from]);this.childNodes.forEach(function(node){_this2._originalChildren.push(node.cloneNode(!0))});this.innerHTML="";this._connected=!0;this.onPropsChange()}},{key:"getCEName",value:function getCEName(templateId){if(-1<templateId.indexOf("-"))return templateId;return"c-c-"+templateId.split("_").join("-")}},{key:"defineProps",value:function defineProps(name,template,newClass,props,isObj){var _this3=this;if(isObj){props.forEach(function(prop){Object.defineProperty(newClass.prototype,prop,{get:function get(){return _this3["_"+prop]},set:function set(val){this["_"+prop];this.de(prop,{value:val})},enumerable:!0,configurable:!0})})}else{props.forEach(function(prop){Object.defineProperty(newClass.prototype,prop,{get:function get(){return _this3["_"+prop]},set:function set(val){this.attr(prop,val)},enumerable:!0,configurable:!0})})}this.defineMethods(newClass,template)}},{key:"defineMethods",value:function defineMethods(newClass,template){newClass.prototype.attributeChangedCallback=function(name,oldVal,newVal){this["_"+name]=newVal;if(this.onPropsChange)this.onPropsChange(name,oldVal,newVal)};var prevSibling=template.previousElementSibling;if(!prevSibling||!prevSibling.dataset.methods)return;var evalScript=eval(prevSibling.innerHTML);for(var fn in evalScript){newClass.prototype[fn]=evalScript[fn]}}},{key:"createCE",value:function createCE(template){var ceName=this.getCEName(template.id),ds=template.dataset,strPropsAttr=ds.strProps,parsedStrProps=strPropsAttr?strPropsAttr.split(","):[],objPropsAttr=ds.objProps,parsedObjProps=objPropsAttr?objPropsAttr.split(","):[],allProps=parsedStrProps.concat(parsedObjProps);if(this._noshadow){var newClass=function(_XtallatX2){babelHelpers.inherits(newClass,_XtallatX2);function newClass(){babelHelpers.classCallCheck(this,newClass);return babelHelpers.possibleConstructorReturn(this,(newClass.__proto__||Object.getPrototypeOf(newClass)).apply(this,arguments))}babelHelpers.createClass(newClass,[{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties(allProps);this._connected=!0;this.appendChild(template.content.cloneNode(!0))}}],[{key:"observedAttributes",get:function get(){return parsedStrProps}}]);return newClass}(XtallatX(HTMLElement));this.defineProps(ceName,template,newClass,parsedStrProps,!1);this.defineProps(ceName,template,newClass,parsedObjProps,!0);customElements.define(ceName,newClass)}else{var _newClass=function(_XtallatX3){babelHelpers.inherits(_newClass,_XtallatX3);function _newClass(){var _this4;babelHelpers.classCallCheck(this,_newClass);_this4=babelHelpers.possibleConstructorReturn(this,(_newClass.__proto__||Object.getPrototypeOf(_newClass)).call(this));_this4.attachShadow({mode:"open"});_this4.shadowRoot.appendChild(template.content.cloneNode(!0));return _this4}babelHelpers.createClass(_newClass,[{key:"connectedCallback",value:function connectedCallback(){this._connected=!0;this._upgradeProperties(allProps)}}],[{key:"observedAttributes",get:function get(){return parsedStrProps}}]);return _newClass}(XtallatX(HTMLElement));this.defineProps(ceName,template,_newClass,parsedStrProps,!1);this.defineProps(ceName,template,_newClass,parsedObjProps,!0);customElements.define(ceName,_newClass)}}},{key:"getHost",value:function getHost(el,level,maxLevel){var parent=el;while(parent=parent.parentElement){if(11===parent.nodeType){var newLevel=level+1;if(newLevel===maxLevel)return parent.host;return this.getHost(parent.host,newLevel,maxLevel)}else if("HTML"===parent.tagName){return parent}}}},{key:"onPropsChange",value:function onPropsChange(){var _this5=this;if(!this._from||!this._connected||this.disabled)return;var fromTokens=this._from.split("/"),fromName=fromTokens[0]||fromTokens[1],newCEName=this.getCEName(fromName),prevId=this._prevId;this._prevId=newCEName;if(!customElements.get(newCEName)){if(!CC.registering[newCEName]){CC.registering[newCEName]=!0;var template;if(!fromTokens[0]){template=self[fromName]}else{var host=this.getHost(this,0,fromTokens.length);if(host){if(host.shadowRoot){template=host.shadowRoot.getElementById(fromName);if(!template)template=host.getElementById(fromName)}else{template=host.querySelector("#"+fromName)}}}if(template.hasAttribute("data-src")&&!template.hasAttribute("loaded")){var mutationObserver=new MutationObserver(function(){_this5.createCE(template);mutationObserver.disconnect()});mutationObserver.observe(template,{attributeFilter:["loaded"],attributes:!0})}else{this.createCE(template)}}}if(!this._copy)return;customElements.whenDefined(newCEName).then(function(){if(prevId){var _prevEl=_this5.querySelector(prevId);if(_prevEl)_prevEl.style.display="none"}var prevEl=_this5.querySelector(newCEName);if(prevEl){prevEl.style.display="block"}else{var ce=document.createElement(newCEName);_this5._originalChildren.forEach(function(child){ce.appendChild(child.cloneNode(!0))});_this5.appendChild(ce)}})}},{key:"copy",get:function get(){return this._copy},set:function set(val){this.attr(copy,val,"")}},{key:"from",get:function get(){return this._from},set:function set(val){this.attr(from,val)}},{key:"noshadow",get:function get(){return this._noshadow},set:function set(val){this.attr(noshadow,val,"")}}],[{key:"is",get:function get(){return"c-c"}},{key:"observedAttributes",get:function get(){return[copy,from,noshadow]}}]);return CC}(XtallatX(HTMLElement));CC.registering={};if(!customElements.get(CC.is)){customElements.define("c-c",CC)}