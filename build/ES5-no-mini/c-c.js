import { XtallatX } from "./node_modules/xtal-latx/xtal-latx.js";
var from = 'from';
var copy = 'copy';
var noshadow = 'noshadow';
/**
* `carbon-copy`
* Dependency free web component that allows copying templates.
*
*
* @customElement
* @polymer
* @demo demo/index.html
*/

export var CC =
/*#__PURE__*/
function (_XtallatX) {
  babelHelpers.inherits(CC, _XtallatX);

  function CC() {
    var _this;

    babelHelpers.classCallCheck(this, CC);
    _this = babelHelpers.possibleConstructorReturn(this, (CC.__proto__ || Object.getPrototypeOf(CC)).apply(this, arguments));
    _this._originalChildren = [];
    return _this;
  }

  babelHelpers.createClass(CC, [{
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case copy:
          this._copy = newValue !== null;
          break;

        case from:
          //this._prevId = oldValue;
          this._from = newValue;
          break;

        case noshadow:
          this._noshadow = newValue !== null;
          break;
      }

      this.onPropsChange();
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;

      this._upgradeProperties([copy, from]); //this._originalChildren = this.childNodes;


      this.childNodes.forEach(function (node) {
        _this2._originalChildren.push(node.cloneNode(true));
      });
      this.innerHTML = '';
      this._connected = true;
      this.onPropsChange();
    }
  }, {
    key: "getCEName",
    value: function getCEName(templateId) {
      if (templateId.indexOf('-') > -1) return templateId;
      return 'c-c-' + templateId.split('_').join('-');
    }
  }, {
    key: "defineProps",
    value: function defineProps(name, template, newClass, props) {
      var _this3 = this;

      props.forEach(function (prop) {
        Object.defineProperty(newClass.prototype, prop, {
          get: function get() {
            return _this3['_' + prop];
          },
          set: function set(val) {
            this.attr(prop, val);
          },
          enumerable: true,
          configurable: true
        });
      });
      this.defineMethods(newClass, template);
      customElements.define(name, newClass);
    }
  }, {
    key: "defineMethods",
    value: function defineMethods(newClass, template) {
      newClass.prototype.attributeChangedCallback = function (name, oldVal, newVal) {
        this['_' + name] = newVal;
        if (this.onPropsChange) this.onPropsChange(name, oldVal, newVal);
      };

      var prevSibling = template.previousElementSibling;
      if (!prevSibling || !prevSibling.dataset.methods) return;
      var evalScript = eval(prevSibling.innerHTML);

      for (var fn in evalScript) {
        newClass.prototype[fn] = evalScript[fn];
      }
    }
  }, {
    key: "createCE",
    value: function createCE(template) {
      var ceName = this.getCEName(template.id);
      var propsAttrs = template.dataset.strProps;
      var parsedProps = propsAttrs ? propsAttrs.split(',') : [];

      if (this._noshadow) {
        var newClass =
        /*#__PURE__*/
        function (_XtallatX2) {
          babelHelpers.inherits(newClass, _XtallatX2);

          function newClass() {
            babelHelpers.classCallCheck(this, newClass);
            return babelHelpers.possibleConstructorReturn(this, (newClass.__proto__ || Object.getPrototypeOf(newClass)).apply(this, arguments));
          }

          babelHelpers.createClass(newClass, [{
            key: "connectedCallback",
            value: function connectedCallback() {
              this._upgradeProperties(parsedProps);

              this.appendChild(template.content.cloneNode(true));
            }
          }], [{
            key: "observedAttributes",
            get: function get() {
              return parsedProps;
            }
          }]);
          return newClass;
        }(XtallatX(HTMLElement));

        this.defineProps(ceName, template, newClass, parsedProps);
      } else {
        var _newClass =
        /*#__PURE__*/
        function (_XtallatX3) {
          babelHelpers.inherits(_newClass, _XtallatX3);

          function _newClass() {
            var _this4;

            babelHelpers.classCallCheck(this, _newClass);
            _this4 = babelHelpers.possibleConstructorReturn(this, (_newClass.__proto__ || Object.getPrototypeOf(_newClass)).call(this));

            _this4._upgradeProperties(parsedProps);

            _this4.attachShadow({
              mode: 'open'
            });

            _this4.shadowRoot.appendChild(template.content.cloneNode(true));

            return _this4;
          }

          babelHelpers.createClass(_newClass, null, [{
            key: "observedAttributes",
            get: function get() {
              return parsedProps;
            }
          }]);
          return _newClass;
        }(XtallatX(HTMLElement));

        this.defineProps(ceName, template, _newClass, parsedProps);
      }
    }
  }, {
    key: "getHost",
    value: function getHost(el, level, maxLevel) {
      var parent = el;

      while (parent = parent.parentElement) {
        if (parent.nodeType === 11) {
          var newLevel = level + 1;
          if (newLevel === maxLevel) return parent['host'];
          return this.getHost(parent['host'], newLevel, maxLevel);
        } else if (parent.tagName === 'HTML') {
          return parent;
        }
      }
    }
  }, {
    key: "onPropsChange",
    value: function onPropsChange() {
      var _this5 = this;

      if (!this._from || !this._connected || this.disabled) return; //this._alreadyRegistered = true;

      var fromTokens = this._from.split('/');

      var fromName = fromTokens[0] || fromTokens[1];
      var newCEName = this.getCEName(fromName);
      var prevId = this._prevId;
      this._prevId = newCEName;

      if (!customElements.get(newCEName)) {
        if (!CC.registering[newCEName]) {
          CC.registering[newCEName] = true;
          var template;

          if (!fromTokens[0]) {
            template = self[fromName];
          } else {
            //const path = this._from.split('/');
            //const id = path[path.length - 1];
            var host = this.getHost(this, 0, fromTokens.length);

            if (host) {
              if (host.shadowRoot) {
                template = host.shadowRoot.getElementById(fromName);
                if (!template) template = host.getElementById(fromName);
              } else {
                template = host.querySelector('#' + fromName);
              }
            }
          }

          if (template.hasAttribute('data-src') && !template.hasAttribute('loaded')) {
            var config = {
              attributeFilter: ['loaded'],
              attributes: true
            };
            var mutationObserver = new MutationObserver(function (mr) {
              _this5.createCE(template);

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
        //const name = newCEName;
        if (prevId) {
          var _prevEl = _this5.querySelector(prevId);

          if (_prevEl) _prevEl.style.display = 'none';
        }

        var prevEl = _this5.querySelector(newCEName);

        if (prevEl) {
          prevEl.style.display = 'block';
        } else {
          var ce = document.createElement(newCEName);

          _this5._originalChildren.forEach(function (child) {
            ce.appendChild(child.cloneNode(true));
          }); // while (this.childNodes.length > 0) {
          //     ce.appendChild(this.childNodes[0]);
          // }


          _this5.appendChild(ce);
        }
      });
    }
  }, {
    key: "copy",

    /**
     * @type{boolean}
     * Must be true / present for template copy to proceed.
     */
    get: function get() {
      return this._copy;
    },
    set: function set(val) {
      this.attr(copy, val, '');
    }
    /**
     * Id of template to import.
     * If from has no slash, the search for the matching template is done within the shadow DOM of the c-c element.
     * If from starts with "../" then the search is done one level up, etc.
     */

  }, {
    key: "from",
    get: function get() {
      return this._from;
    },
    set: function set(val) {
      this.attr(from, val);
    }
    /**
     * Don't use shadow DOM
     */

  }, {
    key: "noshadow",
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
      return [copy, from, noshadow];
    }
  }]);
  return CC;
}(XtallatX(HTMLElement));
CC.registering = {};

if (!customElements.get(CC.is)) {
  customElements.define('c-c', CC);
} //# sourceMappingURL=c-c.js.map