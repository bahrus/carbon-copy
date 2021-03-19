[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/carbon-copy)

<a href="https://nodei.co/npm/carbon-copy/"><img src="https://nodei.co/npm/carbon-copy.png"></a>

b-c-c size:

<img src="http://img.badgesize.io/https://unpkg.com/carbon-copy@0.1.43/build/ES6/b-c-c.iife.js?compression=gzip"/>

c-c size:

<img src="http://img.badgesize.io/https://unpkg.com/carbon-copy@0.1.43/build/ES6/carbon-copy.js?compression=gzip"/>

# \<carbon-copy\>

[Full Screen Demo](https://rawgit.com/bahrus/carbon-copy/master/demo/index.html)

Note that there are other client-side include web components you may want to compare this one with -- e.g. github's [include-fragment-element](https://github.com/github/include-fragment-element) and [Juicy's juicy-html](https://www.webcomponents.org/element/Juicy/juicy-html) or [xtal-fetch](https://www.webcomponents.org/element/bahrus/xtal-fetch) if carbon-copy doesn't meet your needs.

Copy a template inside a DOM node. 

For basic functionality, use the b-c-c.js (or b-c-c.iife.js), element name:  b-c-c.  It just clones the source template into the shadowDOM or innerHTML of the element (depending on the value of the noshadow attribute).

For more extended functionality, use element c-c, which is defined by file c-c.js.  The most important difference is that c-c creates a custom element on the fly.  carbon-copy.js is an iife version of (b-)c-c.  

Syntax:

```html
<template id="no-matter">No matter what we
    <slot name="verb1"></slot> (no matter what we <slot name="verb2"></slot>)
</template>
...
<b-c-c copy from="/no-matter">
    <span slot="verb1">
        do
    </span>
    <span slot="verb2">
        say
    </span>
</b-c-c>
```

Note the use of the attribute "copy".  If this is present, you can modify the value of "from" dynamically, and it will clone the contents of the referenced template (based on id).  

If the attribute "from" changes, b-c-c will blow away what was there before, and clone in the new template.  Removing the "from" attribute / property will hide the b-c-c element.  c-c, on the other hand, will preserve the existing inner (Shadow) DOM, and makes it get hidden via display:none.  If the value of "/from" reverts back, that original DOM will be reshown (and the last template hidden).  c-c can be used, combined with templ-mount, to provide an alternative to Polymer's iron-pages, with no legacy dependencies.

Templates can come from outside any shadow DOM if the value of "from" starts with a slash.  If "from" starts with "./", the search for the matching template is done within the shadow DOM of the (b-)c-c element (or outside any ShadowDOM if the (b-)c-c element is outside any ShadowDOM).  If from starts with "../" then the search is done one level up, etc.

By default, b-c-c will copy in the referenced template into a Shadow DOM snippet.  However, if you prefer a copy straight into innerHTML, add attribute / property "noshadow."  Doing so will, of course, eliminate the slot mechanism from functioning.  Hopefully, if template instantiation becomes a thing, that will provide an alternative for this scenario. 

b-c-c and c-c can also be used in a kind of "Reverse Polish Notation" version of Polymer's [dom-if](https://polymer-library.polymer-project.org/2.0/docs/devguide/templates#dom-if).


## Codeless Web Components [TODO]

Unlike b-c-c, c-c actually generates a custom (web) component on the fly, based on the id of the template.  If the template is a simple word, like "mytemplate" the generated custom element will have name c-c-mytemplate.  If the id has a dash in it, it will create a custom element with that name (so id's are limited to what is allowed in terms of custom element names).   

So here are the steps to create a web component using c-c:

Step 1.  Define a template:

```html
<template id="hello-world">
    Hello, world
</template>
```

Step 2.  Register the web component

```html
<c-c from="/hello-world"></c-c>
```

Step 3.  Add your web component to the page

```html
<body>
  ...
    <hello-world></hello-world>
  ...
</body>
```

Step 4.  Stare into the abyss. 

### Adding string/numeric/bool properties to your declarative web component [TODO]

The template can specify a list of string properties to add to the automatically generated web component:

```html
<template id="pow" data-str-props="name,rank,serial_number" data-num-props="age,weight" data-bool-props="mia">
    <div>
        <slot name="subjectIs"></slot> 
    </div>
</template>
```

These properties can be read via attributes on the c-c-pow element instances, or passed in as properties.  They will reflect to [custom psuedo states](https://www.chromestatus.com/feature/6537562418053120) when the browser allows it.


### Bind to the properties [TODO]

c-c (or carbon-copy) supports binding to the UI using Github's [Template-Parts library](https://github.com/github/template-parts/).

### Attaching event handlers

Use [on-to-me](https://github.com/bahrus/on-to-me) [or](https://github.com/bahrus/pass-down) [other](https://github.com/bahrus/p-et-alia) declarative vocabulary libraries.

### Adding Object Properties [TODO]

```html
<template id="beautiful" data-obj-props="d,e">
    <div>
        <slot name="subjectIs"></slot> beautiful
    </div>
</template>
```

Object properties also observe attribute changes with the same name as the property, and also calls onPropsChange.

If you set the attribute value for an object property, it will assume the string is JSON (surronded by single quotes), and will parse it.

Changes to object properties fire events with the name "[name of prop]-changed".

