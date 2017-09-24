[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/carbon-copy)

# \<carbon-copy\>

Copy HTML Template into DOM

There are a number of scenarios where a snippet of HTML must be copied (repeatedly) into the DOM tree.  This is partly what the Template Element [was designed for:](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)

>  Think of a template as a content fragment that is being stored for subsequent use in the document. While the parser does process the contents of the \<template\> element while loading the page, it does so only to ensure that those contents are valid; the element's contents are not rendered, however.

Out of the box, the template must be imported programmatically.  This can disrupt the flow when inspecting a document.

The carbon copy element, \<carbon-copy\> or \<c-c\> for short, allows one to declaratively copy contents from an external HTML template (or one already defined in the main document) into the tag's innerHTML.

The syntax for this element, at its simplest level, is as follows:

```html
<c-c href="/myPath/toTemplate/myHTMLFile.html#myTemplateId">
</c-c>
```

If no url is specified before the hash symbol, then the code will assume the id exists and is searchable via document.getElementById.

You can specify parameters the referenced template can retrieve via the set attribute:

```html
    <c-c href="#noMatter" set="verb:do"></c-c><br>
    <c-c href="#noMatter" set="verb:say"></c-c>
```

The referenced template can retrieve these parameters via the get attribute:

```html
<template id="noMatter">No matter what we <c-c get="verb"></c-c> (no matter what we <c-c get="verb"></c-c>)</template>
```

You can also set attributes and classes similarly.

```html
    <c-c href="#noMatter" verb-props="parentNode.contentEditable:true" set="verb:do;"></c-c>
```

## Future enhancements:

### Preprocessing

If a document being imported contains lines like this:

```html
    <meta name="preprocessor" content="myPreprocessor">
    <meta name="preprocessor" content="zenmu">
```

then some preprocessing functions: myPreProcessor, and zenmu (described below) will be performed on the import before creating the reusable HTMLTemplates.  They will be passed the referenced document, and they can manipulate the document.

The functions myPreprocessor and zenmu (in this case) must be put into global scope.

The particular function zenmu (in zenmu.js) that comes with this component is a particular function that might be of interest to those trying to reduce the verbosity of web component markup.

One of the aspects that make Vue and Angular popular is its compact template syntax.

Lack of support for the "is" attribute, as well as the requirement that custom elements only be defined at the tag level (not attribute level), for now,  means similar syntax is relatively verbose when using custom elements.  

This preprocessor allows us to have our cake and eat it too.  We can utilize compact syntax, which gets expanded during processing.

Note:  This preprocessing could be done on the server-side level just as easily, and/or during the optimizing build.  That would mean less JavaScript processing, but it would also mean a larger (fairly compressible) download.  If done server-side or during the build, the meta tag above should be removed before passing down to the client.  Another option to consider would be to do the preprocessing within a service work.

Carbon-copy will only load the client-side JavaScript processor if it sees the meta tag present.

#### Preprocessing directive # 1:  Inner Wrapping

We need the ability to wrap elements while importing.  We draw inspiration from  emmet / zen markup to achieve compact notation:

```html
<dom-bind wraps="template#myId(inner-stuff.myClass1.myClass2@href://cnn.com@condensed">
    <span>Spans rule!</span>
    <div>Divs divide and conquer!</div>
</dom-bind>
```
becomes:

```html
    <dom-bind>
        <template id="myId">
            <inner-stuff class="myClass1 myClass2" href="//cnn.com" condensed>
                <span>Spans rule!</span>
                <div>Divs divide and conquer!</div>
            </inner-stuff>
        </template>
    </dom-bind>
```

#### Preprocessing directive # 2:  Outer Wrapping

```html
  <li wrap-in="dom-repeat@repeat:[[items]](template">
    <span>[[item.name]]</span>
  </li>
```

becomes

```html
    <dom-repeat repeat="[[items]]">
        <template>
            <li>
                <span>[[item.name]]</span>
            </li>
        </template>
    </dom-repeat>
```

### Inserting into slots
 
TBD

### Other
- [ ] Do all set properties in one step (Polymer, other libraries)
- [ ] (Possibly) Explore integrating with streaming ideas.
- [ ] (Possibly) Add support for url resolving for recusive references. 

### Implementation

The implementation of this was originally done using HTMLImports (for external files).  In light of recents announcements regarding the future of HTMLImports, and partly inspired by this [interesting article](https://jakearchibald.com/2016/fun-hacks-faster-content/), a hidden iFrame was tried.  The streaming-element the article describes features many obscure tricks I wasn't aware of, [but it does require a fair amount of code](https://github.com/bahrus/streaming-element/blob/master/streaming-element.js).  While the use of IFrames may be ideal in some problem domains, a quick performance test indicates the performance of Fetch/ShadowDom/innerHTML greatly exceeds that of iframes (and objects).

So the current approach is to use fetch / create ShadowDOM / set innerHTML inside the shadowDOM.  This allows id's from different documents to not get confused.


## Installation

Install the component using [Bower](http://bower.io/):
```sh
$ bower install carbon-copy --save
```

## Viewing Your Element

```sh
$ polymer serve
Open http://127.0.0.1:8081/components/carbon-copy
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
