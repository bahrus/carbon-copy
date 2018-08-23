import { XtallatX } from "./node_modules/xtal-latx/xtal-latx.js";
import { BCC } from './b-c-c.js';
import { define } from "./node_modules/xtal-latx/define.js";
var noshadow = 'noshadow';
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
    key: "getCEName",
    value: function getCEName(templateId) {
      if (templateId.indexOf('-') > -1) return templateId;
      return 'c-c-' + templateId.split('_').join('-');
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case noshadow:
          this._noshadow = newValue !== null;
          break;
      }

      babelHelpers.get(CC.prototype.__proto__ || Object.getPrototypeOf(CC.prototype), "attributeChangedCallback", this).call(this, name, oldValue, newValue);
    }
  }, {
    key: "dP",
    value: function dP(name, template, newClass, props, isObj) {
      if (isObj) {
        props.forEach(function (prop) {
          Object.defineProperty(newClass.prototype, prop, {
            get: function get() {
              return this['_' + prop];
            },
            set: function set(val) {
              this['_' + prop] = val;
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
    key: "dM",
    value: function dM(newClass, template) {
      var prevSibling = template.previousElementSibling;
      if (!prevSibling || !prevSibling.dataset.methods) return;
      var evalScript = eval(prevSibling.innerHTML);

      for (var fn in evalScript) {
        newClass.prototype[fn] = evalScript[fn];
      }
    }
  }, {
    key: "aacc",
    value: function aacc(newClass) {
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
    key: "gn",
    value: function gn() {
      var fromTokens = this._from.split('/');

      var fromName = fromTokens[0] || fromTokens[1];
      return this.getCEName(fromName);
    }
  }, {
    key: "sac",
    value: function sac() {
      var t = this;
      var activeCEName = this.gn();

      for (var i = 0, ii = t.children.length; i < ii; i++) {
        var child = t.children[i];

        if (child.tagName.toLowerCase() === activeCEName) {
          child.style.display = child.cc_orgD || 'block';
        } else {
          child.cc_orgD = child.style.display;
          child.style.display = 'none';
        }
      }
    }
  }, {
    key: "onPropsChange",
    value: function onPropsChange() {
      var _this = this;

      if (!this._from || !this._connected || this.disabled) return; //this._alreadyRegistered = true;

      var newCEName = this.gn();

      if (!customElements.get(newCEName)) {
        if (!CC.registering[newCEName]) {
          CC.registering[newCEName] = true;
          var template = this.getSrcTempl();

          if (template.hasAttribute('data-src') && !template.hasAttribute('loaded')) {
            var config = {
              attributeFilter: ['loaded'],
              attributes: true
            };
            var mutationObserver = new MutationObserver(function (mr) {
              _this.createCE(template);

              mutationObserver.disconnect();
            });
            mutationObserver.observe(template, config);
          } else {
            this.createCE(template);
          }
        }
      }

      if (!this._copy) return;
      customElements.whenDefined(newCEName).then(function () {
        var newEl = _this.querySelector(newCEName);

        if (!newEl) {
          var ce = document.createElement(newCEName);

          _this._originalChildren.forEach(function (child) {
            ce.appendChild(child.cloneNode(true));
          });

          _this.appendChild(ce);
        }

        _this.sac();
      });
    }
  }, {
    key: "createCE",
    value: function createCE(template) {
      var ceName = this.getCEName(template.id);
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

        this.dP(ceName, template, newClass, parsedStrProps, false);
        this.dP(ceName, template, newClass, parsedObjProps, true);
        define(newClass);
      } else {
        var _newClass =
        /*#__PURE__*/
        function (_XtallatX2) {
          babelHelpers.inherits(_newClass, _XtallatX2);
          babelHelpers.createClass(_newClass, null, [{
            key: "is",
            get: function get() {
              return ceName;
            }
          }, {
            key: "objProps",
            get: function get() {
              return parsedObjProps;
            }
          }]);

          function _newClass() {
            var _this2;

            babelHelpers.classCallCheck(this, _newClass);
            _this2 = babelHelpers.possibleConstructorReturn(this, (_newClass.__proto__ || Object.getPrototypeOf(_newClass)).call(this));

            _this2.attachShadow({
              mode: 'open'
            });

            _this2.shadowRoot.appendChild(template.content.cloneNode(true));

            return _this2;
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

        this.dP(ceName, template, _newClass, parsedStrProps, false);
        this.dP(ceName, template, _newClass, parsedObjProps, true);
        this.dM(_newClass, template);
        this.aacc(_newClass);
        define(_newClass);
      }
    }
  }, {
    key: "noshadow",

    /**
     * Don't use shadow DOM
     */
    get: function get() {
      return this._noshadow;
    },
    set: function set(val) {
      this.attr(noshadow, val, '');
    }
  }], [{
    key: "is",
    get: function get() {
      return 'c-c';
    }
  }, {
    key: "observedAttributes",
    get: function get() {
      return babelHelpers.get(CC.__proto__ || Object.getPrototypeOf(CC), "observedAttributes", this).concat([noshadow]);
    }
  }]);
  return CC;
}(BCC);
CC.registering = {};
define(CC); //# sourceMappingURL=c-c.js.map