//@ts-check
(function () {
  function define(custEl) {
    var tagName = custEl.is;

    if (customElements.get(tagName)) {
      console.warn('Already registered ' + tagName);
      return;
    }

    customElements.define(tagName, custEl);
  }

  var disabled = 'disabled';
  /**
   * Base class for many xtal- components
   * @param superClass
   */

  function XtallatX(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass) {
        babelHelpers.inherits(_class, _superClass);

        function _class() {
          var _this;

          babelHelpers.classCallCheck(this, _class);
          _this = babelHelpers.possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
          _this._evCount = {};
          return _this;
        }

        babelHelpers.createClass(_class, [{
          key: "attr",

          /**
           * Set attribute value.
           * @param name
           * @param val
           * @param trueVal String to set attribute if true.
           */
          value: function attr(name, val, trueVal) {
            var v = val ? 'set' : 'remove'; //verb

            this[v + 'Attribute'](name, trueVal || val);
          }
          /**
           * Turn number into string with even and odd values easy to query via css.
           * @param n
           */

        }, {
          key: "to$",
          value: function to$(n) {
            var mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
          }
          /**
           * Increment event count
           * @param name
           */

        }, {
          key: "incAttr",
          value: function incAttr(name) {
            var ec = this._evCount;

            if (name in ec) {
              ec[name]++;
            } else {
              ec[name] = 0;
            }

            this.attr('data-' + name, this.to$(ec[name]));
          }
        }, {
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
              case disabled:
                this._disabled = newVal !== null;
                break;
            }
          }
          /**
           * Dispatch Custom Event
           * @param name Name of event to dispatch (with -changed if asIs is false)
           * @param detail Information to be passed with the event
           * @param asIs If true, don't append event name with '-changed'
           */

        }, {
          key: "de",
          value: function de(name, detail, asIs) {
            var eventName = name + (asIs ? '' : '-changed');
            var newEvent = new CustomEvent(eventName, {
              detail: detail,
              bubbles: true,
              composed: false
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
          }
          /**
           * Needed for asynchronous loading
           * @param props Array of property names to "upgrade", without losing value set while element was Unknown
           */

        }, {
          key: "_upgradeProperties",
          value: function _upgradeProperties(props) {
            var _this2 = this;

            props.forEach(function (prop) {
              if (_this2.hasOwnProperty(prop)) {
                var value = _this2[prop];
                delete _this2[prop];
                _this2[prop] = value;
              }
            });
          }
        }, {
          key: "disabled",

          /**
           * Any component that emits events should not do so ef it is disabled.
           * Note that this is not enforced, but the disabled property is made available.
           * Users of this mix-in sure ensure it doesn't call "de" if this property is set to true.
           */
          get: function get() {
            return this._disabled;
          },
          set: function set(val) {
            this.attr(disabled, val, '');
          }
        }], [{
          key: "observedAttributes",
          get: function get() {
            return [disabled];
          }
        }]);
        return _class;
      }(superClass)
    );
  }

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

  var BCC =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(BCC, _XtallatX);

    function BCC() {
      var _this3;

      babelHelpers.classCallCheck(this, BCC);
      _this3 = babelHelpers.possibleConstructorReturn(this, (BCC.__proto__ || Object.getPrototypeOf(BCC)).apply(this, arguments));
      _this3._origC = []; //original Children

      /**
       * original style
       */

      _this3._origS = '';
      return _this3;
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

  define(BCC);
})();