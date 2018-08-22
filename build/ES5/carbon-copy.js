//@ts-check
(function () {
  var disabled = 'disabled';

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
          value: function attr(name, val, trueVal) {
            var setOrRemove = val ? 'set' : 'remove';
            this[setOrRemove + 'Attribute'](name, trueVal || val);
          }
        }, {
          key: "to$",
          value: function to$(number) {
            var mod = number % 2;
            return (number - mod) / 2 + '-' + mod;
          }
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
        }, {
          key: "de",
          value: function de(name, detail) {
            var eventName = name + '-changed';
            var newEvent = new CustomEvent(eventName, {
              detail: detail,
              bubbles: true,
              composed: false
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
          }
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
      _this3._originalChildren = [];
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
        var _this4 = this;

        this._upgradeProperties([copy, from]); //this._originalChildren = this.childNodes;


        this.childNodes.forEach(function (node) {
          _this4._originalChildren.push(node.cloneNode(true));
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

            if (!template) throw '404: ' + fromName;

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
              var _this6;

              babelHelpers.classCallCheck(this, _newClass);
              _this6 = babelHelpers.possibleConstructorReturn(this, (_newClass.__proto__ || Object.getPrototypeOf(_newClass)).call(this));

              _this6.attachShadow({
                mode: 'open'
              }).appendChild(template.content.cloneNode(true));

              return _this6;
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
  }
  /**
  * `c-c`
  * Dependency free web component that allows copying templates.
  *
  *
  * @customElement
  * @polymer
  * @demo demo/index.html
  */


  var CC =
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
          function (_XtallatX2) {
            babelHelpers.inherits(newClass, _XtallatX2);

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
          var _newClass2 =
          /*#__PURE__*/
          function (_XtallatX3) {
            babelHelpers.inherits(_newClass2, _XtallatX3);
            babelHelpers.createClass(_newClass2, null, [{
              key: "objProps",
              get: function get() {
                return parsedObjProps;
              }
            }]);

            function _newClass2() {
              var _this7;

              babelHelpers.classCallCheck(this, _newClass2);
              _this7 = babelHelpers.possibleConstructorReturn(this, (_newClass2.__proto__ || Object.getPrototypeOf(_newClass2)).call(this));

              _this7.attachShadow({
                mode: 'open'
              });

              _this7.shadowRoot.appendChild(template.content.cloneNode(true));

              return _this7;
            }

            babelHelpers.createClass(_newClass2, [{
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
            return _newClass2;
          }(XtallatX(HTMLElement));

          this.defineProps(ceName, template, _newClass2, parsedStrProps, false);
          this.defineProps(ceName, template, _newClass2, parsedObjProps, true);
          this.defineMethods(_newClass2, template);
          this.addAttributeChangeCallback(_newClass2);
          customElements.define(ceName, _newClass2);
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
  }
})();