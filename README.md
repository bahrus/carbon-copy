[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/carbon-copy)

<a href="https://nodei.co/npm/carbon-copy/"><img src="https://nodei.co/npm/carbon-copy.png"></a>

# \<carbon-copy\>

Note that there are other client-side include web components you may want to compare this one with -- e.g. github's [include-fragment-element](https://github.com/github/include-fragment-element) and [Juicy's juicy-html](https://www.webcomponents.org/element/Juicy/juicy-html) or [xtal-fetch](https://www.webcomponents.org/element/bahrus/xtal-fetch) if carbon-copy doesn't meet your needs.

Copy a template inside a DOM node.  ~1.7kb (minified/gzipped).


Syntax:

```html
<template id="no-matter">No matter what we
    <slot name="verb1"></slot> (no matter what we <slot name="verb2"></slot>)
</template>
...
<c-c copy from="/no-matter">
    <span slot="verb1">
        do
    </span>
    <span slot="verb2">
        say
    </span>
</c-c>
```

Templates can come from outside any shadow DOM if the value of "from" starts with a slash.  If "from" has no slash, the search for the matching template is done within the shadow DOM of the c-c element.  If from starts with "../" then the search is done one level up, etc.

c-c can be used, combined with templ-mount, to provide an alternative to iron-pages.

It can also be used in a kind of "Reverse Polish Notation" version of Polymer's dom-if.

## Codeless Web Components

c-c generates a custom element on the fly, with name c-c-[from].  It uses shadow DOM by default, but you can specify not to use shadow DOM with attribute "noshadow."  Doing so will prevent the slot mechanism from working.  Hopefully, if template instantion becomes a thing, it will provide an alternative for this scenario.

### String properties

The template can specify a list of string properties to add to the automatically generated web component:

```html
<template id="pow" data-str-props="name,rank,serial_number">
    <div>
        <slot name="subjectIs"></slot> 
    </div>
</template>
```

If the web component's property is set, it will reflect to an attribute with the same name.

### Attaching methods to the generated custom element

```html
      <script type="module ish" data-methods="true">
        ({
          fn: function(){
            console.log(this);
            return this;
          }
        })
      </script>
      <template id="beautiful" data-str-props="a,b,c">
        <div>
          <slot name="subjectIs"></slot> beautiful</div>
      </template>
```

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
