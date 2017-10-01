[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/carbon-copy)

# \<carbon-copy\>

Copy HTML Template into DOM

There are a number of scenarios where a snippet of HTML must be copied (repeatedly) into the DOM tree.  This is partly what the Template Element [was designed for:](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)

>  Think of a template as a content fragment that is being stored for subsequent use in the document. While the parser does process the contents of the \<template\> element while loading the page, it does so only to ensure that those contents are valid; the element's contents are not rendered, however.

Out of the box, the template must be imported programmatically.  This can disrupt the flow when inspecting a document.

The carbon copy element, \<carbon-copy\> or \<c-c\> for short, allows one to declaratively copy contents from an external HTML template (or one already defined in the main document) into the tag's innerHTML.

Note that there are other client-side include web components you may want to compare this one with -- e.g. github's [include-fragment-element](https://github.com/github/include-fragment-element) and [Juicy's juicy-html](https://www.webcomponents.org/element/Juicy/juicy-html) if carbon-copy doesn't meet your needs.

The syntax for this element, at its simplest level, is as follows:

```html
<c-c href="/myPath/toTemplate/myHTMLFile.html#myTemplateId">
</c-c>
```

If no url is specified before the hash symbol, then the code will assume the id exists and is searchable via document.getElementById.

You can specify parameters the referenced template can retrieve via the set attribute, which is a semi-colon delimited list of name/value pairs (using the colon as the assignment operator):

```html
    <c-c href="#noMatter" set="verb:do"></c-c><br>
    <c-c href="#noMatter" set="verb:say"></c-c>
```

The referenced template can retrieve these parameters via the get attribute, also semicolon delimited:

```html
<template id="noMatter">No matter what we <c-c get="verb"></c-c> (no matter what we <c-c get="verb"></c-c>)</template>
```

You can also set attributes and classes similarly.

```html
    <c-c href="#noMatter" verb-props="parentNode.contentEditable:true" set="verb:do;"></c-c>
```

### Changing href

By default, if the href attribute / property changes for an existing c-c element instance, the new template will be appended to the inner content of the c-c element.  Even if you go back to the original template, it will keep getting appended repeatedly.

However, the attribute stamp-href modifies the behavior in the following ways:

- Previous template imports will be hidden
- If you go back to the original template import href, it will unhide what was there.  Thus any editing or navigation done within that DOM tree will persist.

This allows one to switch between already loaded pages instaneously, similar to Polymer's iron-pages element.

### Preprocessing


If a document being imported contains lines like this in the header:

```html
<header>
    ...
    <meta name="preprocessor" content="cc_resolver">
    <meta name="preprocessor" content="zenmu">
    ...
</header>
```

then some preprocessing functions: cc_resolver, and zenmu (described below) will be performed on the import before creating the reusable HTMLTemplates.  They will be passed the referenced document as well as the referring carbon-copy element, and these preprocessing functions can manipulate the document.  By being passed the carbon-copy element, one can infer the url context from which the file was referenced, and hence one can recusively modify the relative url's contained within the file. These preprocessing functions are separate JavaScript files from carbon_copy.js, so users will only incur the performance hit from downloading these functions if the benefits of the preprocessor outweigh the costs.  Users of the carbon-copy element can create their own preprocessor function(s) and add it to the processing pipeline, using these two useful preprocessor functions as a guide.

The functions cc_resolver and zenmu (in this case) must be put into global scope and loaded before the carbon element is utilized (if you add the meta tags as shown above)..

cc_resolver recursively resolves carbon copy (cc) elements.

## Future enhancements:

### Child Property Propagation

When we dynamically add elements in the DOM, these added elements don't immediately benefit from the usual property flow paradigm.  We need to bring the elements up to date. This is done using a semi-colon delimited list of properties that will need to be provided to the inserted elements:

```html
<c-c href="JsonEditorSnippet.html#jes" set-props="watch" watch="[[pot]]"></c-c>
```

The watch attribute shown above is an example of a binding within a Polymer dom-bind element.  But that is not required.  What is key is that somehow if set-props is set to "watch" then the developer is responsible for ensuring that the c-c element's  gets assigned the value of watch.  I.e. element.watch = [the thing we want to set for the children].

The containing c-c element can provide a 

### cc_resolver

Will add resolving support for script and css references.

### Content persistence

The content to import into a c-c tag is identified via the href attribute / property.  However, what happens if we change the value of href?   What if we come back to the original href later? We can handle this in one of two ways

1)  The previous content (including edits) just goes poof!  The previous DOM tree is released, replaced by the new

### Content protection

TBD

### Content merging

TBD

#### Replace

TBD

### zenmu 

The particular function zenmu (in zenmu.js) that comes with this component  might be of interest to those trying to reduce the verbosity of web component markup.

One of the aspects that make Vue and Angular popular is its compact template syntax.

Lack of support for the "is" attribute, as well as the requirement that custom elements only be defined at the tag level (not attribute level -- i.e. no custom attribute standard has been ratified), for now,  means similar syntax is relatively verbose when using custom elements.  

This preprocessor allows us to have our cake and eat it too.  We can utilize compact syntax, which gets expanded during processing.

Note:  This preprocessing could be done on the server-side level just as easily, and/or during the optimizing build.  That would mean less JavaScript processing, but it would also mean a larger (fairly compressible) download.  If done server-side or during the build, the meta tag above should be removed before passing down to the client.  Another option to consider would be to do the preprocessing within a service worker.

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

Emmet syntax treats the div tag special -- because div is the most frequenly used tag.

zenmu gives similar special treatment to the template tag.  So the markup above could be further reduced as follows:

```html
<dom-bind wraps="#myId(inner-stuff.myClass1.myClass2@href://cnn.com@condensed">
    <span>Spans rule!</span>
    <div>Divs divide and conquer!</div>
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

We think it is a common pattern to have the primary attribute match the second part of the custom element tag name.  This, combined with the assumption of the template tag name, allows the markup to be shortened even further:

```html
  <li wrap-in="dom-repeat@:[[items]](">
    <span>[[item.name]]</span>
  </li>
```


### Inserting into slots
 
TBD

### Other
- [ ] Do all set properties in one step (Polymer, other libraries)
- [ ] (Possibly) Explore integrating with streaming ideas.


### Implementation

The implementation of this was originally done using HTMLImports (for external files).  In light of recent announcements regarding the future of HTMLImports, and partly inspired by this [interesting article](https://jakearchibald.com/2016/fun-hacks-faster-content/), a hidden iFrame was tried.  The streaming-element the article describes features many obscure tricks I wasn't aware of, [but it does require a fair amount of code](https://github.com/bahrus/streaming-element/blob/master/streaming-element.js).  While the use of IFrames may be ideal in some problem domains, a quick performance test indicates the performance of Fetch/ShadowDom/innerHTML greatly exceeds that of iframes (and objects) when applied repeatedly.

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
