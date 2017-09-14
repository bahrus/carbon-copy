[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/carbon-copy)

# \<carbon-copy\>

Copy HTML Template into DOM

## Install the Polymer-CLI

There are a number of scenarios where a snippet of HTML must be copied (repeatedly) into the DOM tree.  This is partly what the Template Element [was designed for:](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)

>  Think of a template as a content fragment that is being stored for subsequent use in the document. While the parser does process the contents of the \<template\> element while loading the page, it does so only to ensure that those contents are valid; the element's contents are not rendered, however.

Out of the box, the template must be imported programmatically.  This can disrupt the flow when inspecting a document.

The carbon copy element, allows one to declaratively copy contents from an external HTML template into a sibling of the element.

The syntax for this element, at its simplest level, is as follows:

```html
<carbon-copy href="/myPath/toTemplate/myHTMLFile.html#myTemplateId">
</carbon-copy>
```

Future enhancements:

- [ ] Support HTML Template references within the same document as the consumer
- [ ] (Possibly) Explore imported templates recursively doing their own HTML Imports
- [ ] (Possible) Explore integrating with streaming ideas (see below).
- [ ] (Possible) Add support for url resolving for recusive references. 



Implementation:  The implementation of this was originally done using HTMLImports (for external files).  In light of recents announcements, and partly inspired by this [interesting article](https://jakearchibald.com/2016/fun-hacks-faster-content/), a hidden iFrame is now used instead.  The streaming-element the article describes features many obscure tricks I wasn't aware of, [but it does require a fair amount of code](https://github.com/bahrus/streaming-element/blob/master/streaming-element.js).

_carbon-copy_ is not currently doing any fancy streaming, as the article link above suggests doing.  Rather, this implementation is kind of bare-bones simple, sticking to the basics for now.

A quick performance test on Chrome seems to indicate that the performance "hit" from cloning an HTML template from an iframe into the hosting page is negligible, performing roughly the same as doing it all from the same document space. The biggest negative, performance wise, would probably be the memory overhead / start-up cost of creating and holding on to the hidden iFrame, in addition to the overhead of the http request (which would be there for any external resource).  These combine to suggest that, at least in an optimal / production setting, some degree of bundling of multiple templates together into one file might be beneficial, though this would come at the cost of making updates more expensive. 

Care is taken to cache these hidden iFrames, one for each unique base url path.   

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
