import { XtallatX } from "./node_modules/xtal-latx/xtal-latx.js";
var from = 'from';
var copy = 'copy';
var noshadow = 'noshadow';
/**
* `b-c-c`
* Dependency free web component that allows basic copying of templates.
*
*
* @customElement
* @polymer
* @demo demo/index.html
*/

export var BCC =
/*#__PURE__*/
function (_XtallatX) {
  babelHelpers.inherits(BCC, _XtallatX);

  function BCC() {
    var _this;

    babelHelpers.classCallCheck(this, BCC);
    _this = babelHelpers.possibleConstructorReturn(this, (BCC.__proto__ || Object.getPrototypeOf(BCC)).apply(this, arguments));
    _this._originalChildren = [];
    return _this;
  }

  babelHelpers.createClass(BCC, [{
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

      return null;
    }
  }, {
    key: "onPropsChange",
    value: function onPropsChange() {
      var _this3 = this;

      if (!this._from || !this._connected || this.disabled) return; //this._alreadyRegistered = true;

      var fromTokens = this._from.split('/');

      var fromName = fromTokens[0] || fromTokens[1];
      var newCEName = this.getCEName(fromName);
      var prevId = this._prevId;
      this._prevId = newCEName;

      if (!customElements.get(newCEName)) {
        if (!BCC.registering[newCEName]) {
          BCC.registering[newCEName] = true;
          var template = null;

          if (!fromTokens[0]) {
            template = self[fromName];
          } else {
            //const path = this._from.split('/');
            //const id = path[path.length - 1];
            var host = this.getHost(this, 0, fromTokens.length);

            if (host) {
              var cssSelector = '#' + fromName;

              if (host.shadowRoot) {
                template = host.shadowRoot.querySelector(cssSelector);
              }

              if (!template) template = host.querySelector(cssSelector);
            }
          }

          if (!template) throw '404';

          if (template.hasAttribute('data-src') && !template.hasAttribute('loaded')) {
            var config = {
              attributeFilter: ['loaded'],
              attributes: true
            };
            var mutationObserver = new MutationObserver(function (mr) {
              _this3.createCE(template);

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
          var _prevEl = _this3.querySelector(prevId);

          if (_prevEl) _prevEl.style.display = 'none';
        }

        var prevEl = _this3.querySelector(newCEName);

        if (prevEl) {
          prevEl.style.display = 'block';
        } else {
          var ce = document.createElement(newCEName);

          _this3._originalChildren.forEach(function (child) {
            ce.appendChild(child.cloneNode(true));
          }); // while (this.childNodes.length > 0) {
          //     ce.appendChild(this.childNodes[0]);
          // }


          _this3.appendChild(ce);
        }
      });
    }
  }, {
    key: "createCE",
    value: function createCE(template) {
      var ceName = this.getCEName(template.id);

      if (this._noshadow) {
        var newClass =
        /*#__PURE__*/
        function (_HTMLElement) {
          babelHelpers.inherits(newClass, _HTMLElement);

          function newClass() {
            babelHelpers.classCallCheck(this, newClass);
            return babelHelpers.possibleConstructorReturn(this, (newClass.__proto__ || Object.getPrototypeOf(newClass)).apply(this, arguments));
          }

          babelHelpers.createClass(newClass, [{
            key: "connectedCallback",
            value: function connectedCallback() {
              this.appendChild(template.content.cloneNode(true));
            }
          }]);
          return newClass;
        }(HTMLElement);

        customElements.define(ceName, newClass);
      } else {
        var _newClass =
        /*#__PURE__*/
        function (_HTMLElement2) {
          babelHelpers.inherits(_newClass, _HTMLElement2);

          function _newClass() {
            var _this4;

            babelHelpers.classCallCheck(this, _newClass);
            _this4 = babelHelpers.possibleConstructorReturn(this, (_newClass.__proto__ || Object.getPrototypeOf(_newClass)).call(this));

            _this4.attachShadow({
              mode: 'open'
            }).appendChild(template.content.cloneNode(true));

            return _this4;
          }

          return _newClass;
        }(HTMLElement);

        customElements.define(ceName, _newClass);
      }
    }
  }, {
    key: "from",

    /**
     * Id of template to import.
     * If from has no slash, the search for the matching template is done within the shadow DOM of the c-c element.
     * If from starts with "../" then the search is done one level up, etc.
     */
    get: function get() {
      return this._from;
    },
    set: function set(val) {
      this.attr(from, val);
    }
    /**
     * @type{boolean}
     * Must be true / present for template copy to proceed.
     */

  }, {
    key: "copy",
    get: function get() {
      return this._copy;
    },
    set: function set(val) {
      this.attr(copy, val, '');
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
      return 'b-c-c';
    }
  }, {
    key: "observedAttributes",
    get: function get() {
      return [copy, from, noshadow];
    }
  }]);
  return BCC;
}(XtallatX(HTMLElement));
BCC.registering = {};

if (!customElements.get(BCC.is)) {
  customElements.define(BCC.is, BCC);
} //# sourceMappingURL=b-c-c.js.map