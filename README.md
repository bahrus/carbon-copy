[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/carbon-copy)

<a href="https://nodei.co/npm/carbon-copy/"><img src="https://nodei.co/npm/carbon-copy.png"></a>

<img src="http://img.badgesize.io/https://unpkg.com/carbon-copy@0.1.37/build/ES6/carbon-copy.js?compression=gzip">

# \<carbon-copy\>

[Full Screen Demo](https://rawgit.com/bahrus/carbon-copy/master/demo/index.html)

Note that there are other client-side include web components you may want to compare this one with -- e.g. github's [include-fragment-element](https://github.com/github/include-fragment-element) and [Juicy's juicy-html](https://www.webcomponents.org/element/Juicy/juicy-html) or [xtal-fetch](https://www.webcomponents.org/element/bahrus/xtal-fetch) if carbon-copy doesn't meet your needs.

Copy a template inside a DOM node. 

For basic functionality, use the b-c-c.js (or b-c-c.iife.js), element name:  b-c-c  It is ~1.25 kb minified and gzipped.  It just clones the source template into the shadowDOM or innerHTML of the element (depending on the value of the noshadow attribute).

For more extended functionality, use element c-c, which is defined by file c-c.js.  The most important difference is that c-c creates a custom element on the fly.  carbon-copy.js is an iife version of (b-)c-c.  It is ~2.2 kb minifed and gzipped.

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

If the attribute "from" changes, b-c-c will blow away what was there before, and clone in the new template.  c-c, on the other hand, will preserve the existing inner (Shadow) DOM, and makes it get hidden via display:none.  If the value of "/from" reverts back, that original DOM will be reshown (and the last template hidden).  c-c can be used, combined with templ-mount, to provide an alternative to Polymer's iron-pages, with no legacy dependencies.

Templates can come from outside any shadow DOM if the value of "from" starts with a slash.  If "from" has no slash, the search for the matching template is done within the shadow DOM of the (b-)c-c element.  If from starts with "../" then the search is done one level up, etc.

By default, b-c-c will copy in the referenced template into a Shadow DOM snippet.  However, if you prefer a copy straight into innerHTML, add attribute / property "noshadow."  Doing so will, of course, eliminate the slot mechanism from functioning.  Hopefully, if template instantiation becomes a thing, that will provide an alternative for this scenario. 

b-c-c and c-c can also be used in a kind of "Reverse Polish Notation" version of Polymer's dom-if.

## Codeless Web Components

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
    <hello-world></hello-world>
</body>
```

Step 4.  Stare into the abyss. 

### Adding string properties

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
      <script nomodule data-methods="true">
        ({
          fn: function(){
            console.log(this);
            return this;
          },
          onPropsChange: function(name, oldVal, newVal){
              ...
          }
        })
      </script>
      <template id="beautiful" data-str-props="a,b,c">
        <div>
          <slot name="subjectIs"></slot> beautiful</div>
      </template>
```

All attribute changes call onPropsChange if it is defined.

### Adding Object Properties

```html
<template id="beautiful" data-obj-props="d,e">
    <div>
        <slot name="subjectIs"></slot> beautiful
    </div>
</template>
```

Object properties also observe attribute changes with the same name as the property, and also calls onPropsChange.

If you set the attribute value for an object property, it will assume the string is JSON, and will parse it.

Changes to object properties fire events with the name "[name of prop]-changed".

<!--
```
<custom-element-demo>
  <template>
    <div>
        <!-- Polyfill needed for re(dge)tro browsers -->
        <script src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
        <!-- End Polyfills -->

        <script type="module" src="https://unpkg.com/carbon-copy@0.1.35/carbon-copy.js"></script>
        <style>
            div {
              background-color:cornsilk;
            }
          </style>
        
      <h3><a href="https://www.youtube.com/watch?v=eAfyFTzZDMM" target="_blank">Beautiful</a></h3>
      <h4>Christina Aguilera</h4>
      <template id="no-matter">
        <style>
          :host{
            background-color:pink;
          }
          ::slotted(*){
            background-color:mediumspringgreen;
          }
        </style>
        No matter what we <slot name="verb1"></slot> (no matter what we <slot name="verb2"></slot>)
      </template>
      <template id="beautiful">
        <style>
          div{
            background-color:burlywood;
          }
          ::slotted(*){
            color:orchid;
          }
        </style>
        <div>
          <slot name="subjectIs"></slot> beautiful
        </div>
      </template>
      <template id="down">
        <style>
          div{
            background-color:olivedrab;
          }
        </style>
        <div>So don't you bring me down today</div>
      </template>
      <template id="chorus">
          <style>
              div {
                background-color:paleturquoise;
              }
            </style>
        <b-c-c copy from="/beautiful">
          <span slot="subjectIs">
            <slot name="subjectIs1"></slot>
          </span>
        </b-c-c>
        <div>No matter what they say</div>
        <div prop-pronoun>Words
          <slot name="verb1"></slot> bring
          <slot name="pronoun1"></slot> down</div>
        <div>Oh no</div>
        <b-c-c copy from="/beautiful">
          <span slot="subjectIs">
            <slot name="subjectIs2"></slot>
          </span>
        </b-c-c>
        <div>In every single way</div>
        <div prop-pronoun>Yes words
          <slot name="verb2"></slot> bring
          <slot name="pronoun2"></slot> down</div>
        <div>Oh no</div>
        <b-c-c copy from="/down"></b-c-c>
      </template>

  
  
  
  
          <p>Don't look at me</p>
          <p>
            <div>Everyday is so wonderful</div>
            <div>Then suddenly</div>
            <div>It's hard to breathe</div>
            <div>Now and then I get insecure</div>
            <div>From all the pain</div>
            <div>I'm so ashamed</div>
          </p>
          <p>
            <b-c-c copy from="/chorus">

              <span slot="verb1">can't</span>
              <span slot="verb2">can't</span>
              <span slot="pronoun1">me</span>
              <span slot="pronoun2">me</span>
              <span slot="subjectIs1">I am</span>
              <span slot="subjectIs2">I am</span>
            </b-c-c>
          </p>
          <p>
  
            <div>To all your friends you're delirious</div>
            <div>So consumed</div>
            <div>In all your doom, ooh</div>
            <div>Trying hard to fill the emptiness</div>
            <div>The pieces gone</div>
            <div>Left the puzzle undone</div>
            <div>Ain't that the way it is</div>
          </p>
          <p>
            <b-c-c copy from="/chorus">
              <span slot="verb1">can't</span>
              <span slot="verb2">can't</span>
              <span slot="pronoun1">you</span>
              <span slot="pronoun2">you</span>
              <span slot="subjectIs1">You are</span>
              <span slot="subjectIs2">You are</span>
            </b-c-c>
          </p>
          <br>
          <b-c-c copy from="/no-matter">
            <span slot="verb1">do</span>
            <span slot="verb2">do</span>
          </b-c-c>
          <br>
          <b-c-c copy from="/no-matter">
            <span slot="verb1">say</span>
            <span slot="verb2">say</span>
          </b-c-c>
          <div>We're the song inside the tune (yeah, oh yeah)</div>
          <div>Full of beautiful mistakes</div>
          <p>
            <div>And everywhere we go (and everywhere we go)</div>
            <div>The sun will always shine (the sun will always, always, shine)</div>
            <div>And tomorrow we might awake</div>
            <div>On the other side</div>
          </p>
          <p>
            <b-c-c copy from="/chorus">
              <span slot="verb1">won't</span>
              <span slot="verb2">can't</span>
              <span slot="pronoun1">us</span>
              <span slot="pronoun2">us</span>
              <span slot="subjectIs1">We are</span>
              <span slot="subjectIs2">We are</span>
            </b-c-c> 
          </p>
          <p>
            <div>Oh, oh</div>
            <div>Don't you bring me down today</div>
            <div>Don't you bring me down, ooh</div>
            <div>Today</div>
          </p>

    </div>
    </template>
</custom-element-demo>
```
-->

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
