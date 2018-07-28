import { XtallatX } from "./node_modules/xtal-latx/xtal-latx.js";
import { BCC } from './b-c-c.js';
/**
* `c-c`
* Dependency free web component that allows copying templates.
*
*
* @customElement
* @polymer
* @demo demo/index.html
*/

export var CC =
/*#__PURE__*/
function (_BCC) {
  babelHelpers.inherits(CC, _BCC);

  function CC() {
    babelHelpers.classCallCheck(this, CC);
    return babelHelpers.possibleConstructorReturn(this, (CC.__proto__ || Object.getPrototypeOf(CC)).apply(this, arguments));
  }

  babelHelpers.createClass(CC, [{
    key: "defineProps",
    value: function defineProps(name, template, newClass, props, isObj) {
      if (isObj) {
        props.forEach(function (prop) {
          Object.defineProperty(newClass.prototype, prop, {
            get: function get() {
              return this['_' + prop];
            },
            set: function set(val) {
              this['_' + prop];
              this.de(prop, {
                value: val
              });
            },
            enumerable: true,
            configurable: true
          });
        });
      } else {
        props.forEach(function (prop) {
          Object.defineProperty(newClass.prototype, prop, {
            get: function get() {
              return this['_' + prop];
            },
            set: function set(val) {
              this.attr(prop, val);
            },
            enumerable: true,
            configurable: true
          });
        });
      }
    }
  }, {
    key: "defineMethods",
    value: function defineMethods(newClass, template) {
      var prevSibling = template.previousElementSibling;
      if (!prevSibling || !prevSibling.dataset.methods) return;
      var evalScript = eval(prevSibling.innerHTML);

      for (var fn in evalScript) {
        newClass.prototype[fn] = evalScript[fn];
      }
    }
  }, {
    key: "addAttributeChangeCallback",
    value: function addAttributeChangeCallback(newClass) {
      newClass.prototype.attributeChangedCallback = function (name, oldVal, newVal) {
        var val = newVal;
        var isObj = false;
        var objProps = this.constructor.objProps;

        if (objProps && objProps.indexOf(name) > -1) {
          val = JSON.parse(newVal);
          isObj = true;
        }

        this['_' + name] = val;
        this.de(name, {
          value: val
        });
        if (this.onPropsChange) this.onPropsChange(name, oldVal, val);
      };
    }
  }, {
    key: "createCE",
    value: function createCE(template) {
      var ceName = this.getCEName(template.id); //if(customElements.get(ceName)) return;

      var ds = template.dataset;
      var strPropsAttr = ds.strProps;
      var parsedStrProps = strPropsAttr ? strPropsAttr.split(',') : [];
      var objPropsAttr = ds.objProps;
      var parsedObjProps = objPropsAttr ? objPropsAttr.split(',') : [];
      var allProps = parsedStrProps.concat(parsedObjProps);

      if (this._noshadow) {
        var newClass =
        /*#__PURE__*/
        function (_XtallatX) {
          babelHelpers.inherits(newClass, _XtallatX);

          function newClass() {
            babelHelpers.classCallCheck(this, newClass);
            return babelHelpers.possibleConstructorReturn(this, (newClass.__proto__ || Object.getPrototypeOf(newClass)).apply(this, arguments));
          }

          babelHelpers.createClass(newClass, [{
            key: "connectedCallback",
            value: function connectedCallback() {
              this._upgradeProperties(allProps);

              this._connected = true;
              this.appendChild(template.content.cloneNode(true));
            }
          }], [{
            key: "getObjProps",
            value: function getObjProps() {
              return parsedObjProps;
            }
          }, {
            key: "observedAttributes",
            get: function get() {
              return allProps;
            }
          }]);
          return newClass;
        }(XtallatX(HTMLElement));

        this.defineProps(ceName, template, newClass, parsedStrProps, false);
        this.defineProps(ceName, template, newClass, parsedObjProps, true);
        customElements.define(ceName, newClass);
      } else {
        var _newClass =
        /*#__PURE__*/
        function (_XtallatX2) {
          babelHelpers.inherits(_newClass, _XtallatX2);
          babelHelpers.createClass(_newClass, null, [{
            key: "objProps",
            get: function get() {
              return parsedObjProps;
            }
          }]);

          function _newClass() {
            var _this;

            babelHelpers.classCallCheck(this, _newClass);
            _this = babelHelpers.possibleConstructorReturn(this, (_newClass.__proto__ || Object.getPrototypeOf(_newClass)).call(this));

            _this.attachShadow({
              mode: 'open'
            });

            _this.shadowRoot.appendChild(template.content.cloneNode(true));

            return _this;
          }

          babelHelpers.createClass(_newClass, [{
            key: "connectedCallback",
            value: function connectedCallback() {
              this._connected = true;

              this._upgradeProperties(allProps);
            }
          }], [{
            key: "observedAttributes",
            get: function get() {
              return allProps;
            }
          }]);
          return _newClass;
        }(XtallatX(HTMLElement));

        this.defineProps(ceName, template, _newClass, parsedStrProps, false);
        this.defineProps(ceName, template, _newClass, parsedObjProps, true);
        this.defineMethods(_newClass, template);
        this.addAttributeChangeCallback(_newClass);
        customElements.define(ceName, _newClass);
      }
    }
  }], [{
    key: "is",
    get: function get() {
      return 'c-c';
    }
  }]);
  return CC;
}(BCC);

if (!customElements.get(CC.is)) {
  customElements.define(CC.is, CC);
} //# sourceMappingURL=c-c.js.map