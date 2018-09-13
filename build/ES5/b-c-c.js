import { XtallatX } from "./node_modules/xtal-latx/xtal-latx.js";
import { define } from "./node_modules/xtal-latx/define.js";
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
    /**
     * original style
     */

    _this._origS = '';
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
          this.tFrom(oldValue, newValue);
          break;

        case noshadow:
          this._noshadow = newValue !== null;
          break;
      }

      this.opc();
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      this._upgradeProperties([copy, from, noshadow]); //this._originalChildren = this.childNodes;


      this._connected = true;
      this.opc();
    }
  }, {
    key: "getHost",
    value: function getHost(el, level, maxLevel) {
      var parent = el;

      while (parent = parent.parentNode) {
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
    key: "getSrcTempl",
    value: function getSrcTempl() {
      var fromTokens = this._from.split('/');

      var fromName = fromTokens[0] || fromTokens[1];
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

      if (!template) throw '404: ' + fromName;
      return template;
    } //_prevId!: string;

  }, {
    key: "remAll",
    value: function remAll(root) {
      if (root === null) return false;

      while (root.firstChild) {
        root.removeChild(root.firstChild);
      }

      return true;
    }
    /**
     * toggle From
     * @param oldVal
     * @param newVal
     */

  }, {
    key: "tFrom",
    value: function tFrom(oldVal, newVal) {
      if (oldVal) {
        if (!newVal) {
          this._origS = this.style.display;
          this.style.display = 'none';
        }
      } else if (newVal && this.style.display === 'none') {
        this.style.display = this._origS;
      }
    }
  }, {
    key: "opc",
    value: function opc() {
      if (!this._from || !this._connected || this.disabled || !this._copy) return;
      var template = this.getSrcTempl();
      var clone = template.content.cloneNode(true);

      if (this._noshadow) {
        this.remAll(this);
        this.appendChild(clone);
      } else {
        if (!this.remAll(this.shadowRoot)) this.attachShadow({
          mode: 'open'
        });
        this.shadowRoot.appendChild(clone);
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
define(BCC); //# sourceMappingURL=b-c-c.js.map