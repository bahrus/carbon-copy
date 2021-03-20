[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/carbon-copy)

<a href="https://nodei.co/npm/carbon-copy/"><img src="https://nodei.co/npm/carbon-copy.png"></a>

b-c-c size:

<img src="http://img.badgesize.io/https://unpkg.com/carbon-copy@0.1.43/build/ES6/b-c-c.iife.js?compression=gzip"/>

c-c size:

<img src="http://img.badgesize.io/https://unpkg.com/carbon-copy@0.1.43/build/ES6/carbon-copy.js?compression=gzip"/>

# \<carbon-copy\>




Copy a template  inside a DOM node. 

## b-c-c

For basic functionality, reference carbon-copy/b-c-c.js and use element name:  b-c-c.  It just clones the source template into the shadowDOM or innerHTML of the element (depending on the value of the noshadow attribute).

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

Note the use of the attribute "copy".  This attribute/property makes the tag more readable, but also acts as an "if" logical operator.  If attribute/property "copy" is present/true, only then will it clone the contents of the referenced template (based on id).  

The copy property is reflect via the data-copy-is attribute ("true"/"false").  This attribute can be used for styling (soon to be replaced by a pseudostate).

In short, b-c-c can be used as a kind of basic "Reverse Polish Notation" version of Polymer's [dom-if](https://polymer-library.polymer-project.org/2.0/docs/devguide/templates#dom-if).

If the attribute "from" changes, b-c-c will blow away what was there before, and clone in the new template.  [c-c, on the other hand, will preserve the existing inner (Shadow) DOM, and make it get hidden via display:none.  If the value of "/from" reverts back, that original DOM will be re-rendered (and the last template hidden).  c-c can be used, combined with templ-mount, to provide an alternative to Polymer's iron-pages, with no legacy dependencies. Subject to change]

Templates can come from outside any shadow DOM if the value of "from" starts with a slash.  If "from" starts with "./", the search for the matching template is done within the shadow DOM of the (b-)c-c element (or outside any ShadowDOM if the (b-)c-c element is outside any ShadowDOM).  If from starts with "../" then the search is done one level up, etc.

By default, b-c-c will copy in the referenced template into a Shadow DOM snippet.  However, if you prefer it copy straight into innerHTML, add attribute / property "noshadow."  Doing so will, of course, eliminate the slot mechanism from functioning.  Hopefully, if template instantiation becomes a thing, that will provide an alternative for this scenario, in terms of declarative support for dynamic content. 

In the meantime / in addiction, b-c-c supports two additional properties for adjusting the content dynamically:

If toBeTransformed/to-be-transformed property/attribute is set, then b-c-c won't append the clone, until a trans-render context object is passed in to property trContext.

## Templatize a materialized DOM element

b-c-c can not only be used to instantiate a template (repeatedly), but also an already materialized DOM element.  It does this by creating a template copy of that DOM element first, and then cloning.  Subsequent copies from the same DOM element will derive from the template copy (so if the DOM element mutates, copies won't see that).

[b-c-c demo](https://jsfiddle.net/bahrus/t0n9eLuo/2/)

## Sample Markup of b-c-c

<detail>
    <summary>Markup</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <style>
          div {
            background-color: cornsilk;
          }
        </style>
    
        <h3><a href="https://www.youtube.com/watch?v=eAfyFTzZDMM" target="_blank">Beautiful</a></h3>
        <h4>Christina Aguilera</h4>
        <template id="no-matter">
          <style>
            :host {
              background-color: blanchedalmond;
            }
          </style>
          No matter what we <slot name="verb1"></slot> (no matter what we <slot name="verb2"></slot>)
        </template>
        <template id="beautiful">
          <style>
            div {
              background-color: burlywood;
            }
          </style>
          <div>
            <slot name="subjectIs"></slot> beautiful
          </div>
        </template>
        <template id="down">
          <div>So don't you bring me down today</div>
        </template>
        <template id="chorus">
          <style>
            div {
              background-color: paleturquoise;
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
      <script type=module src="https://unpkg.com/carbon-copy@0.1.53/b-c-c.js?module"></script>
</body>
</html>
```

## c-c -- Codeless Web Components

For more extended functionality, use element c-c or carbon-copy (reference:  carbon-copy/c-c.js).  

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

### Adding string/numeric/bool properties to your declarative web component

The template can specify a list of primitive properties to add to the automatically generated web component:

```html
<template id="pow">
    <div>
        <slot name="subjectIs"></slot> 
    </div>
</template>
...
<c-c from ="/pow" string-props='["name","rank", "serialNumber"]' num-props='["age", "weight"]' bool-props='["mia"]'>
```

These properties can be read via attributes on the "c-c-pow" element instances (in this example), or passed in as properties.  They will reflect to [custom psuedo states](https://www.chromestatus.com/feature/6537562418053120) when the browser allows it.


### Bind to the properties

c-c (or carbon-copy) supports binding to the UI using Github's [Template-Parts library](https://github.com/github/template-parts/).

Example:

```html
<template id=hello-world>
    <div>Hello, {{place}}</div>
</template>
<c-c copy from="/hello-world" string-props='["place"]'></c-c>

<hello-world place="mars"></hello-world>
```

[Demo](https://jsfiddle.net/bahrus/t0n9eLuo/4/)

### Attaching event handlers

Use [on-to-me](https://github.com/bahrus/on-to-me) [or](https://github.com/bahrus/pass-down) [other](https://github.com/bahrus/p-et-alia) [declarative](https://github.com/bahrus/xtal-decor) vocabulary libraries.

<!--### Adding Object Properties [TODO]

```html
<template id="beautiful" data-obj-props="d,e">
    <div>
        <slot name="subjectIs"></slot> beautiful
    </div>
</template>
```

Object properties also observe attribute changes with the same name as the property, and also calls onPropsChange.

If you set the attribute value for an object property, it will assume the string is JSON (surrounded by single quotes), and will parse it.

Changes to object properties fire events with the name "[name of prop]-changed".-->

## Viewing Your Element Locally

1.  Install node.
2.  Clone or for fork this git repo.
3.  In a command prompt from the folder of this git repo:

```
$ npm run serve
```

4.  Open browser to http://localhost/demo.





