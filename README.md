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
- [ ] (Possible) Explore integrating with streaming ideas.
- [ ] (Possible) Add support for url resolving for recusive references. 



Implementation:  The implementation of this was originally done using HTMLImports (for external files).  In light of recents announcements regarding the future of HTMLImports, and partly inspired by this [interesting article](https://jakearchibald.com/2016/fun-hacks-faster-content/), a hidden iFrame was tried.  The streaming-element the article describes features many obscure tricks I wasn't aware of, [but it does require a fair amount of code](https://github.com/bahrus/streaming-element/blob/master/streaming-element.js).  While the use of IFrames may be ideal in some problem domains, a quick performance test indicates the performance of Fetch/ShadowDom/innerHTML greatly exceeds that of iframes (and objects).

So the current approach is to use fetch / create ShadowDOM / set innerHTML inside the shadowDOM.  This allows id's from different documents to not get confused.

So far, this implementation is kind of bare-bones simple, sticking to the basics for now.

  

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
