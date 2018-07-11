//@ts-check
(function () {
  var disabled = 'disabled';

  function XtallatX(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass) {
        babelHelpers.inherits(_class, _superClass);

        function _class() {
          babelHelpers.classCallCheck(this, _class);
          return babelHelpers.possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        babelHelpers.createClass(_class, [{
          key: "attr",
          value: function attr(name, val, trueVal) {
            if (val) {
              this.setAttribute(name, trueVal || val);
            } else {
              this.removeAttribute(name);
            }
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
        }, {
          key: "de",
          value: function de(name, detail) {
            var newEvent = new CustomEvent(name + '-changed', {
              detail: detail,
              bubbles: true,
              composed: false
            });
            this.dispatchEvent(newEvent);
            return newEvent;
          }
        }, {
          key: "_upgradeProperties",
          value: function _upgradeProperties(props) {
            var _this = this;

            props.forEach(function (prop) {
              if (_this.hasOwnProperty(prop)) {
                var value = _this[prop];
                delete _this[prop];
                _this[prop] = value;
              }
            });
          }
        }, {
          key: "disabled",
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
  } //# sourceMappingURL=xtal-latx.js.map


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

  var CC =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(CC, _XtallatX);

    function CC() {
      var _this2;

      babelHelpers.classCallCheck(this, CC);
      _this2 = babelHelpers.possibleConstructorReturn(this, (CC.__proto__ || Object.getPrototypeOf(CC)).apply(this, arguments));
      _this2._originalChildren = [];
      return _this2;
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
        var _this3 = this;

        this._upgradeProperties([copy, from]); //this._originalChildren = this.childNodes;


        this.childNodes.forEach(function (node) {
          _this3._originalChildren.push(node.cloneNode(true));
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
        var _this4 = this;

        props.forEach(function (prop) {
          Object.defineProperty(newClass.prototype, prop, {
            get: function get() {
              return _this4['_' + prop];
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
              var _this5;

              babelHelpers.classCallCheck(this, _newClass);
              _this5 = babelHelpers.possibleConstructorReturn(this, (_newClass.__proto__ || Object.getPrototypeOf(_newClass)).call(this));

              _this5._upgradeProperties(parsedProps);

              _this5.attachShadow({
                mode: 'open'
              });

              _this5.shadowRoot.appendChild(template.content.cloneNode(true));

              return _this5;
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
        var _this6 = this;

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

            if (template.dataset.src && !template.hasAttribute('loaded')) {
              var config = {
                attributeFilter: ['loaded'],
                attributes: true
              };
              var mutationObserver = new MutationObserver(function (mr) {
                _this6.createCE(template);

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
            var _prevEl = _this6.querySelector(prevId);

            if (_prevEl) _prevEl.style.display = 'none';
          }

          var prevEl = _this6.querySelector(newCEName);

          if (prevEl) {
            prevEl.style.display = 'block';
          } else {
            var ce = document.createElement(newCEName);

            _this6._originalChildren.forEach(function (child) {
              ce.appendChild(child.cloneNode(true));
            }); // while (this.childNodes.length > 0) {
            //     ce.appendChild(this.childNodes[0]);
            // }


            _this6.appendChild(ce);
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

})();